(function(){
  'use strict';


  describe('AgsService', function() {
    beforeEach(module('agsserver'));

    var AgsService;


    beforeEach(inject(function(_AgsService_){
      AgsService = _AgsService_;
    }));

    it('should create a new Server Object', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      var instance = testServer instanceof AgsService;
      expect(instance).toBe(true);
    });

    it('should set the server host', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      expect(testServer.conn.host).toBe('maps.raleighnc.gov');
    });

    it('should check if default options are set', function(){
      var testServer = new AgsService({});

      var defaults = {
        protocol: 'http',
        host: '',
        path: '/arcgis/rest/services'
      };
      expect(testServer.conn.protocol).toBe(defaults.protocol);
      expect(testServer.conn.path).toBe(defaults.path);
      expect(testServer.conn.host).toBe(defaults.host);
    });

    it('should get the server connection url', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      expect(testServer.getConn()).toBe('http://maps.raleighnc.gov/arcgis/rest/services');
    });

    it('should reset the server connection object and return the connection string', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      expect(testServer.resetConn({protocol: 'https', host: 'gis.newserver.org'}).getConn()).toBe('https://gis.newserver.org/arcgis/rest/services');
    });

    it('should set a service as a new Server Object', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      var opendata_ms = testServer.setService({
        folder:'Services',
        service: 'OpenData',
        server: 'MapServer'
      });

      var instance = opendata_ms instanceof AgsService;
      var serviceUrl = opendata_ms.serviceUrl;

      expect(instance).toBe(true);
      expect(serviceUrl).toBe('http://maps.raleighnc.gov/arcgis/rest/services/Services/OpenData/MapServer');
    });

    it('should make request using a layer name that returns esri json', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      var opendata_ms = testServer.setService({
        folder:'Services',
        service: 'OpenData',
        server: 'MapServer'
      });

      var options = {
        layer: 'Red Light Cameras',
        geojson: false,
        actions: 'query',
        params: {
          f: 'json',
          where: '1=1',
          returnGeometry: true,
          outSR: 4326
        }
      };

      opendata_ms.request(options).then(function(res){
        return Object.keys(res);
      })
      .then(function(features){
        expect(features).toBe(['displayFieldName', 'fieldAliases', 'geometryType', 'spatialReference', 'fields', 'features']);
      });

    });

    it('should make request using a layer name that returns geojson', function(){
      var testServer = new AgsService({host: 'maps.raleighnc.gov'});
      var opendata_ms = testServer.setService({
        folder:'Services',
        service: 'OpenData',
        server: 'MapServer'
      });

      var options = {
        layer: 'Red Light Cameras',
        geojson: true,
        actions: 'query',
        params: {
          f: 'json',
          where: '1=1',
          returnGeometry: true,
          outSR: 4326
        }
      };

      opendata_ms.request(options).then(function(res){
        return Object.keys(res);
      })
      .then(function(features){
        expect(features).toBe(['displayFieldName', 'fieldAliases', 'geometryType', 'spatialReference', 'fields', 'features']);
      });

    });

  });

})();
