
angular.module('drugstore.home')
.controller('HomeCtrl',[
'$scope',
'$state',
'UserAuthService',
'DrugStoreService',
'DailySaleService',
'commonData',
'currentDailySale',
'nonValidateDepenseMsg',
function($scope,$state,UserAuthService,DrugStoreService,DailySaleService,commonData,currentDailySale,nonValidateDepenseMsg){

  $scope.isLoggedIn = UserAuthService.isLoggedIn;
 
  $scope.logOut = UserAuthService.logOut;
  if (nonValidateDepenseMsg){
    DrugStoreService.infoRequest(nonValidateDepenseMsg);
  }

  DrugStoreService.setCurrentDailySale(currentDailySale);
  $scope.currentDailySale=currentDailySale;
  $scope.worstMonthSale=commonData.worstMonthDailySale;
  $scope.bestMonthSale=commonData.bestMonthDailySale;

  $scope.weeklyDailySale=commonData.weeklySale;


  $scope.statusTooltip=function(){

   return $scope.currentDailySale.etat ? "vente valider" :"vente non valider";
  };

  $scope.changeCurrentDailySale=function(dailysale){
    DailySaleService.getDailySaleByDate(
      dailysale,
      function(dailySale){
       // $scope.currentDailySale={};
       $scope.currentDailySale=dailySale;
        DrugStoreService.setCurrentDailySale(dailySale);
      }
    );
  };

$scope.allExpanded=false;
$scope.toogleAllCommand=function(){
  console.log("toogleAllCommand");
  if ($scope.allExpanded){
    $scope.accordion.collapseAll();
    $scope.allExpanded=false;
  }
  else{
     $scope.accordion.expandAll();
    $scope.allExpanded=true;
  }
};
 

  $scope.title="liste des produits";
  $scope.menuClass="menu-selected-element";
 
   $scope.currentNavItem = 'page1';
 
 $scope. createNewProduit=function(){
  $state.go("produit-new");
 };

$scope. createNewClient=function(){
  alert("contacter votre administrateur du site");
 };

$scope.createNewCommand=function(){
  $state.go("commande-new");
 };

  $scope.displayDepense=function(){
  $state.go("depense-edit");
 };
}
]);

