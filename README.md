angular-arcgis-server (In Development)
======================================

Utility for ArcGIS Server

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
      server: 'FeatureServer' || 'MapServer' || 'GPServer',,
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
