(function(){
  'use strict';


  describe('geojsonService', function() {
    beforeEach(module('agsserver'));

    var geojsonService;


    beforeEach(inject(function(_geojsonService_){
      geojsonService = _geojsonService_;

    }));

    it('throws error when incorrect wkid is set', function(){
      // data.spatialReference.wkid !== 4326) {
      //   throw {error: 'Please set params outSR to 4326'};
      // }
      var geojson = {
        "type": "FeatureCollection",
        "features": []
      };

      var data = {
        spatialReference: {
          wkid: 102100
        }
      };
      var toGeojson = geojsonService.toGeojson(data);
      expect(toGeojson).toEqual(geojson);
    });

    it('throws error when geometryType is not set', function(){
      var geojson = {
        "type": "FeatureCollection",
        "features": []
      };

      var data = {
        spatialReference: {
          wkid: 4326
        }
      };

      var toGeojson = geojsonService.toGeojson(data);
      expect(toGeojson).toEqual(geojson);
    });

  });

})();
