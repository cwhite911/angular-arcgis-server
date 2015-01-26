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

    var pt_fs = testServer.setService(myService);
    console.log(pt_fs);

    //Set up options
    var options1 = {
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

    testServer.request(pt_fs, options1)
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

    testServer.request(pt_fs, options2)
    .then(function(data){
      console.log(data);
      $scope.boundary = data;
    });
    
    // testServer.request(boundaryOptions)
    // .then(function(data){
    //   console.log('Polygon Data');
    //   console.log(data);
    //   $scope.boundary = data;
    // });
    //
    //
    // var projectOptions = {
    //   f: 'json',
    //   geometries: {
    //     geometryType: 'esriGeometryPoint',
    //     geometries: [ {"x": -76.9346809387207 , "y": 38.1779196445415 }]
    //   },
    //   inSR: 4326,
    //   outSR: 102100
    // };
    //
    // testServer.utilsGeom('project', projectOptions)
    //   .then(function(data){
    //
    //     var sampleLocationsOptions = {
    //       folder: 'GEWA',
    //       layer: 'Sample Locations',
    //       service: 'gewa_sde',
    //       server: 'FeatureServer',
    //       params: {
    //         f: 'json',
    //         gdbVersion: 'SDE.DEFAULT',
    //         features: [
    //           {
    //             "geometry": data.geometries[0]
    //           }
    //         ]
    //     },
    //     actions: 'addFeatures',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   };
    //
    //
    //
    //     testServer.request(sampleLocationsOptions)
    //     .then(function(data){
    //       console.log('Point Data');
    //       console.log(data);
    //       $scope.gamefish = data;
    //     });
    //   })


  }]);
