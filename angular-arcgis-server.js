(function(window, document, undefined){
  'use strict';
  var app = angular.module('agsserver', [
    'ngCookies',
    'ngResource'
  ]);
  app.factory('Ags', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory){
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
        //Get data from ArcGIS REST Services Directory
        connect: function (format){
          //Checks for valid input
          try {
            var inFormat = format || {f:'json'};
            var types = ['json', 'wsdl'];
            typeof(inF) === 'object' && inFormat.f in types ? inFormat : console.log('Please check that you set a valid format object');
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
        }
      };
      //Returns server contructor class
      return (Server);
    }
  ]);
})();
