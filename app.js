'use strict';
// Declare app level module which depends on views, and components
angular.module('app', ['agsserver']).
  controller('test', ['$scope', 'Ags', function($scope, Ags){
    //Create new server object
    var testServer = new Ags({'host': '152.46.17.144'});

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
    var options1 = {
      folder: 'GEWA',
      layer: 'Boundary',
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
    console.log(testServer.request(options));

    console.log(testServer.request(options1));
    var makePromiseWithSon = function(options) {
	        // This service's function returns a promise, but we'll deal with that shortly
	        testServer.request(options)
	            // then() called when son gets back
	            .then(function(data) {
	                // promise fulfilled
	                if (data) {
	                    console.log(data);
	                } else {
	                    console.log('bad');
	                }
	            }, function(error) {
	                // promise rejected, could log the error with: console.log('error', error);
	                console.log('rejected');
	            });
	    };
      makePromiseWithSon(options);
      // makePromiseWithSon(options1);
  // testServer.request(options).then(function(data){
  //   console.log(data);
  // });

    // promise.then(function(data){
    //   console.log('look at all the data');
    //   console.log(data);
    // });

    // console.log(testServer.request(options));


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
