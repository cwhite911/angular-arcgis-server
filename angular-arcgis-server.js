(function(window, document, undefined){
  'use strict';
  var app = angular.module('agsserver', [
    'ngCookies',
    'ngResource'
  ]);
  app.factory('Ags', ['$resource', '$cacheFactory', '$http', '$q',
    function($resource, $cacheFactory, $http, $q){
      var base = $cacheFactory('base');
      //Create connection to ArcGIS REST Services Directory
      var Server = function (conn){
        this.conn = {
          protocol: conn.protocol || 'http',
          host: conn.host || '',
          path: conn.path || '/arcgis/rest/services'
        };
        return this;
      };
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
        getBase: function(){
        //Get host
          var baseUrl = this.getConn();
          //Set config
          var config = {
            params: {f:'json'},
            cache: base
          };
          //Gets the base of the ArcGIS server structure
          return $http.get(baseUrl, config).then(function(res){
              if (typeof res.data === 'object') {
	               return res.data;
	            }
              else {
	            // invalid response
	               return $q.reject(res.data);
	            }
            }, function(res){
              return $q.reject(res.data);
            });
        },
        getFolder: function() {
          //Get ArcGIS Server folder details
        },
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
        request: function (options){
          //Get host
          var that = this;
            var baseUrl = this.getConn(),
                url;
            //Set config
            var config = {
              params: {f:'json'},
              cache: base
            };
            url = baseUrl + '/' + options.folder + '/' + options.service + '/' + options.server;
            if(base.get(url)){
              //Do something
            }
            else {
              //Get the layer and table information from server if it is not already cached
              $http.get(url, config).then(function(res){
                base.put(url, true);
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
                console.log(that.layers);
              });
            }
        }
      };
      //Returns server contructor class
      return (Server);
    }
  ]);
})();
