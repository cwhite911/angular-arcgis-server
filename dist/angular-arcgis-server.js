!function(){"use strict";var e=angular.module("agsserver",[]);e.service("geojsonTools",function(){return{geoJsonFeature:function(e,t){var r={type:"Feature",properties:{},geometry:{type:t,coordinates:[]}};switch(t){case"Point":r.geometry.coordinates=[e.geometry.x,e.geometry.y];break;case"LineString":r.geometry.coordinates=e.geometry.paths[0];break;case"Polygon":r.geometry.coordinates=e.geometry.rings;break;default:return void console.log({error:"Improper geometry type"})}return r.properties=e.attributes,r},toGeojson:function(e){var t,r,o=e.features;r={type:"FeatureCollection",features:[]};try{if(4326!==e.spatialReference.wkid)throw{error:"Please set params outSR to 4326"};for(var n=0,a=o.length;a>n;n++)switch(t=o[n],e.geometryType){case"esriGeometryPoint":r.features.push(this.geoJsonFeature(t,"Point"));break;case"esriGeometryPolyline":r.features.push(this.geoJsonFeature(t,"LineString"));break;case"esriGeometryPolygon":r.features.push(this.geoJsonFeature(t,"Polygon"));break;default:throw{error:"esri geometry not recognized, failed geojson conversion"}}}catch(s){console.log(s)}finally{return r}}}}),e.factory("Ags",["$cacheFactory","$http","$q","geojsonTools",function(e,t,r,o){var n=e("base"),a=function(e,t){var r;return e.forEach(function(e){t===e.name?r=e.id:e}),r},s=function(e){return this.conn={protocol:e.protocol||"http",host:e.host||"",path:e.path||"/arcgis/rest/services"},this};return s.prototype={resetConn:function(e){return angular.extend(this.conn,e),this},getConn:function(){var e=this.conn,t=e.protocol+"://"+e.host+e.path;return e.host?t:console.log("Error: Please set host"),t},actions:[{type:"query",method:"GET"},{type:"applyEdits",method:"POST"},{type:"addFeatures",method:"POST"},{type:"updateFeatures",method:"POST"},{type:"deleteFeatures",method:"POST"},{type:"generateRenderer",method:"GET"}],setService:function(e){try{if("object"!=typeof e)throw{error:"Options is not an object!"};if(e==={})throw{error:"Options are empty"}}catch(t){console.log(t)}var r=this.getConn(),o=r+"/"+e.folder+"/"+e.service+"/"+e.server,n=new s(this.conn);return n.serviceUrl=o,n},layers:[],setRequst:function(e,t,r){var o;return this.actions.forEach(function(n){n.type===r.actions&&(o={method:n.method,url:e+"/"+t+"/"+n.type,headers:r.headers||{"Content-Type":"text/plain"},params:r.params||{},timeout:r.timeout||5e3},"POST"===n.method&&(o.params.features=JSON.stringify(o.params.features)))}),o},deleteLastFeature:function(){},utilsGeom:function(e,o){try{if("object"!=typeof o)throw{error:"Options is not an object!"};if(o==={})throw{error:"Options are empty"}}catch(n){console.log(n)}var a,s,i=this,c=i.getConn();return a=c+"/Utilities/Geometry/GeometryServer/"+e,s={params:o},t.get(a,s).then(function(e){return console.log(e.data),e.data},function(e){return r.reject(e.data)})},request:function(e){try{if("object"!=typeof e)throw{error:"Options is not an object!"};if(e==={})throw{error:"Options are empty"}}catch(s){console.log(s)}var i=this,c=i.getConn(),u={params:{f:"json"},cache:n},l=this.serviceUrl||c+"/"+e.folder+"/"+e.service+"/"+e.server;return t.get(l,u).then(function(t){if("object"==typeof t.data){var o=t.data.layers.concat(t.data.tables);o.length>0&&0===i.layers.length?i.layers=[{folder:e.folder,service:[{name:e.service,server:e.server,layers:o}]}]:i.layers;var n=a(o,e.layer);return"number"==typeof n?n:r.reject(t.data)}return r.reject(t.data)},function(e){return r.reject(e.data)}).then(function(n){var a=i.setRequst(l,n,e);return t(a).then(function(t){return"object"==typeof t.data?e.geojson===!0?o.toGeojson(t.data):t.data:(console.log("invalide response"),r.reject(t.data))},function(e){return console.log({error:"Promise rejected - Check your options and server"}),r.reject(e.data)})})}},s}])}();