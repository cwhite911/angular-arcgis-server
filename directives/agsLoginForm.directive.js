/* agsLoginForm.directive.js */

/**
* @desc Easy to use ArcGIS Token authentication form
* @example <ags-login-form></ags-login-form>
*/

(function(){
  "use strict";
  angular
    .module('agsserver')
    .directive('agsLoginForm', agsLoginForm);

    function agsLoginForm(){
      return {
        restrict: 'E',
        templateUrl: '/directives/agsLoginForm.directive.html',
        scope: {
          server: '='
        },
        controller: controller,
        link: link
      };
    }

    function controller($scope, $cookies){
      $scope.loggedIn = true;
      $scope.errorMessage = false;

      $scope.login = function (user, password) {
        $scope.server.requestToken({username: user, password: password})
          .then(function (token) {
            if (token.error){
              $scope.loggedIn = false;
            }
            else {
              $cookies.put('agsToken', token);
              $scope.loggedIn = true;
              if (checkBootstrap($scope.modal)){
                $scope.modal.modal('hide');
              }
            }
          })
          .catch(function(err){
            console.error(err);
            $scope.errorMessage = err;
          });
      };
    }

    function link(scope, element, attrs) {
      scope.modal = $('.modal', element[0]);
      if (checkBootstrap(scope.modal)){
        scope.modal.modal({keyboard: false, backdrop: 'static'});
      }
    }

    function checkBootstrap(modal){
      if (typeof modal.modal === 'function'){
        return true;
      }
      else {
        return false;
      }
    }


})();
