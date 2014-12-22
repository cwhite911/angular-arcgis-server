'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'Ags', function($scope, $http, Ags){
    //Create new server object
    var testServer = new Ags({'host': '152.46.17.144'});
    console.log(testServer);





    //Set up options
    var options = {
      folder: 'GEWA',
      layer: 'Streams',
      service: 'gewa_sde',
      server: 'FeatureServer',
      params: {
        f: 'json',
        where: 'OBJECTID > 0'
      },
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: 5000,
      method: 'GET',
      geojson: true,
      actions: 'query'
    };
    //Set intentional error for testing layer: Boudary1 does not exisit
    var options1 = {
      folder: 'GEWA',
      layer: 'Boundary',
      service: 'gewa_sde',
      server: 'FeatureServer',
      params: {
        f: 'json',
        where: 'OBJECTID > 0',
        returnGeometry: false
      },
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: 5000,
      method: 'GET',
      geojson: true,
      actions: 'query'
    };

    testServer.request(options)
      .then(function(data){
      console.log('Getting the base');
      console.log(data);
      $scope.streams = data;
    });

    testServer.request(options1)
    .then(function(data){
      console.log('Getting the base');
      console.log(data);
      $scope.boundary = data;
    });


  }]);
