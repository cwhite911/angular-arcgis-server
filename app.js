'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'AgsService', function($scope, $http, AgsService){
    //Create new server object

    var mapsServer = $scope.mapsServer = new AgsService({host: 'services.arcgis.com', path: '/v400IkDOw1ad7Yad/arcgis/rest/services/'});

    // console.log(streetServer);
    // var streetCache = $cacheFactory('streetCache');

    var street_fs = $scope.street_fs = mapsServer.setService({
      folder:'',
      service: 'NCAUG_2015',
      server: 'FeatureServer',
      // auth: true
    });

    $scope.mapConfig = {
      center: [
          34.03495050416125,
          -77.89332389831543
        ]
    }
    // console.log(streets_fs);
    //Auto fill function for street names

      var streetOptions = {
        layer: 'Survey',
        geojson: true,
        actions: 'query',
        params: {
          f: 'json',
          where: '1=1',
          returnGeometry: true,
          outSR: 4326
        }
      };
      street_fs.request(streetOptions)
      .then(function(data){
        $scope.survey = data;
      },
      function(err){
        console.log(err);
      });


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
