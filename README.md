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

## API

### Create server

#### Ags(options)

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

#### request(options)

##### Makes request to server and takes a single options object as a parameter.

Options (object)

| Parameter  | Details | Type | Required | Default |
| :------------- | ------------- | :-----------: | :-----------: | -------------- |
| folder  | Name of folder  | *String* | true | null |
| layer   | Name of layer   | *String* | true | null |
| service | Name of service | *String* | true | null |
| server  | Type of server <ul><li>'FeatureServer'</li><li>'MapServer'</li><li>'GPServer'</li></ul> | *String* | true | 'FeatureServer' |
| actions | The type of request sent to the server <ul><li>'query'</li><li>'applyEdits'</li><li>'addFeatures'</li><li>'updateFeatures'</li><li>'deleteFeatures'</li><li>'generateRenderer'</li></ul> | *String* | true | 'query' |
| params  | Parameters matching setting defined in [ArcGIS Server 10.22 REST API](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/The_ArcGIS_REST_API/02r300000054000000/)| Object | true | null |
| geojson | Controls whether or not to return response as geojson | *Boolean* | false | false |
| timeout | Set timeout | *Number* | false | 5000 |
| header  | Set request header | *Object* | false | {'Content-Type': 'text/plain'} |

#### Example

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
