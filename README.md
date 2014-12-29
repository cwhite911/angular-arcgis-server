angular-arcgis-server
======================================

Utility for ArcGIS Server 10.22

## Purpose

Angular-arcgis-server module is designed to provide an easier way to interact with ArcGIS server by using descriptive layer names to make requests to the server. This provides a more robust foundation for an application when a services layer ids are subject to change from changes on the server. The module also provides easy conversion from ESRI JSON to GeoJSON.

## Parameters

Method Request

Options

| Parameter  | Details | Type | Required | Default |
| ------------- | ------------- | :-----------: | ----------- | -------------- |
| folder  | name of folder  | String | true | null |
| layer   | name of layer   | String | true | null |
| service | name of service | String | true | null |
| server  | type of server ['FeatureServer', 'MapServer', 'GPServer'] | String | true | 'FeatureServer' |
| actions | The type of request sent to the server
            * 'query'  
            * 'applyEdits'
            * 'addFeatures'
            * 'updateFeatures'
            * 'deleteFeatures'
            * 'generateRenderer' | String | true | 'query' |
| params  | Parameters matching setting defined in [ArcGIS Server 10.22 REST API](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/The_ArcGIS_REST_API/02r300000054000000/)| Object | true | null |
| geojson | Controls whether or not to return response as geojson | Boolean | false | false |
| timeout | Sets timeout | Number | false | 5000 |
| header  | Sets request header | Object | false | {'Content-Type': 'text/plain'} |


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
