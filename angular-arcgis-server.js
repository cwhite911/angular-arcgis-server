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
        //Get data from ArcGIS REST Services Directory
        connect: function (format){
          //Checks for valid input
          try {
            var inFormat = format || {f:'json'};
            var types = ['json', 'wsdl'];
            console.log(typeof inFormat);
            typeof(inFormat) === 'object' && inFormat.f.indexOf(types) ? inFormat : console.log('Please check that you set a valid format object');
          }
          catch (err){
            console.log(err);
          }
          //Setting up action for resource
          var actions = {
            'get': {
              method: 'GET',
              cache: base,
              timeout: 5000
            }
          };
          //Defines resource
          var serviceDirectory = $resource(this.getConn, inFormat, actions);
          //Need to figure out if I want to return resource or results
          return serviceDirectory;
        },
        //Method that returns directory structure
        getDirectoryStructure: function (url, options){
          //Set config
          var config = {
            params: options,
            cache: base
          };

        },
        //Parse throgh server
        load: function (options){
          var serviceUrl,
              folderUrl;
          //Checks for valid input
          try {
            var options = options || {f:'json'};
            var types = ['json', 'wsdl'];
            typeof(options) === 'object' && options.f.indexOf(types) ? options : console.log('Please check that you set a valid format object');
          }
          catch (err){
            console.log(err);
          }
          var that = this;
          //Get host
          var baseUrl = that.getConn();
          //Set config
          var config = {
            params: options,
            cache: base
          };
          //Get the base of ArcGIS server file structure
          $http.get(baseUrl, config).success(function(data, status){
            angular.extend(that.conn, data);
            console.log(status + ": Base Directory");
            //Checks if folders are empty
            if (that.conn.folders){
              //Loops through each folder setting folders and services
              that.conn.folders.forEach(function(folder){
                folderUrl = baseUrl + '/' + folder;
                $http.get(folderUrl, config).success(function(data, status){
                  //Rebuilds data structures with new data
                  that.conn.folders[that.conn.folders.indexOf(folder)] = {name: folder, folders: data.folders, services: data.services};
                  console.log(status + ": Folders/Services");
                  //Loop through services structure
                  data.services.forEach(function(data){
                    serviceUrl = baseUrl + '/' + data.name + '/' + data.type;
                    angular.extend(config.params, {f: 'pjson'});
                    $http.get(serviceUrl, config).success(function(data, status){
                      console.log(data);
                    });
                  });
                });
              });
            }
          });
          return that.conn;
        },
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
        request: function (options){
          ///Example Options
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
          //Get host
            var baseUrl = this.getConn(),
                url;
            //Set config
            var config = {
              params: {f:'json'},
              cache: base
            };
            url = baseUrl + '/' + folder +
            $http.get(url)
        }
      };
      //Returns server contructor class
      return (Server);
    }
  ]);
})();
