
angular.module('drugstore.error')
.controller('ErrorController', [
'$scope',
'$state',
'UserAuthService',
function($scope, $state, UserAuthService){
  console.log($state.params.error);

 /*  message: err.message,
        status:err.status,
        error: err
        */
  $scope.error=$state.params.error? $state.params.error :null;
  if ($scope.error==null){
    var error={};
    error.err_code="";
    error.message="oups something happen!!!go to the login page";    
    error.error="";
   $scope.error=error;
  }
  UserAuthService.logOut();

}]);