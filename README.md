angular-arcgis-server
======================================

Utility for ArcGIS Server 10.2.2

## Purpose

Angular-arcgis-server module is designed to provide an easier way to interact with ArcGIS server by using descriptive layer names to make requests to the server. This provides a more robust foundation for an application when a services layer ids are subject to change from changes on the server. The module also provides easy conversion from ESRI JSON to GeoJSON.

## Install

Add via [bower](http://bower.io/)

```
  bower install angular-arcgis-server -S

```

Add script to html

```html

  <script src="bower_components/angular-arcgis-server/dist/angular-arcgis-server.js"></script>

```

## Usage

Inject module and add factory to controller

```javascript

angular.module('app', ['agsserver']).
controller('test', [ 'Ags', function(Ags){}]);

```

## API

### Create server

#### Ags(options)

##### Returns new server object

Options (object)

| Parameter  | Details | Type | Required | Default |
| :------------- | ------------- | :-----------: | :-----------: | -------------- |
| host   | Host where server is located | *String* | true | null |
| protocol  | Protocol to be used  | *String* | false | 'http' |
| path | Path to server | *String* | false | '/arcgis/rest/services' |

#### Example

Create ArcGIS server object

```javascript

//Create new server object

var testServer = new Ags({'host': <Your Host> });

```


### Methods

#### setService(options)

##### Returns a Server object set to make requests on a specified service.

Options (object)

| Parameter  | Details | Type | Required | Default |
| :------------- | ------------- | :-----------: | :-----------: | -------------- |
| folder  | Name of folder  | *String* | true | null |
| service | Name of service | *String* | true | null |
| server  | Type of server <ul><li>'FeatureServer'</li><li>'MapServer'</li><li>'GPServer'</li></ul> | *String* | true | 'FeatureServer' |

#### Example

Define options

```javascript

//Setup options

var options = {
  folder: <folder>,
  service: <service>,
  server: 'FeatureServer',
};

```

Make request to server

```javascript

//Set service

var myFeatureService = testServer.setService(options);

```

#### request(options)

##### Makes request to server and returns promise, a specific service can be set using the setService method or by including the folder, service and server in the option parameter.

Parameters

Options (object)

| Parameter  | Details | Type | Required | Default |
| :------------- | ------------- | :-----------: | :-----------: | -------------- |
| folder  | Name of folder  | *String* | false | null |
| service | Name of service | *String* | false | null |
| server  | Type of server <ul><li>'FeatureServer'</li><li>'MapServer'</li><li>'GPServer'</li></ul> | *String* | false | 'FeatureServer' |
| layer   | Name of layer   | *String* | false | If layer is not set it is assumed that action find, identify, or export is being used see [example 3] |
| actions | The type of request sent to the server <ul><li>'query'</li><li>'applyEdits'</li><li>'addFeatures'</li><li>'updateFeatures'</li><li>'deleteFeatures'</li><li>'generateRenderer'</li><li>'identify'</li><li>'find'</li><li>'export'</li></ul> | *String* | true | 'query' |
| params  | Parameters matching setting defined in [ArcGIS Server 10.2.2 REST API](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/The_ArcGIS_REST_API/02r300000054000000/)| Object | true | null |
| geojson | Controls whether or not to return response as geojson | *Boolean* | false | false |
| timeout | Set timeout | *Number* | false | 5000 |
| header  | Set request header | *Object* | false | {'Content-Type': 'text/plain'} |

#### Example 1

Define options with no service set

```javascript

//Setup request options
var options = {
  folder: <folder>,
  service: <service>,
  server: 'FeatureServer',
  layer: <layer>,
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

#### Example 2

Create service

```javascript

//Setup setService options

var options = {
  folder: <folder>,
  service: <service>,
  server: 'FeatureServer',
};

//Create service object

var myFeatureService = testServer.setService(options);

```

Make request to server

```javascript

//Setup request options

var options = {
  layer: <layer>,
  geojson: true,
  actions: 'query'
  params: {
    f: 'json',
    where: 'OBJECTID > 0'
  }
};

//Make request

myFeatureService.request(options)
  .then(function(data){
    //Do something
  });


```

#### Example 3

Use Find action on a mapServer

##### Note

```
In params.layers use layer names, layer ids or mixed

Yes- params.layers = 'buildings, roads, addresses';

Yes - params.layers = '0,1,2';

Yes - params.layers = 'buildings, 1, addresses';

```

```javascript

//Setup setService options

var options = {
  folder: <folder>,
  service: <service>,
  server: 'MapServer',
};

//Create service object

var myFeatureService = testServer.setService(options);

```

Make request to server



```javascript

//Setup request options

var options3 = {
  params: {
    f: 'json',
    searchText: 'Main St',
    searchFields: 'street_address',
    layers: '0, roads, 2', //Use layer names or layer ids
    sr: 4326
  },
  actions: 'find',
  geojson: true
};

//Make request

myFeatureService.request(options)
.then(function(data){
  //Do something
});


```



#### utilsGeom(type, options)

##### Makes request to ArcGIS server geometry utilities, takes a single options object as parameter.

| Types | Options (object) |
| ----- | ------- |
| Areas and Lengths | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Areas_and_Lengths/02r3000000t4000000/) |
| Auto Complete | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Auto_Complete/02r3000000s0000000/) |
| Buffer | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Buffer/02r3000000s5000000/) |
| Convex Hull | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Convex_Hull/02r3000000pq000000/) |
| Cut | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Cut/02r3000000v5000000/) |
| Densify | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Densify/02r3000000np000000/) |
| Difference | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Difference/02r3000000s3000000/) |
| Distance | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Distance/02r3000000z3000000/) |
| Generalize | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Generalize/02r30000010n000000/) |
| Intersect | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Intersect/02r3000000sr000000/) |
| Label Points | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Label_Points/02r3000000p5000000/) |
| Lengths  | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Lengths/02r3000000qz000000/) |
| Offset  | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Offset/02r3000000v6000000/) |
| Project | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Project/02r3000000pv000000/) |
| Relation | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Relation/02r3000000wz000000/) |
| Reshape  | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Reshape/02r3000000z0000000/) |
| Simplify  | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Simplify/02r3000000pn000000/) |
| Trim Extend | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Trim_Extend/02r30000010z000000/) |
| Union | [Source Info](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Union/02r3000000zq000000/) |

#### Example

Project data from SRID 4326 to SRID 102100

```javascript

//Set options
var projectOptions = {
  f: 'json',
  geometries: {
    geometryType: 'esriGeometryPoint',
    geometries: [ {"x": -76.9346809387207 , "y": 38.1779196445415 }]
  },
  inSR: 4326,
  outSR: 102100
};

//Make request
testServer.utilsGeom('project', projectOptions)
.then(function(data){
  //Do something
});


```

#### Contribute

Contributions are welcomed! Please just fork and submit a pull request.
Thanks!
