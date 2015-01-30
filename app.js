'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'Ags', function($scope, $http, Ags){
    //Create new server object
    var testServer = new Ags({host: 'mapstest.raleighnc.gov'});
    console.log(testServer);

    var myService = {
      folder: 'PublicUtility',
      service: 'ProjectTracking',
      server: 'FeatureServer'
    };

    var myService1 = {
      folder: 'PublicUtility',
      service: 'ProjectTracking',
      server: 'MapServer'
    };

    var pt_fs = testServer.setService(myService);
    var pt_ms = testServer.setService(myService1);


    //Set up options
    var options1 = {
      folder: 'PublicUtility',
      service: 'ProjectTracking',
      server: 'FeatureServer',
      layer: 'RPUD.Project_Envelopes',
      params: {
        f: 'json',
        where: 'OBJECTID > 0 AND OBJECTID < 10',
        outSR: 4326
      },
      headers: {
        'Content-Type': 'text/plain'
      },
      timeout: 5000,
      geojson: true,
      actions: 'query'
    };

    var options3 = {
      params: {
        f: 'json',
        searchText: 'retreat',
        searchFields: 'PROJECTNAME',
        layers: '1',
        sr: 4326
      },
      actions: 'find',
      geojson: true
    };



    console.log('MapServer: ' + pt_ms);
    console.log(pt_ms);

    pt_ms.request(options1)
    .then(function(data){
      console.log(data);
      $scope.test = data;
    });

    testServer.request(options1)
      .then(function(data){
      console.log(data);
      $scope.streams = data;
    });

    var options2 = {
      layer: 'RPUD.SHEETTYPES',
      params: {
        f: 'json',
        where: 'OBJECTID > 0',
      },
      actions: 'query'
    };

    pt_fs.request(options2)
    .then(function(data){
      console.log(data);
      $scope.boundary = data;
    });


    pt_ms.request(options3)
    .then(function(data){
      console.log(data);
      $scope.find = data;
    });


}]);
