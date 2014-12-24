angular-arcgis-server
======================================

Utility for ArcGIS Server 10.22

## Purpose

Angular-arcgis-server module is designed to provide an easier way to interact with ArcGIS server by using descriptive layer names to make requests to the server. This provides a more robust foundation for an application when a services layer ids are subject to change from changes on the server. The module also provides easy conversion from ESRI JSON to GeoJSON.


## Usage

Inject module and add factory to controller

```javascript

  angular.module('app', ['agsserver']).
    controller('test', [ 'Ags', function(Ags){}]);

```

Create ArcGIS server object

```javascript

  //Create new server object
  var testServer = new Ags({'host': <Your Host> });

```

Define options

```javascript

  //Setup options
    var options = {
      folder: <folder>,
      layer: <layer>,
      service: <service>,
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

```

Make request to server

```javascript

  //Make request to Server
  testServer.request(options)
    .then(function(data){
      //Do something
  });

```
