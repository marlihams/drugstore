angular.module("drugstore.menu")
.controller('MenuDailySale',[
	'$scope',
	'$state',
	'UserAuthService',
	'DrugStoreService',
	'DailySaleService',
	'commonData',
	'UtilityManager',
	'MessageManager',
	'$filter',
	function($scope,$state,UserAuthService,DrugStoreService,DailySaleService,commonData,UtilityManager,MessageManager,$filter){

		 //do smthing else
		 console.log("MenuDailySale");
		 console.log(commonData.monthDailySale);

		 $scope.dailySales=commonData.monthDailySale;

		 $scope.title="ventes journalières";

		$scope.myDateEnd=new Date();
		$scope.maxDate=new Date();
		

		 $scope.rechercheDailySale=function(form){
		 	
		 	$scope.submitted=true;
		 
			 	 if (form.$valid) {

			 	 	DailySaleService.filterDailySaleByDate(
			 	 			$filter('date')($scope.myDateDebut,"yyyy-MM-dd"),
			 	 			$filter('date')($scope.myDateEnd,"yyyy-MM-dd"),
			 	 			function(dailySales){
			 	 				 $scope.dailySales=dailySales;
			 	 			}
			 	 		);
  			 }
		 };

		 $scope.showDailySaleDetails=function(dailySale){

		 	$state.go("dailySale-details",{dailySaleDate:dailySale.date});
		 };

		 $scope.displayMoreDailySale=function(){

		 	if ($scope.dailySales.length<=45){ 
		 		// limit dailysales to display 60

		 		var endDate=$scope.dailySales[0].date;
		 		var  beginDate =$scope.dailySales[$scope.dailySales.length-1].date;
		 		endDate=UtilityManager.getDateCorrectedFormat(endDate);
		 		beginDate=new Date(beginDate);
		 		beginDateSec=beginDate.getTime();
		 		beginDateSec-=(15*24*3600*1000);
		 		beginDate.setTime(beginDateSec);
		 		beginDate=UtilityManager.getDateCorrectedFormat(beginDate);

		 		DailySaleService.filterDailySaleByDate(
		 			beginDate,endDate,
		 			function(dailySales){
		 				$scope.dailySales=dailySales;
		 			});
		 	}
		 	else{
		 		DrugStoreService.infoRequest(MessageManager.M28);
		 	}

		};

	}]);