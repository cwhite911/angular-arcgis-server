'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', 'ags', function($scope, ags){
    //Create new server object
    var testServer = new Ags({'host': '152.46.17.144'});
    //Gets connection string
    $scope.serverString = testServer.getConn();
    console.log($scope.serverString);
    //TODO- CREATE server parse
    //Example:
    //Create Server
    //    server = new Ags('exampel.com');
    //
    //////Get features////////////////////////

    //    Server.getLayer('folder', 'layer/table', options).then(function (data){
    //       --Do Something
    //    });

  }]);
