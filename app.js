'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', 'ags', function($scope, ags){
    //Create new server object
    var testServer = new ags({'host': '152.46.17.144'});
    //Gets connection string
    $scope.serverString = testServer.getConn();
    console.log($scope.serverString);
  }]);
