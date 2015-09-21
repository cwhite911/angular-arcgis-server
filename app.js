'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'AgsService', function($scope, $http, AgsService){
    //Create new server object

    var mapsServer = $scope.mapsServer = new AgsService({host: 'maps.raleighnc.gov'});

    // console.log(streetServer);
    // var streetCache = $cacheFactory('streetCache');


    var street_fs = $scope.street_fs = mapsServer.setService({
      folder:'PublicUtility',
      service: 'ProjectTracking',
      server: 'FeatureServer',
    });


    console.log($scope.mapsServer);
    console.log($scope.street_fs);

    // console.log(streets_fs);
    //Auto fill function for street names

      // var streetOptions = {
      //   layer: 'Project Tracking',
      //   geojson: true,
      //   actions: 'query',
      //   params: {
      //     f: 'json',
      //     where: 'OBJECTID > 1',
      //     returnGeometry: true,
      //     outSR: 4326
      //   }
      // };
      // street_fs.request(streetOptions)
      // .then(function(data){
      //   $scope.street = data;
      // },
      // function(err){
      //   console.log(err);
      // });


      //
      // var streetOptions2 = {
      //   layer: 'Project Tracking',
      //   geojson: true,
      //   actions: 'query',
      //   params: {
      //     f: 'json',
      //     where: 'OBJECTID > 1',
      //     returnGeometry: false,
      //     outSR: 4326
      //   }
      // };
      // streets_ms.request(streetOptions2)
      // .then(function(data){
      //   $scope.street = data;
      // },
      // function(err){
      //   console.log(err);
      // });




}]);
