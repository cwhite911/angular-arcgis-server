'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', '$http', 'Ags', function($scope, $http, Ags){
    //Create new server object

    var mapsServer = new Ags({host: 'maps.raleighnc.gov'});

    // console.log(streetServer);
    // var streetCache = $cacheFactory('streetCache');
    var streets_ms = mapsServer.setService({
      folder:'StreetsDissolved',
      service: '',
      server: 'MapServer',
    });

    


    console.log(streets_ms);
    //Auto fill function for street names

      var streetOptions = {
        layer: 'Streets',
        geojson: false,
        actions: 'query',
        params: {
          f: 'json',
          outFields: 'CARTONAME',
          text: 'W',
          returnGeometry: false,
          orderByFields: 'CARTONAME ASC'
        }
      };
      streets_ms.request(streetOptions)
      .then(function(data){
        $scope.street = data;
      });




}]);
