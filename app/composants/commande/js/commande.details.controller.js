
angular.module('drugstore.commande')
.controller('CommandeDetailsController',[
'$scope',
'$state',
'currentCommand',
'DrugStoreService',
function($scope,$state,currentCommand,DrugStoreService){


$scope.commande=currentCommand;
DrugStoreService.setOldState(MENU.COMMANDE);

$scope.prixTotal=(produit)=>{
  if (produit) {
    return Number.parseInt(produit.quantite,10)*Number.parseInt(produit.prixVente,10);
  }
  else{
    console.log("scope.commande can not be empty");
    return null;
  }
}
$scope.resteAPayer=()=> {

  if ($scope.commande) {

    return $scope.commande.payer ? Number.parseInt($scope.commande.chiffreAffaire,10)-(Number.parseInt($scope.commande.montantPayer,10)+Number.parseInt($scope.commande.reduction,10)) : '0' ;
  }
  else{
    console.log("scope.commande can not be empty");
    return null;
  }
  };
}
]);

