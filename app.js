'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', 'Ags', function($scope, Ags){
    //Create new server object
    var testServer = new Ags({'host': '152.46.17.144'});
    //Gets connection string
    $scope.serverString = testServer.getConn();
    //Connect Method
    testServer.getBase().then(function(data){
      $scope.testPromise = data;
    });
    var options = {
      folder: 'GEWA',
      layer: 'Streams',
      service: 'gewa_sde',
      server: 'FeatureServer',
      params: {
        f: 'json'
      },
      header: {
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      method: 'GET',
      geojson: true,
      actions: 'query'
    };
    testServer.request(options);


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
