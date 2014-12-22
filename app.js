'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'Ags', function($scope, $http, Ags){
    //Create new server object
    var testServer = new Ags({'host': '152.46.17.144'});
    console.log(testServer);





    //Set up options
    var streamsOptions = {
      folder: 'GEWA',
      layer: 'Streams',
      service: 'gewa_sde',
      server: 'FeatureServer',
      params: {
        f: 'json',
        where: 'OBJECTID > 0',
        outSR: 4326
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
    var boundaryOptions = {
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
      geojson: false,
      actions: 'query'
    };

    var gamefishOptions = {
      folder: 'GEWA',
      layer: 'Gamefish',
      service: 'gewa_sde',
      server: 'FeatureServer',
      params: {
        f: 'json',
        where: 'OBJECTID > 0',
        outSR: 4326
      },
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: 5000,
      method: 'GET',
      geojson: true,
      actions: 'query'
    };

    testServer.request(streamsOptions)
      .then(function(data){
      console.log('Getting the base');
      console.log(data);
      $scope.streams = data;
    });

    testServer.request(boundaryOptions)
    .then(function(data){
      console.log('Getting the base');
      console.log(data);
      $scope.boundary = data;
    });

    testServer.request(gamefishOptions)
    .then(function(data){
      console.log('Getting the base');
      console.log(data);
      $scope.gamefish = data;
    });


  }]);
