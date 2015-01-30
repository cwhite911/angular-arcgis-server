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
        var features, feature, geojson;
          //Geojson shell format
          geojson = {
            "type": "FeatureCollection",
            "features": []
          };

          try {
            //Check Spatial Reference
            if (data.features && data.spatialReference.wkid === 4326) {
              features = data.features;
            }
            else if (data.results[0].geometry.spatialReference.wkid === 4326){
              features = data.results;
            }
            else {
              throw {error: 'Please set params outSR to 4326'};
            }
            //Loop through each feature from esri response
            for (var _i = 0,  _len = features.length; _i < _len; _i++){
              feature = features[_i];
              //Check geometry type
              switch (data.geometryType || feature.geometryType) {

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



      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      //Returns layer id
      var getLayerId = function (_layers, layerName) {
        var layerId;
        layerName = layerName.trim();
        _layers.forEach(function(layer){
          layerName === layer.name ? layerId = layer.id : layer;
        });
        return layerId;
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////////

      //Returns string list of layerids or reserved word
      var getLayerIdList = function (_layers, layerString){
        //List of reserved layers values
        var resevedStrings = ['all', 'visible', 'top', ''];
        //Chekc if layer value is in list of reserved words, if not get layer id
        if (resevedStrings.indexOf(layerString) === -1){
          var layerlist = layerString.split(','),
          idlist = layerlist.map(function(layer){
            //Checks if number is value
            var isnum = /^\d+$/.test(layer);
            if (isnum){
              return layer;
            }
            else{
              return getLayerId(_layers, layer);
            }
          });
          return idlist;
        }
        else {
          return layerString;
        }

      };


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
        actions: [
          {
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
            method: 'GET'
          },
          {
            type: 'identify',
            method: 'GET',
          },
          {
            type: 'find',
            method: 'GET'
          },
          {
            type: 'export',
            method: 'GET',
          }
        ],

        setService: function (options) {
          try {
            if (typeof options !== 'object'){
              throw {error: 'Options is not an object!'};
            }
            if (options === {}){
              throw {error: 'Options are empty'};
            }
          }
          catch (err){
            console.log(err);
          }
          var baseUrl = this.getConn(),
          url = baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;
          var newService = new Server(this.conn);
          newService.serviceUrl = url;
          return newService;
        },
          //Stores layer details
        layers: [],

        //Sets actions options for request
        setRequst: function (url, layerId, options){
          var req;
          console.log(layerId);
          console.log(typeof layerId);
          // Request parameters
          this.actions.forEach(function(action){
            if (action.type === options.actions){
              req = {
                method: action.method,
                url: layerId || layerId === 0 ? url + '/' + layerId + '/' + action.type : url + '/' + action.type,
                headers: options.headers || {'Content-Type': 'text/plain'},
                params: options.params || {},
                timeout: options.timeout || 5000
              };
              if (action.method === 'POST'){
                req.params.features = JSON.stringify(req.params.features);
                // base.put('lastOID', )
              }
            }
          });
          return req;
        },

        //Use server utilities
        utilsGeom: function (type, options) {
          //Check that option are set as an object
          try {
            if (typeof options !== 'object'){
              throw {error: 'Options is not an object!'};
            }
            if (options === {}){
              throw {error: 'Options are empty'};
            }
          }
          catch (err){
            console.log(err);
          }
          var that = this,
              baseUrl = that.getConn(),
              url,
              config;

          //Set url
          url = baseUrl + '/Utilities/Geometry/GeometryServer/' + type;

          //Configuration
          config = {
            params: options
          };
          return $http.get(url, config).then(function(res){
            console.log(res.data);
            return res.data;
          }, function(res){
            return $q.reject(res.data);
          });
        },

        //Method that gets data about the server
        request: function(options){
          //Check that option are set as an object
          try {
            if (typeof options !== 'object') {
              throw {error: 'Options is not an object!'};
            }
            if (options === {}){
               throw {error: 'Options are empty'};
            }
          }
          catch (err){
            console.log(err);
          }
          var that = this,
              //Get host
              baseUrl = that.getConn(),
              //Set config
              config = {
                params: {f:'json'},
                cache: base
              },
              //Set url
              url = this.serviceUrl || baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;

          //Gets the base of the ArcGIS server structure
          return $http.get(url, config).then(function(res){
              if (typeof res.data === 'object') {
                //Concat layers and tables array
                var _layers = res.data.layers.concat(res.data.tables);
                //set layers if layer has not been set
                that.layers.length === 0 ?
                that.layers = [{
                  folder: options.folder,
                  service: [{
                    name: options.service,
                    server: options.server,
                    layers: _layers
                  }],
                }] : that.layers;

                //Checks if layer option is set if not is checks action tpye
                if (!options.layer){
                  switch (options.actions){
                    case 'find':
                    case 'identify':
                    case 'export':
                      if (options.params.layers){
                        options.params.layers = getLayerIdList(_layers, options.params.layers);
                      }
                      break;
                    default:
                      return;
                  }
                  //Returns undefinded if no layer is set
                  return;
                }
                //If layer option is set returns layer id
                else {
                  //Gets the layer id for requested layer
                  var layerId = getLayerId(_layers, options.layer);
                  //Checks if layerId is a number and returns it else it rejects the promise
                  if(typeof layerId === 'number'){
                    return layerId;
                  }else{
                    return  $q.reject(res.data);
                  }
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
            var req = that.setRequst(url, layerId, options);
            console.log(req);
              //Make request to server and return promise
              return $http(req)
              .then(function(res){
                if (typeof res.data === 'object') {
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

      };


      //Returns server contructor class
      return (Server);
    }
  ]);
})();
