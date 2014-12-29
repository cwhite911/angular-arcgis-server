(function(window, document, undefined){
  'use strict';
  var app = angular.module('agsserver', []);

//Provides tool to convert esri json to geojson
  app.service('geojsonTools', function(){
    return {
      //Function to created geojson features
      geoJsonFeature: function (data, type){
        //Basic geojson feature structure
        var feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": type,
            "coordinates": []
          }
        };
        switch (type){
          case 'Point':
            //Update point data
            feature.geometry.coordinates = [data.geometry.x, data.geometry.y];
            break;

          case 'LineString':
            //Update line data
            feature.geometry.coordinates = data.geometry.paths[0];
            break;

          case 'Polygon':
            //Update Polygon data
            feature.geometry.coordinates = data.geometry.rings;
            break;

          default:
            console.log({error: 'Improper geometry type'});
            return;
        }
              //Add attribute data to feature
        feature.properties = data.attributes;
        return feature;
      },

      //Returns ArcGIS Server returned json as geojson
      //Parameters- data is the returned data from ArcGIS server
      toGeojson: function (data){
        var features = data.features, feature, geojson, point, line, polygon;

        //Geojson shell format
        geojson = {
          "type": "FeatureCollection",
          "features": []
        };

        try {
          //Check Spatial Reference
          if (data.spatialReference.wkid !== 4326) {
            throw {error: 'Please set params outSR to 4326'};
          }
          //Loop through each feature from esri response
          for (var _i = 0,  _len = features.length; _i < _len; _i++){
            feature = features[_i];
            //Check geometry type
            switch (data.geometryType) {

              case 'esriGeometryPoint':
                //Add feature to geojson
                geojson.features.push(this.geoJsonFeature(feature, 'Point'));
                break;

              case 'esriGeometryPolyline':
                //Add feature to geojson
                geojson.features.push(this.geoJsonFeature(feature, 'LineString'));
                break;

              case 'esriGeometryPolygon':
                //Add feature to geojson
                geojson.features.push(this.geoJsonFeature(feature, 'Polygon'));
                break;

              default:
                throw {error: 'esri geometry not recognized, failed geojson conversion'};

              }
            }

          }
          catch(err){
            console.log(err);
          }
          finally {
            return geojson;
          }
        }
    };

  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  app.factory('Ags', ['$cacheFactory', '$http', '$q', 'geojsonTools',
    function($cacheFactory, $http, $q, geojsonTools){

      //Create cache factory
      var base = $cacheFactory('base');
      //PRIVATE FUNCTIONS

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Return layers from cache
      var getLayers = function (options){
        //Find correct layer id
        for (var _i = o, _len = that.layers.length; _i < _len; _i++ ){
          //Check for matching folder
          if(that.layers[_i].folder === options.folder){
            var _service = that.layers[_i].service;
            //Loop through services
            _service.forEach(function(_info){
              if(_service[_info].name === options.service && _service[_info].server === options.server){
                return _service[_info].layers;
              }
            });
          }
        }
      };

      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      //Returns layer id
      var getLayerId = function (_layers, layerName) {
        var layerId;
        _layers.forEach(function(layer){
          layerName === layer.name ? layerId = layer.id : layer;
        });
        return layerId || 'Layer Not Found'
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////////

      //Constructor Class

      //Create connection to ArcGIS REST Services Directory/////////////////////////////////////////////////
      var Server = function (conn){
        this.conn = {
          protocol: conn.protocol || 'http',
          host: conn.host || '',
          path: conn.path || '/arcgis/rest/services'
        };
        return this;
      };


      //Server class methods in prototype//////////////////////////////////////////////////////////////////////////

      Server.prototype = {
        //Method that allows base server connections to be reset
        resetConn: function (conn){
          angular.extend(this.conn, conn);
          return this;
        },

        //Checks if host is set and return connection string, if host is not set return error message to console
        getConn: function () {
          var c = this.conn;
          var url = c.protocol + '://' + c.host + c.path;
          c.host ? url : console.log('Error: Please set host');
          return url;
        },

        //Server Actions
        actions: [{
            type: 'query',
            method: 'GET' || 'POST'
          },
          {
            type: 'applyEdits',
            method: 'POST'
          },
          {
            type: 'addFeatures',
            method: 'POST'
          },
          {
            type: 'updateFeatures',
            method: 'POST'
          },
          {
            type: 'deleteFeatures',
            method: 'POST'
          },
          {
            type: 'generateRenderer',
            method: 'GET' || 'POST'
          }],


          //Stores layer details
        layers: [],

        //Method that gets data about the server
        request: function(options){
          //Check that option are set as an object
          try {
            if (typeof options !== 'object') throw {error: 'Options is not an object!'};
          }
          catch (err){
            console.log(err);
          }
          var that = this;
        //Get host
          var baseUrl = this.getConn();
          //Set config
          var config = {
            params: {f:'json'},
            cache: base
          };
          var url = baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;
          
          //Gets the base of the ArcGIS server structure
          return $http.get(url, config).then(function(res){
              if (typeof res.data === 'object') {
                //Concat layers and tables array
                var _layers = res.data.layers.concat(res.data.tables);
                //set layers if layer has not been set
                _layers.length > 0 && that.layers.length === 0 ?
                that.layers = [{
                  folder: options.folder,
                  service: [{
                    name: options.service,
                    server: options.server,
                    layers: _layers
                  }],
                }] : that.layers;

                //Gets the layer id for requested layer
                var layerId = getLayerId(_layers, options.layer);

                //Checks if layerId is a number and returns it else it rejects the promise
                if(typeof layerId === 'number'){
                  return layerId;
                }else{
                  return  $q.reject(res.data);
                }

	            }
              else {
	            // invalid response
	               return $q.reject(res.data);
	            }
            }, function(res){
              return $q.reject(res.data);
            })
            .then(function(layerId){
              // Request parameters
              var req = {
                method: options.method,
                url: url + '/' + layerId + '/' + options.actions,
                headers: options.headers,
                params: options.params,
                timeout: options.timeout
              };
              //Make request to server and return promise
              return $http(req)
              .then(function(res){
                if (typeof res.data === 'object') {
                  console.log(res.data);
                  if (options.geojson === true){
                    return geojsonTools.toGeojson(res.data);
                  }
                  return res.data;
                }
                else {
                  // invalid response
                  console.log('invalide response');
                  return $q.reject(res.data);
                }
              }, function(res){
                //Something went wrong
                console.log({error: 'Promise rejected - Check your options and server'});
                return $q.reject(res.data);
              });
            });
        }
        //ADD FEATURE, DELETE FEATURE, UPDATE FEATURE, GET FEATURE
        ///Example Options//////////////////////////////////////////////////
        // options = {
        //   folder: 'GEWA',
        //   layer: 'Streams',
        //   service: 'gewa_sde',
        //   server: 'FeatureServer' || 'MapServer' || 'GPServer',
        //   params: {},
        //   header: {
        //     'Content-Type': undefined
        //   },
        //   timeout: 5000,
        //   method: 'GET' || 'POST',
        //   geojson: true || false,
        //   actions: 'query'
        // };
        ///////////////////////////////////////////////////////////////
      };
      //Returns server contructor class
      return (Server);
    }
  ]);
})();
