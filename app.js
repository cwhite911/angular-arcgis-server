'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'Ags', function($scope, $http, Ags){
    //Create new server object

    var mapsServer = $scope.mapsServer = new Ags({host: 'maps.raleighnc.gov'});

    // console.log(streetServer);
    // var streetCache = $cacheFactory('streetCache');
    var streets_ms = mapsServer.setService({
      folder:'PublicUtility',
      service: 'ProjectTracking',
      server: 'FeatureServer',
    });


    console.log($scope.mapsServer);

    console.log(streets_ms);
    //Auto fill function for street names

      var streetOptions = {
        layer: 'Project Tracking',
        geojson: false,
        actions: 'query',
        params: {
          f: 'json',
          where: 'OBJECTID > 1',
          returnGeometry: false,
          outSR: 4326
        }
      };
      streets_ms.request(streetOptions)
      .then(function(data){
        $scope.street = data;
      },
      function(err){
        console.log(err);
      });




}]);
