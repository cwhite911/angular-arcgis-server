(function(window, document, undefined){
  'use strict';
  angular.module('agsserver', ['ngCookies'])



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  .service('Ags', ['$cacheFactory', '$http', '$q', 'geojsonService',
    function($cacheFactory, $http, $q, geojsonService){

      //Create cache factory
      var base = $cacheFactory('base');
      //PRIVATE FUNCTIONS


      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      //Returns layer id
      var getLayerId = function (_layers, layerName) {
        var layerId;
        layerName = layerName.trim();

        _layers.forEach(function(layer){
          if (layerName === layer.name){
            layerId = layer.id;
          }
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
          // c.host ? url : console.log('Error: Please set host');
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
          // Request parameters
          if (options.actions){
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
          }
          else {
            req = {
              method: 'GET',
              url: layerId || layerId === 0 ? url + '/' + layerId : url,
              headers: options.headers || {'Content-Type': 'text/plain'},
              params: options.params || {f: 'json'},
              timeout: options.timeout || 5000
            };
          }

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
            params: options,
            header: {'Content-Type': 'text/plain'}
          };
          return $http.post(url, config).then(function(res){
            // console.log(res.data);
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
              config,
              //Get host
              baseUrl = that.getConn();
              //Set config
              if (options.params.token){
                config = {
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  params: {
                    f:'json',
                    token: options.params.token
                  },
                  cache: base
                };
              }
              else{
                config = {
                  params: {f:'json'},
                  cache: base
                };
            }

              //Set url
            var  url = this.serviceUrl || baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;

          //Gets the base of the ArcGIS server structure
          return $http.get(url, config).then(function(res){
              if (typeof res.data === 'object' && !res.data.error) {
                //Concat layers and tables array
                var _layers = res.data.layers.concat(res.data.tables);
                //set layers if layer has not been set
                that.layers = that.layers.length === 0 ? [{
                  folder: options.folder,
                  service: [{
                    name: options.service,
                    server: options.server,
                    layers: _layers
                  }]
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
              //Make request to server and return promise
              return $http(req)
              .then(function(res){
                if (typeof res.data === 'object') {
                  if (options.geojson === true){
                    return geojsonService.toGeojson(res.data);
                  }
                  return res.data;
                }
                else {
                  // invalid response
                  return $q.reject(res.data);
                }
              }, function(res){
                //Something went wrong
                return $q.reject(res.data);
              });
            });
        },

        //Get Access token
        requestToken: function (options){

          var reqOptions = {
            request: 'getToken',
            f: 'json',
            expiration: 60
          };

          angular.extend(reqOptions, options);

          var c = this.conn,
              url = c.protocol + '://' + c.host + '/arcgis/tokens/',
              deferred = $q.defer();
                $http({
                  method: 'POST',
                  url: url,
                  data: $.param(reqOptions),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                  deferred.resolve(data);
                });

                return deferred.promise;

          }
        };
      //Returns server contructor class
      return (Server);
    }
  ]);

})();
