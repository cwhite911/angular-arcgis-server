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
          subdomain: conn.subdomain || '',
          domain: conn.domain,
          port: conn.port || '',
          path: conn.path || '/arcgis/rest/services'
        };
        return this;
      };
      Server.prototype = {
        //Method that allows base server connections to be reset
        resetConn: function (conn){
          angular.extend(this.conn, conn);
          return this;
        }
      };
      return (Server);
    }
  ]);
});
