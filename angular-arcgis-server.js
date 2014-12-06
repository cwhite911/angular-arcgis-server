(function(){
  'use strict';
  var app = angular.module('angular-arcgis-server', [
    'ngCookies',
    'ngResource'
  ]);
  app.factory('agsFactory', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory){
      //Create connection to ArcGIS REST Services Directory
      var Server = function (conn){
        this.conn = {
          protocol: conn.protocol || 'http://',
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
          c.host ? return c.protocol + '/' + c.host + '/' + c.path : return console.log('Error: Please set host');
        }
      };
      return (Server);
    }
  ]);
});
