/* ags.service.js */

/**
* @desc Enables easy access to ArcGIS Server resources
* @example
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .factory('agsService', agsService);

    agsService.$inject = ['$cacheFactory', '$http', '$q', 'geojsonService'];

    function agsService($cacheFactory, $http, $q, geojsonService){
      var Server, base, actions;

      base = $cacheFactory('base');

      actions = [
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
      ];

      Server = function (conn){
        this.conn = {
          protocol: conn.protocol || 'http',
          host: conn.host || '',
          path: conn.path || '/arcgis/rest/services'
        };
        this.layers= [];
        return this;
      };

      /**
      *@type method
      *@name resetConn
      *@desc Resets connection properties of Server instances
      *@param {Object} options, contains configuration settings
      *@returns {Object} Server
      */

      Server.prototype.resetConn = function(connection){
        angular.extend(this.conn, connection);
        return this;
      };

      /**
      *@type method
      *@name getConn
      *@desc Checks if host is set
      *@param {Object} options, contains configuration settings
      *@returns {string} connection uri
      */

      Server.prototype.getConn = function() {
        var c = this.conn;
        return c.protocol + '://' + c.host + c.path;
      };

      /**
      *@type method
      *@name setService
      *@desc Creates an new instances of a Server object pedefined with a service
      *@param {Object} options, contains configuration settings
      *@returns {Object} Server
      */

      Server.prototype.setService = function (options) {
        checkOptions(options);
        var baseUrl = this.getConn(),
        url = baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;
        var newService = new Server(this.conn);
        newService.serviceUrl = url;
        return newService;
      };

      /**
      *@type method
      *@name setRequst
      *@desc Sets actions options for request
      *@param {string} The services base url
      *@param {number} The layer id
      *@param {Object} options, contains configuration settings
      *@returns {Object} Updated request options
      */

      Server.prototype.setRequst = function(url, layerId, options){
        var req;
        // Request parameters
        if (options.actions){
          actions.forEach(function(action){
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
      };

      /**
      *@type method
      *@name requestToken
      *@desc Get Access token from ArcGIS Server
      *@param {Object} options, contains configuration settings
      *@returns {HttpPromise} Future object
      */

      Server.prototype.requestToken = function(options){
        var reqOptions, conn, deferred, url;
        deferred = $q.defer();
        conn = this.conn;
        url = c.protocol + '://' + c.host + '/arcgis/tokens/';
        reqOptions = {
          request: 'getToken',
          f: 'json',
          expiration: 60
        };
        angular.extend(reqOptions, options);

              $http({
                method: 'POST',
                url: url,
                data: $.param(reqOptions),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              })
              .success(function (data) {
                deferred.resolve(data);
              })
              .catch(function(err){
                deferred.reject(err);
              });

              return deferred.promise;
        };

      /**
      *@type method
      *@name request
      *@desc Sends requests to ArcGIS Server
      *@param {Object} options, contains configuration settings
      *@returns {HttpPromise} Future object
      */

      Server.prototype.request = function(options){
        var that, config, baseUrl, url, deferred;
        that = this;
        deferred = $q.defer();
        options = checkOptions(options);
        baseUrl = that.getConn();
        config = setParams(options);
        url = this.serviceUrl || baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;

        //Gets the base of the ArcGIS server structure
        $http.get(url, config)
          .then(setRequestLayer)
          .then(function(layerId){
              // Request parameters
              var req = that.setRequst(url, layerId, options);
              //Make request to server and return promise
              return $http(req);
            })
            .then(configureReturn)
            .then(function(res){
              deferred.resolve(res);
            })
            .catch(function(err){
              deferred.reject(err);
            });

          return deferred.promise;

          function setRequestLayer (res){
            var _layers, layerId, deferred;
            var isInteger = Number.isInteger || function(value) {
              return typeof value === "number" &&
                     isFinite(value) &&
                     Math.floor(value) === value;
            };
            deferred = $q.defer();
            if (res.data.error) { deferred.reject(res.data);}
            else{
              //Concat layers and tables array
               _layers = res.data.layers.concat(res.data.tables);
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
              }
              //If layer option is set returns layer id
              else {
                //Gets the layer id for requested layer
                layerId = getLayerId(_layers, options.layer);
                //Checks if layerId is a number and returns it else it rejects the promise
                if(isInteger(layerId)){
                  deferred.resolve(layerId);
                }else{
                  deferred.reject(res.data);
                }
              }

            }
            return deferred.promise;
          }

          function configureReturn (res){
            var deferred = $q.defer();
            if (typeof res.data === 'object') {
              if (options.geojson === true){
                return geojsonService.toGeojson(res.data);
              }
              deferred.resolve(res.data);
            }
            else {
              deferred.reject(res.data);
            }
            return deferred.promise;
          }

      };



      return (Server);

      //Set request params
      function setParams(options){
        var config;
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
        return config;
      }

      //Checks if Options are valid
      function checkOptions(options){
        try {
          if (typeof options !== 'object'){
            throw {error: 'Options is not an object!'};
          }
          else if (options === {}){
            throw {error: 'Options are empty'};
          }
          else {
            return options;
          }
        }
        catch (err){
          console.error(err);
        }
      }

      //Returns layer id
      function getLayerId(_layers, layerName) {
        var layerId;
        layerName = layerName.trim();

        _layers.forEach(function(layer){
          if (layerName === layer.name){
            layerId = layer.id;
          }
        });

        return layerId;
      }

      //Returns string list of layerids or reserved word
      function getLayerIdList(_layers, layerString){
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
      }



    }

})();
