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

  });

})();
