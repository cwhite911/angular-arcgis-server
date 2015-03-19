!function(){"use strict";var e=angular.module("agsserver",[]);e.service("geojsonTools",function(){return{geoJsonFeature:function(e,t){var r={type:"Feature",properties:{},geometry:{type:t,coordinates:[]}};switch(t){case"Point":r.geometry.coordinates=[e.geometry.x,e.geometry.y];break;case"LineString":r.geometry.coordinates=e.geometry.paths[0];break;case"Polygon":r.geometry.coordinates=e.geometry.rings;break;default:return void console.log({error:"Improper geometry type"})}return r.properties=e.attributes,r},toGeojson:function(e){var t,r,o;o={type:"FeatureCollection",features:[]};try{if(e.features&&4326===e.spatialReference.wkid)t=e.features;else{if(4326!==e.results[0].geometry.spatialReference.wkid)throw{error:"Please set params outSR to 4326"};t=e.results}for(var n=0,a=t.length;a>n;n++)switch(r=t[n],e.geometryType||r.geometryType){case"esriGeometryPoint":o.features.push(this.geoJsonFeature(r,"Point"));break;case"esriGeometryPolyline":o.features.push(this.geoJsonFeature(r,"LineString"));break;case"esriGeometryPolygon":o.features.push(this.geoJsonFeature(r,"Polygon"));break;default:throw{error:"esri geometry not recognized, failed geojson conversion"}}}catch(s){console.log(s)}finally{return o}}}}),e.factory("Ags",["$cacheFactory","$http","$q","geojsonTools",function(e,t,r,o){var n=e("base"),a=function(e,t){var r;return t=t.trim(),e.forEach(function(e){t===e.name?r=e.id:e}),r},s=function(e,t){var r=["all","visible","top",""];if(-1===r.indexOf(t)){var o=t.split(","),n=o.map(function(t){var r=/^\d+$/.test(t);return r?t:a(e,t)});return n}return t},i=function(e){return this.conn={protocol:e.protocol||"http",host:e.host||"",path:e.path||"/arcgis/rest/services"},this};return i.prototype={resetConn:function(e){return angular.extend(this.conn,e),this},getConn:function(){var e=this.conn,t=e.protocol+"://"+e.host+e.path;return e.host?t:console.log("Error: Please set host"),t},actions:[{type:"query",method:"GET"},{type:"applyEdits",method:"POST"},{type:"addFeatures",method:"POST"},{type:"updateFeatures",method:"POST"},{type:"deleteFeatures",method:"POST"},{type:"generateRenderer",method:"GET"},{type:"identify",method:"GET"},{type:"find",method:"GET"},{type:"export",method:"GET"}],setService:function(e){try{if("object"!=typeof e)throw{error:"Options is not an object!"};if(e==={})throw{error:"Options are empty"}}catch(t){console.log(t)}var r=this.getConn(),o=r+"/"+e.folder+"/"+e.service+"/"+e.server,n=new i(this.conn);return n.serviceUrl=o,n},layers:[],setRequst:function(e,t,r){var o;return r.actions?this.actions.forEach(function(n){n.type===r.actions&&(o={method:n.method,url:t||0===t?e+"/"+t+"/"+n.type:e+"/"+n.type,headers:r.headers||{"Content-Type":"text/plain"},params:r.params||{},timeout:r.timeout||5e3},"POST"===n.method&&(o.params.features=JSON.stringify(o.params.features)))}):o={method:"GET",url:t||0===t?e+"/"+t:e,headers:r.headers||{"Content-Type":"text/plain"},params:r.params||{f:"json"},timeout:r.timeout||5e3},o},utilsGeom:function(e,o){try{if("object"!=typeof o)throw{error:"Options is not an object!"};if(o==={})throw{error:"Options are empty"}}catch(n){console.log(n)}var a,s,i=this,c=i.getConn();return a=c+"/Utilities/Geometry/GeometryServer/"+e,s={params:o,header:{"Content-Type":"text/plain"}},t.post(a,s).then(function(e){return e.data},function(e){return r.reject(e.data)})},request:function(e){try{if("object"!=typeof e)throw{error:"Options is not an object!"};if(e==={})throw{error:"Options are empty"}}catch(i){console.log(i)}var c=this,u=c.getConn(),p={params:{f:"json"},cache:n},l=this.serviceUrl||u+"/"+e.folder+"/"+e.service+"/"+e.server;return t.get(l,p).then(function(t){if("object"!=typeof t.data||t.data.error)return console.log(t.data.error),r.reject(t.data);var o=t.data.layers.concat(t.data.tables);if(0===c.layers.length?c.layers=[{folder:e.folder,service:[{name:e.service,server:e.server,layers:o}]}]:c.layers,e.layer){var n=a(o,e.layer);return"number"==typeof n?n:r.reject(t.data)}switch(e.actions){case"find":case"identify":case"export":e.params.layers&&(e.params.layers=s(o,e.params.layers));break;default:return}},function(e){return r.reject(e.data)}).then(function(n){var a=c.setRequst(l,n,e);return t(a).then(function(t){return"object"==typeof t.data?e.geojson===!0?o.toGeojson(t.data):t.data:(console.log("invalide response"),r.reject(t.data))},function(e){return console.log({error:"Promise rejected - Check your options and server"}),r.reject(e.data)})})}},i}])}();