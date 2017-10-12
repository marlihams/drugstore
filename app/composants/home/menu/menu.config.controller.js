angular.module("drugstore.menu")
.controller('MenuController',[
	'$scope',
	'$state',
	'$stateParams',
	function($scope,$state,$stateParams){

	
		console.log("******menu controller***");
		console.log($stateParams.selectedMenu);
		switch ($stateParams.selectedMenu){
			case  MENU.PRODUIT:
			$scope.activeMenu=0;
			break;
			case MENU.COMMANDE:
			$scope.activeMenu=1;
			break;
			case MENU.DAILYSALE:
			$scope.activeMenu=2;
			break;
			case MENU.CLIENT:
			$scope.activeMenu=3;
			break;
			case MENU.DEPENSE:
			$scope.activeMenu=4;
			break;
			default:
			//display error pagec
			console.log("an error page should be displayed");

		}



	}]);

