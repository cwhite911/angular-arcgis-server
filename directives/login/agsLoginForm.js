(function(){
  "use strict";
  angular
    .module('agsserver')
    .directive('agsLoginForm', agsLoginForm);

    function agsLoginForm(){
      return {
        restrict: 'E',
        templateUrl: '/directives/login/agsLoginForm.html',
        scope: {
          server: '='
        },
        controller: controller,
        link: link
      };
    }

    function controller($scope, $cookies){
      $scope.token = '';
      $scope.loggedIn = true;
      $scope.errorMessage = false;

      $scope.login = function (user, password) {
        $scope.server.requestToken({username: user, password: password})
          .then(function (token) {
            if (token.error){
              $scope.loggedIn = false
            }
            else {
              $cookies.put('agsToken', token);
              $scope.loggedIn = true;
              $scope.modal.modal('hide');
            }
          })
          .catch(function(err){
            $scope.errorMessage = err;
          })
      };
    }

    function link(scope, element, attrs) {
      scope.modal = $('.modal', element[0])
      scope.modal.modal({keyboard: false, backdrop: 'static'});
    }


})();
