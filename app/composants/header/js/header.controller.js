angular.module("drugstore.header")
.controller('HeaderController',[
	'$scope',
	'$state',
	'UserAuthService',
	'DrugStoreService',
	function($scope,$state,UserAuthService,DrugStoreService){

		 $scope.userName = UserAuthService.currentUser().userName;
		 $scope.goHome=DrugStoreService.reload;
		 $scope.logOut=UserAuthService.logOut;
		

	}]);
