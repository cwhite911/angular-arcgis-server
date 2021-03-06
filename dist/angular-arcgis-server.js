(function(){
  'use strict';
  angular.module('agsserver', ['ngCookies']);
})();

/* ags.service.js */

/**
* @desc Enables easy access to ArcGIS Server resources
* @example
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .factory('AgsService', agsService);

    agsService.$inject = ['$cacheFactory', '$http', '$q', '$cookies', 'geojsonService'];

    function agsService($cacheFactory, $http, $q, $cookies, geojsonService){
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

      /**
      *@type Constructor
      *@name Server
      *@desc Server Constructor Class
      *@param {Object} options, contains configuration settings
      *@returns {Object} Server
      */

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
        var config, token;
        checkOptions(options);
        var baseUrl = this.getConn(),
        url = baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;
        var newService = new Server(this.conn);
        newService.serviceUrl = url;
        config ={params: { f: 'json'}};
        if (options.auth){
          // while (this.isTokenValid()){
            token = $cookies.get('agsToken');
            config = {params: { f: 'json', token: token}};
          // }
        }
        $http.get(url, config).then(function(res){
          var join = res.data.layers.concat(res.data.tables);
          newService.layers = join;
          newService.fullExtent = res.data.fullExtent;
          return newService;
        })
        .catch(function(err){
          return newService;
        });
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
        url = conn.protocol + '://' + conn.host + '/arcgis/tokens/';
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
      *@name isTokenValid
      *@desc Check if token is currently valid
      *@returns {Boolean}
      */

      Server.prototype.isTokenValid = function(){
        var d, time, token, expires;
        token = $cookies.get('agsToken');
        expires = $cookies.get('agsExpires');
        // expires = parseInt(expires, 10);
        time = Date.now();

        try {
          if (!token){
            throw new Error('Token does not exist');
          }
          else if (time > expires){
            throw new Error('Token is expired');
          }
          else{
            return true;
          }
        }
        catch (err){
          return false;
        }
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
              that.initialExtent = res.data.initialExtent;
              that.fullExtent = res.data.fullExtent;
              //Concat layers and tables array
               _layers = res.data.layers.concat(res.data.tables);
              //set layers if layer has not been set
              that.layers = that.layers.length === 0 ? _layers : that.layers;


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

      /**
      *@type method
      *@name getLayerId
      *@desc Take a layers name and returns its layer id
      *@param {String} name of service layer
      *@returns {HttpPromise} Future object
      */

      Server.prototype.getLayerId = function(layername){
        var layers = this.layers;
        var deferred = $q.defer();

        if (Array.isArray(layers) && layers.length > 0){
          var filtered = layers.filter(filterId);
          if (filtered.length === 1){
            deferred.resolve(filtered[0]);
          }
          else{
            deferred.reject('Layer Id not found');
          }
        }
        else{
          deferred.reject('No layers set in services');
        }
        return deferred.promise;

        function filterId(id){
          return id.name === layername;
        }
      };

      /**
      *@type method
      *@name getLayerDetails
      *@desc Take a layers name and returns details from server as json
      *@param {String} name of service layer
      *@returns {HttpPromise} Future object
      */

      Server.prototype.getLayerDetails = function(layername){
        var layers = this.layers,
          uri = this.serviceUrl,
          deferred = $q.defer();

          this.getLayerId(layername)
            .then(function(layerid){
              return(uri + '/' + layerid.id + '?f=json');
            })
            .then(getJson)
            .then(function(res){
              deferred.resolve(res);
            })
            .catch(function(err){
              deferred.reject(err);
          });

        return deferred.promise;

        function getJson(url){
          return $http.get(url);
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

(function(){
  "use strict";
  angular
    .module('agsserver')
    .factory('geojsonService', geojsonService);

    function geojsonService(){

      var service = {
        toGeojson: toGeojson
      };
      return service;

      /**
      *@type function
      *@name geojsonFeature
      *@desc Creates geojson feature
      *@param {Object} data, geometry and attribute data from ESRI JSON
      *@param {string} geometry type
      *@returns {Object} Geojson feature
      */
      //Function to created geojson features
      function geojsonFeature(data, type){

        var feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": type,
            "coordinates": []
          }
        };
        try {
          switch (type){
            case 'Point':
              feature.geometry.coordinates = [data.geometry.x, data.geometry.y];
              break;
            case 'LineString':
              feature.geometry.coordinates = data.geometry.paths[0];
              break;
            case 'Polygon':
              feature.geometry.coordinates = data.geometry.rings;
              break;
            default:
              throw new Error('Improper geometry type:', type);
          }
          //Add attribute data to feature
          feature.properties = data.attributes;
          return feature;
        }
        catch (err){
          console.error(err);
        }
        finally{
          return feature;
        }
      }

        //Returns ArcGIS Server returned json as geojson
        //Parameters- data is the returned data from ArcGIS server
        function toGeojson (data){
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
                throw new Error('Please set params outSR to 4326');
              }
              //Loop through each feature from esri response
              for (var _i = 0,  _len = features.length; _i < _len; _i++){
                feature = features[_i];
                switch (data.geometryType || feature.geometryType) {
                  case 'esriGeometryPoint':
                    geojson.features.push(geojsonFeature(feature, 'Point'));
                    break;
                  case 'esriGeometryPolyline':
                    geojson.features.push(geojsonFeature(feature, 'LineString'));
                    break;
                  case 'esriGeometryPolygon':
                    geojson.features.push(geojsonFeature(feature, 'Polygon'));
                    break;
                  default:
                    throw new Error('Esri geometry type not recognized, failed geojson conversion:', data.geometryType || feature.geometryType);

                  }
                }
              }
              catch(err){
                console.error(err);
              }
              finally {
                return geojson;
              }
            }
          }


})();

/* agsFeatureForm.directive.js */

/**
* @desc Builds out ready to go form from ArcGIS Server Feature Service
* @example <ags-feature-form></ags-feature-form>
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .directive('agsFeatureForm', agsFeatureForm);

    function agsFeatureForm(){
      return {
        restrict: 'E',
        templateUrl: '/directives/agsFeatureForm.directive.html',
        transclude: true,
        scope: {
          service: '=', //required
          layername: '@', //required
          auth: '=', //defaults false
          map: '=', //defaults true
          geojson: '=', //defaults false
          config: '=' //optional
        },
        controller: controller,
        link: link
      };
    }

    function controller($scope, $cookies, $timeout, $q, AgsService){
      var token, formMap,
          service = $scope.service,
          layername = $scope.layername,
          configDefualts = {
            BASEMAP: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            BASEMAP_ATTRIB: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          },
          //Set defaults
          errorMessage = $scope.errorMessage = false,
          map = $scope.map = $scope.map === false ? $scope.map : true,
          auth = $scope.auth = $scope.auth === true ? $scope.auth : false,
          geojson = $scope.geojson = $scope.geojson === true ? $scope.geojson : false,
          config = $scope.config ? angular.extend(configDefualts, $scope.config) : configDefualts;


        $scope.formData = {};
      //Checks inputs
      $timeout(function(){
        checkAttr(service, layername)
          .then(service.getLayerDetails.bind(service))
          .then(generateMap)
          .catch(function(err){
            console.error(err);
          });
      }, 250);

      //submits form to server
      $scope.submit = function (formData) {
        var marker = $scope.marker.getLatLng();
        var options = {
          layer: $scope.layername,
          actions: 'addFeatures',
          params: {
            f: 'json',
            features: [{
              attributes: formData,
              geometry: {
                x: marker.lng,
                y: marker.lat
              }
            }]
          }
        };

        //Sets token if auth is set
        if ($scope.auth){
          options.params.token = getToken();
        }

        checkOptions(options);

        $scope.service.request(options)
          .then(function (res) {
            if (res.error){
              $scope.errorMessage = true;
            }
            else {
              $scope.formData = {};
              $scope.marker.removeFrom(formMap);
            }
          })
          .catch(function(err){
            $scope.errorMessage = err;
          });
      };

      //Returns token string
      function getToken(){
        var d, time, token;
        try {
          d = new Date();
          time = d.getTime();
          token = $cookies.get('agsToken');
          if (time > token.expires){
            throw new Error({error: 'Token is expired'});
          }
          return token.token;
        }
        catch (err){
          console.error(err);
        }

      }

      //check directive attributes
      function checkAttr(service, layer){
        var deferred = $q.defer();
        try{
          if (!service instanceof AgsService){
            throw new Error('Service is not instanceof of AgsService');
          }
          else if (!service.serviceUrl){
            throw new Error('Service is not set...please use setService() to define service');
          }
          else if (!layer){
            throw new Error('Layername is not defined in directive');
          }
          else if (!layerExist(service,layer)){
            throw new Error('Layername does not exist');
          }
          else{
            deferred.resolve(layer);
          }
        }
        catch(err){
          deferred.reject(err);
        }
        finally{
          return deferred.promise;
        }
      }

      //Checks if layer exists in service
      function layerExist(serive, layer){
        return service.layers.some(filterLayer);

        function filterLayer(item){
          return (item.id === layer || item.name === layer);
        }
      }

      //Creates map
      function generateMap(layerDetails){

        console.log(layerDetails.data);
        $scope.tableName = layerDetails.data.name;
        if (layerDetails.data.type === 'Table'){
          $scope.map = false;
        }
        else if (map){
            formMap = L.map('form-map').setView($scope.config.center, 15);
              // .fitBounds([[$scope.service.fullExtent.ymax, $scope.service.fullExtent.xmax],[$scope.service.fullExtent.ymin, $scope.service.fullExtent.xmin]]);

            L.tileLayer(config.BASEMAP, {
                attribution: config.BASEMAP_ATTRIB,
                maxZoom: 18
            }).addTo(formMap);
            formMap.on('click', function(e){
              if (!$scope.marker){
                $scope.marker = L.marker(e.latlng, {
                  draggable: true
                }).addTo(formMap);
              }
              else{
                $scope.marker.setLatLng(e.latlng);
                $scope.marker.update();
                $scope.marker.addTo(formMap);
              }
            });
        }
        else {
          map = map;
        }
        $scope.fields = setRelationships(layerDetails.data);//layerDetails.data.fields;
      }

      //Checks request options
      function checkOptions(options){
        try {
          if (typeof options !== 'object'){
            throw new Error({error: 'Options is not an object'});
          }
          else if (options === {}){
            throw new Error({error: 'Options are empty'});
          }
          else if (!options.layer){
            throw new Error({error: 'Layer is not defined'});
          }
          else if (!Array.isArray(options.params.features)){
              throw new Error({error: 'Features improperly formatted'});
          }
          else {
            return options;
          }
        }
        catch (err){
          console.error(err);
        }
      }

      //Generate Relationship selections
      function setRelationships(layer){
        var relationships = layer.relationships,
            fields = layer.fields;
        if (Array.isArray(relationships) && relationships > 0){
          relationships.forEach(function(rel){
            switch (rel.cardinality) {
              case 'esriRelCardinalityOneToMany':
                if (rel.role === 'esriRelRoleDestination'){
                  console.log(rel);
                }
                break;
              default:

            }
          });
        }
        else {
          return fields;
        }
      }

      //Gets relationship data from server
      function getRelationship(){

      }


    }

    function link(scope, element, attrs) {
      // scope.modal = $('.modal', element[0]);
      // scope.modal.modal({keyboard: false, backdrop: 'static'});
    }

})();

/* agsLoginForm.directive.js */

/**
* @desc Easy to use ArcGIS Token authentication form
* @example <ags-login-form></ags-login-form>
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .directive('agsLoginForm', agsLoginForm);

    function agsLoginForm(){
      return {
        restrict: 'E',
        templateUrl: '/directives/agsLoginForm.directive.html',
        scope: {
          server: '='
        },
        controller: controller,
        link: link
      };
    }

    function controller($scope, $cookies, $interval){
      $scope.loggedIn = true;
      $scope.errorMessage = false;

      //Checks if token is valid
      $interval(function(){
        if (checkBootstrap($scope.modal) && $scope.server.isTokenValid()){
          $scope.modal.modal('hide');
        }
        else if(checkBootstrap($scope.modal) && !$scope.server.isTokenValid()){
          $scope.modal.modal('show');
        }
        else {
          $scope.errorMessage = true;
        }
      }, 1000);

      $scope.login = function (user, password) {
        $scope.server.requestToken({username: user, password: password})
          .then(function (token) {
            if (token.error){
              $scope.loggedIn = false;
            }
            else {
              $cookies.put('agsToken', token.token);
              $cookies.put('agsExpires', token.expires);
              $scope.loggedIn = true;
              if (checkBootstrap($scope.modal)){
                $scope.modal.modal('hide');
              }
            }
          })
          .catch(function(err){
            console.error(err);
            $scope.errorMessage = err;
          });
      };
    }

    function link(scope, element, attrs) {
      scope.modal = $('.modal', element[0]);
      if (checkBootstrap(scope.modal)){
        scope.modal.modal({keyboard: false, backdrop: 'static'});
      }
    }

    function checkBootstrap(modal){
      if (typeof modal.modal === 'function'){
        return true;
      }
      else {
        return false;
      }
    }


})();
