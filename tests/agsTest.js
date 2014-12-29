'use strict';


describe('Factory: Ags', function() {
  beforeEach(module('agsserver'));

  var Ags;


  beforeEach(inject(function(_Ags_){
    Ags = _Ags_;

  }));

  it('Returns an object when server is created', function(){
    var testServer = new Ags({host: '152.46.17.144'});
    expect(typeof testServer).toBe('object');
  });

  it('Sets server host', function(){
    var testServer = new Ags({host: '152.46.17.144'});
    expect(testServer.conn.host).toBe('152.46.17.144');
  });

  it('Tests if defaults are set', function(){
    var testServer = new Ags({});

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
