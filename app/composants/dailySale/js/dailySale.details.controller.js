
angular.module('drugstore.dailySale')
.controller('DailySaleDetailsController',[
'$scope',
'$state',
'DrugStoreService',
'DailySaleService',
'ProduitService',
'MessageManager',
'currentDailySale',
function($scope,$state,DrugStoreService,DailySaleService,ProduitService,MessageManager,currentDailySale){

  $scope.dailySale=currentDailySale;
  $scope.deletedCommand=[];
  DrugStoreService.setOldState(MENU.DAILYSALE);
/*   $scope.modifierStatus=false;
  $scope.modifierTitle=false;*/
if ($scope.dailySale !=null && $scope.dailySale.commandes.length>0){
  $scope.selectedCommand=$scope.dailySale.commandes[0];
  $scope.selectedCommand.selected=true;
}
else{
  $scope.selectedCommand={};
}
  
  
  
  $scope.changeSelectedCommand=function(command){
    $scope.selectedCommand.selected=false;
    command.selected=true;
    $scope.selectedCommand=command;
    $scope.resteApayer=$scope.updateResteApayer();
  };


$scope.getClientName=function(){
  $scope.clientName='inconnu';
    if ($scope.selectedCommand.clientType && $scope.selectedCommand.clientType !='autre'){
      $scope.clientName="Mr "+$scope.selectedCommand.client.prenom+" "+
      $scope.selectedCommand.client.nom+ " ("+$scope.selectedCommand.client.telephone+")";
    }
    return $scope.clientName;
}

  var updateDailySaleInfo=(index)=>{

     var nbProduits=$scope.dailySale.totalProduits;
     var benefice=$scope.dailySale.benefice;
     var chiffreAffaire=$scope.dailySale.chiffreAffaire;

$scope.dailySale.totalProduits=Number.parseInt(nbProduits
  )- Number.parseInt($scope.dailySale.commandes[index].totalProduits);

$scope.dailySale.chiffreAffaire=Number.parseInt(chiffreAffaire
  )- Number.parseInt($scope.dailySale.commandes[index].chiffreAffaire);

$scope.dailySale.chiffreAffaire=Number.parseInt(benefice
  )- Number.parseInt($scope.dailySale.commandes[index].benefice);

  };

$scope.deleteCommand=function(command){
  var index=$scope.dailySale.commandes.findIndex((commande)=>{
    return commande._id==command._id;
  });
  updateDailySaleInfo(index);

  $scope.deletedCommand.push($scope.dailySale.commandes[index]);
 
  if($scope.selectedCommand._id==$scope.dailySale.commandes[index]._id ){
    if ($scope.dailySale.commandes.length>1){ 
    // selected command devient la suivante ou la précedente
        $scope.selectedCommand=$scope.dailySale.commandes[index==0 ? 1:index-1];
        $scope.selectedCommand.selected=true;
      }
      else{
        // la vente est composée  d'une seule commande et elle vient d'être supprimé
        $scope.selectedCommand={};
      }
  }
  
  $scope.dailySale.commandes.splice(index,1);
};

$scope.modifyStatus=function(){
  $scope.modifierStatus=true;
};
$scope.modifyTitle=function(){
  $scope.modifierTitle=true;
};

$scope.prixTotal=(produit)=>{
  if (produit) {
    return Number.parseInt(produit.quantite,10)*Number.parseInt(produit.prixVente,10);
  }
  else{
    console.log("scope.commande can not be empty");
    return null;
  }
};


function buildProduitToUpdate(){
  var produitToUpdate={};
  var produits;
  $scope.deletedCommand.map((command)=>{
    produits=command.produits;
    produits.forEach((produit)=>{
        produitToUpdate[produit.produitId]=new Array(produit.emplacement,-1,produit.quantite);
    });
  });
  return produitToUpdate;
}

$scope.saveAllChange=function(){

    $scope.modifierStatus=false;
    $scope.modifierTitle=false;
  /*  $scope.dailySale.remainCommand= $scope.dailySale.commandes !=null? $scope.dailySale.commandes.map(commande=>commande._id):[];
   delete  $scope.dailySale.commandes;*/
  // $scope.dailySale.commandes= $scope.dailySale.remainCommand;
    console.log($scope.deletedCommand);
   
     var listCommandes=$scope.dailySale.commandes.map((commande)=>{
                return commande._id;
      });
      $scope.dailySale.commandes=listCommandes;
      // supprimmer les commandes 
      // mise à jour des produits
      // mise à jour de la dailySale
      var produitToUpdate=buildProduitToUpdate();

      async.parallel({
       updateProduits:function(callback){
          // update produits

          ProduitService.updateMultipleProduit(
            produitToUpdate
            ).then((rep)=>{
              console.log("find findMultiple");
          console.log(rep);
              callback(null,rep);
            }).catch((message)=>{
              callback(new Error(message));
            });
       },
       updateVente:function(callback){

               DailySaleService.updateOrDelDoc($scope.deletedCommand,$scope.dailySale,(response)=>{
               
                  callback(null,response);
                },(error)=>{
                   callback(new Error(error.message));
                });
            
      }
    },function(err,results){

        if (err){
          console.log(err.message);
          DrugStoreService.failedRequest(MessageManager.M26);
          
        }
        else{
              console.log(results);
              DrugStoreService.succesRequest(MessageManager.M29);
              $state.go("home",{"selectedMenu":MENU.DAILYSALE});

        }
    });

  };

  $scope.updateResteApayer=()=>{
    var chiffreAffaire=Number.parseInt($scope.selectedCommand.chiffreAffaire);
    var montantPayer=Number.parseInt($scope.selectedCommand.montantPayer);
    
      if( !Number.isNaN(montantPayer) && (montantPayer <= chiffreAffaire)){

         return chiffreAffaire-montantPayer;
       }
       else
        return undefined;
};

}]);


