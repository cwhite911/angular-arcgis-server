angular-arcgis-server
======================================

Utility for ArcGIS Server 10.22

## Purpose

Angular-arcgis-server module is designed to provide an easier way to interact with ArcGIS server by using descriptive layer names to make requests to the server. This provides a more robust foundation for an application when a services layer ids are subject to change from changes on the server. The module also provides easy conversion from ESRI JSON to GeoJSON.

## API

Method to make request to server

request(options)

Options

| Parameter  | Details | Type | Required | Default |
| :------------- | ------------- | :-----------: | :-----------: | -------------- |
| folder  | Name of folder  | String | true | null |
| layer   | Name of layer   | String | true | null |
| service | Name of service | String | true | null |
| server  | Type of server <ul><li>'FeatureServer'</li><li>'MapServer'</li><li>'GPServer'</li></ul> | String | true | 'FeatureServer' |
| actions | The type of request sent to the server <ul><li>'query'</li><li>'applyEdits'</li><li>'addFeatures'</li><li>'updateFeatures'</li><li>'deleteFeatures'</li><li>'generateRenderer'</li></ul> | String | true | 'query' |
| params  | Parameters matching setting defined in [ArcGIS Server 10.22 REST API](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/The_ArcGIS_REST_API/02r300000054000000/)| Object | true | null |
| geojson | Controls whether or not to return response as geojson | Boolean | false | false |
| timeout | Set timeout | Number | false | 5000 |
| header  | Set request header | Object | false | {'Content-Type': 'text/plain'} |


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
      geojson: true,
      actions: 'query'
      params: {
        f: 'json',
        where: 'OBJECTID > 0'
      }
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
