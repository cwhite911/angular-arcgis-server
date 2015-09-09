(function(){
  "use strict";
  angular
    .module('agsserver')
    .factory('geojsonService', geojsonService);

    function geojsonService(){

      var service = {
        toGeojson: toGeojson
      };
      return service;

      //Function to created geojson features
      function geojsonFeature(data, type){
          //Basic geojson feature structure
          var feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": type,
              "coordinates": []
            }
          };
          switch (type){
            case 'Point':
              feature.geometry.coordinates = [data.geometry.x, data.geometry.y];
              break;
            case 'LineString':
              feature.geometry.coordinates = data.geometry.paths[0];
              break;
            case 'Polygon':
              feature.geometry.coordinates = data.geometry.rings;
              break;
            default:
              console.error('Improper geometry type:', type);
              return;
          }
          //Add attribute data to feature
          feature.properties = data.attributes;
          return feature;
        }

        //Returns ArcGIS Server returned json as geojson
        //Parameters- data is the returned data from ArcGIS server
        function toGeojson (data){
          var features, feature, geojson;
            //Geojson shell format
            geojson = {
              "type": "FeatureCollection",
              "features": []
            };

            try {
              //Check Spatial Reference
              if (data.features && data.spatialReference.wkid === 4326) {
                features = data.features;
              }
              else if (data.results[0].geometry.spatialReference.wkid === 4326){
                features = data.results;
              }
              else {
                throw {error: 'Please set params outSR to 4326'};
              }
              //Loop through each feature from esri response
              for (var _i = 0,  _len = features.length; _i < _len; _i++){
                feature = features[_i];
                switch (data.geometryType || feature.geometryType) {
                  case 'esriGeometryPoint':
                    geojson.features.push(geojsonFeature(feature, 'Point'));
                    break;
                  case 'esriGeometryPolyline':
                    geojson.features.push(geojsonFeature(feature, 'LineString'));
                    break;
                  case 'esriGeometryPolygon':
                    geojson.features.push(geojsonFeature(feature, 'Polygon'));
                    break;
                  default:
                    console.error('Esri geometry type not recognized, failed geojson conversion:', data.geometryType || feature.geometryType);

                  }
                }
              }
              catch(err){
                console.error(err);
              }
              finally {
                return geojson;
              }
            }
          }

          
})();
