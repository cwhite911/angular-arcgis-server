/* agsFeatureForm.directive.js */

/**
* @desc Builds out ready to go form from ArcGIS Server Feature Service
* @example <ags-feature-form></ags-feature-form>
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .directive('agsFeatureForm', agsFeatureForm);

    function agsFeatureForm(){
      return {
        restrict: 'E',
        templateUrl: '/directives/agsFeatureForm.directive.html',
        scope: {
          service: '=', //required
          layer: '=', //required
          auth: '=',
          map: '=',
          geojson: '='
        },
        controller: controller,
        link: link
      };
    }

    function controller($scope, $cookies){
      var token,
          //Set defaults
          errorMessage = $scope.errorMessage = false,
          map = $scope.map = $scope.map === false ? $scope.map : true,
          auth = $scope.auth = $scope.auth === true ? $scope.auth : false,
          geojson = $scope.geojson = $scope.geojson === true ? $scope.geojson : false;
      //Checks

      //submits form to server
      $scope.submit = function (formData) {
        var options = {
          layer: $scope.layer,
          actions: 'addFeatures',
          params: {
            f: 'json',
            features: []
          }
        };

        //Sets token if auth is set
        if ($scope.auth){
          options.params.token = getToken();
        }

        checkOptions(options);

        $scope.server.request(options)
          .then(function (res) {
            if (res.error){
              $scope.errorMessage = true;
            }
            else {
              console.log(res);
            }
          })
          .catch(function(err){
            $scope.errorMessage = err;
          });
      };

      //Returns token string
      function getToken(){
        var d, time, token;
        try {
          d = new Date();
          time = d.getTime();
          token = $cookies.get('agsToken');
          if (time > token.expires){
            throw new Error({error: 'Token is expired'});
          }
          return token.token;
        }
        catch (err){
          console.error(err);
        }

      }

      //Checks request options
      function checkOptions(options){
        try {
          if (typeof options !== 'object'){
            throw new Error({error: 'Options is not an object'});
          }
          else if (options === {}){
            throw new Error({error: 'Options are empty'});
          }
          else if (!options.layer){
            throw new Error({error: 'Layer is not defined'});
          }
          else if (!Array.isArray(options.params.features)){
              throw new Error({error: 'Features improperly formatted'});
          }
          else {
            return options;
          }
        }
        catch (err){
          console.error(err);
        }
      }

    }

    function link(scope, element, attrs) {
      // scope.modal = $('.modal', element[0]);
      // scope.modal.modal({keyboard: false, backdrop: 'static'});
    }

})();
