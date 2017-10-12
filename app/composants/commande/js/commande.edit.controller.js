
angular.module('drugstore.commande')
.controller('CommandeEditController',[
'$scope',
'$state',
'DrugStoreService',
'CommandeService',
'currentCommand',
'ProduitService',
'DailySaleService',
'produitList',
'clientList',
'MessageManager',

function($scope,$state,DrugStoreService,CommandeService,
  currentCommand,ProduitService,DailySaleService,
    produitList,clientList,MessageManager){

  console.log("commande edit controller");
  $scope.commande=currentCommand;
   $scope.backUpCommande=angular.copy(currentCommand);
  
 // $scope.produits=DrugStoreService.getProduits();
 DrugStoreService.setOldState(MENU.COMMANDE);
 $scope.produitsToUpdate={};

 var cloneDetails=function(clone,details){
    clone.expirationDate=details.expirationDate;
    clone.emplacement=details.emplacement;
    clone.max=details.quantite;
    return clone;
 };

 $scope.produits=produitList;
 
   var clientTest=[{
    "nom":"diallo",
    '_id': "01",
    'telephone':"0605775396"
  },
  {
    "nom":"madiou",
    "_id":"02",
    'telephone':"0605775396"
  },
   {
    "nom":"matthias",
    "_id":"04",
    'telephone':"0605775396"
  },
     {
    "nom":"Quentin",
     "_id":"05",
     'telephone':"0605775396"
  },
  {
    "nom":"mohamed",
    "_id":"03",
    'telephone':"0605775396"
  }];

  var buildCLientList=(clientArray)=>{

  var listClient=[];

      clientArray.forEach((client)=>{
          var obj={};
          obj._id=client._id;
          obj.display=client.nom +" ("+client.telephone+")";
          listClient.push(obj);
      });
      listClient.unshift({
        "display":"inconnu",
        "_id":null
      });
    return listClient;
  };


  $scope.clients=buildCLientList(clientList==null ? clientTest: clientList);


  var selectedProduit=()=>{
    var prodEmpQuantite={};
    //console.log($scope.commande.produits);
    $scope.commande.produits.forEach(function(obj){
      
      prodEmpQuantite[obj.produitId]=new Array(obj.emplacement,obj.quantite);

    });
    return prodEmpQuantite;
  };

  $scope.selectedProduit=selectedProduit();
  $scope.backUpCommandeProduits=angular.copy($scope.selectedProduit);



$scope.setSelectedClient=function(){

  var client=null; 
    if ($scope.commande.client==null){
     
        client=$scope.clients[0];
      }
      else{

       client=$scope.clients.find((client)=>{
          return client._id==$scope.commande.client;
        });
       
      }
       $scope.selectedItem=client;
       return client.display;
};
  $scope.getMatches=(searchClient)=>{
    console.log("la recherche se fait sur "+ searchClient);

    var obj=$scope.clients.filter(function(client){

      return client.display.search(searchClient) !=-1;
    });
   return obj;
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


$scope.produitValueChanged=function(produit){
    
    if (!produit.checkBox){ 
    // checkbox  has been unchecked
      delete $scope.selectedProduit[produit._id];
      $scope.removeProduit(produit);
      produit.stock=produit.oldStock;

    }
    else{
      // check-box selected

      if (Number.parseInt(produit.model,10) >0 && Number.parseInt(produit.model,10) <= Number.parseInt(produit.stock,10)){

         produit.stock= produit.oldStock-produit.model;
          $scope.selectedProduit[produit._id]=new Array(produit.emplacement,produit.stock);
          // array(emplacement,newStock)
          $scope.addProduit(produit);
          $scope.error=false;
        }
        else{
          $scope.error=true;
          produit.checkBox=false;
        }
    }
   
 };

$scope.isChecked=function(produit){
  return produit.model >0 ? true :false;
};

 $scope.addProduit=(produit)=>{
    // to be updated

    var newProduit={};
    newProduit.produitId=produit._id;
    newProduit.nom=produit.nom;
    newProduit.prixAchat=produit.prixAchat;
    newProduit.prixVente=produit.prixVente;
    newProduit.emplacement=produit.emplacement;
    newProduit.quantite=produit.model;
    newProduit.expirationDate=produit.expirationDate;
    newProduit.description=produit.description;
  
    //update old property
    updateCommandeProperty(produit,true);
    // add produit
    $scope.commande.produits.push(newProduit);

 };

 var updateCommandeProperty=(produit,bool)=>{
  var oldChiffreAffaire=Number.parseInt($scope.commande.chiffreAffaire);
  var oldBenefice=Number.parseInt($scope.commande.benefice);
  var oldTotalProduit=Number.parseInt($scope.commande.totalProduits);
  var quantite=Number.parseInt(produit.model,10);
  var result={};
    if(bool){
      // property increase
      $scope.commande.chiffreAffaire=oldChiffreAffaire+(quantite *produit.prixVente);
       $scope.commande.benefice=oldBenefice+ (quantite*(produit.prixVente-produit.prixAchat));
       $scope.commande.totalProduits=oldTotalProduit+quantite;
    }
    else{
      $scope.commande.chiffreAffaire=oldChiffreAffaire-(quantite *produit.prixVente);
       $scope.commande.benefice=oldBenefice- (quantite*(produit.prixVente-produit.prixAchat));
       $scope.commande.totalProduits=oldTotalProduit-quantite;
    }

 };

 $scope.removeProduit=(produit)=>{

  var indexElement=$scope.commande.produits.findIndex((obj)=>{
    return obj.produitId===produit._id && obj.emplacement===produit.emplacement;
  });
  if (indexElement !=-1){
    $scope.commande.produits.splice(indexElement, 1);
    updateCommandeProperty(produit,false);
  }
 };

$scope.sortDetailProduit=(a,b)=>{
  if (a && b){
    var d1=new Date(a.expirationDate);
    var d2=new Date(b.expirationDate);
    return d1.getTime()-d2.getTime();
    }
  else
  return 0;
};

$scope.updateData=function(produit){

   console.log("click on the input");
 //  produit.checkBox=false;
 if(produit.checkBox){
  var cloneProduit=angular.copy(produit);

    var newStock=$scope.selectedProduit[produit._id][1];
    var stockRef=produit.stock;
     produit.stock=produit.oldStock-produit.model;

      cloneProduit.model=Math.abs(stockRef-produit.stock);
      updateCommandeProperty(cloneProduit, stockRef > produit.stock?true :false);
      
      var indexElement=$scope.commande.produits.findIndex((obj)=>{
          return obj.produitId===produit._id && obj.emplacement===produit.emplacement;
      });
        
        if (indexElement !=-1){

          $scope.commande.produits[indexElement].quantite=produit.model;
          $scope.selectedProduit[produit._id][1]=produit.stock;
        }

        if (produit.model==0){
           $scope.commande.produits.splice(indexElement,1);
           produit.checkBox=false;
          delete $scope.selectedProduit[produit._id];
        }
    
  }

};

/**
  --
  --
*/

// array(quantite,emplacement,augmentation (true) /diminution(false) du stock)


function updateSelectedProduit(){
  var listSelectedProduits=Object.keys($scope.selectedProduit);

  var listBackUpProduitId=Object.keys($scope.backUpCommandeProduits);
  $scope.produits.forEach(function(produit){
    if (listBackUpProduitId.indexOf(produit._id) !=-1 && 
      listSelectedProduits.indexOf(produit._id)==-1 && 
      produit.emplacement==$scope.backUpCommandeProduits[produit._id][0]){
       $scope.selectedProduit[produit._id]=new Array(produit.emplacement,produit.stock);
    }

});
 
}

$scope.setDefaultValue=(produit)=>{
 var selectedProduit=Object.keys($scope.selectedProduit);
 selectedProduit= selectedProduit ?selectedProduit :[];
  var index=selectedProduit.indexOf(produit._id);

  if ( index!=-1 && $scope.selectedProduit[produit._id][0]==produit.emplacement){
    var qte=$scope.selectedProduit[produit._id][1];
     produit.oldStock=produit.stock+qte;
    return qte;
  }  
  return 0;
}

$scope.validateChange=function(){
    $scope.submitted=true;
    var chiffreAffaire=Number.parseInt($scope.commande.chiffreAffaire);
    var montantPayer=Number.parseInt($scope.commande.montantPayer);
    var reduction=Number.parseInt($scope.commande.reduction);
    if(Number.isNaN(reduction) || Number.isNaN(montantPayer) ||  (montantPayer> chiffreAffaire) || (reduction > chiffreAffaire)){
       $scope.errorSubmited=true;

    }
    else{
     
      $scope.errorSubmited=false;
      $scope.commande.client=$scope.selectedItem._id;
      $scope.commande.clientType=$scope.commande.client ==null ? "autre" :"abonner";

// create the commande and update the produit using async.

// ListProduitId,produitValue,successHandler,errorHandler
       updateSelectedProduit();
     async.parallel({
       updateProduit:function(callback){
          // update produits
          ProduitService.updateMultipleProduit(
            $scope.selectedProduit
            ).then((rep)=>{
              console.log("find findMultiple");
          console.log(rep);
              callback(null,true);
            }).catch((message)=>{
              callback(new Error(message));
            });
       },
       updateCommande:function(callback){

        DailySaleService.getCurrentDailySale(function(currentDailySale){
          //successHandler

          $scope.commande.dailySaleId=currentDailySale._id;
          $scope.commande.date=new Date();

          //creation de la commande
          CommandeService.update($scope.commande,
            (rep)=>{
              // update dailySale.

              var listCommandes=currentDailySale.commandes.map((commande)=>{
                return commande._id;
              });
              currentDailySale.commandes=listCommandes;
              currentDailySale.commandes.push(rep.id);
             
             // cancel previous info added due to the original commande

              currentDailySale.benefice-=$scope.backUpCommande.benefice;
              currentDailySale.chiffreAffaire-=$scope.backUpCommande.chiffreAffaire;
              currentDailySale.totalProduits-=$scope.backUpCommande.totalProduits;
            // update new info due to the modification of the command.

              currentDailySale.benefice+=$scope.commande.benefice;
              currentDailySale.chiffreAffaire+=$scope.commande.chiffreAffaire;
              currentDailySale.totalProduits+=$scope.commande.totalProduits;

              DailySaleService.updateDailySale(currentDailySale).then((rep)=>{
                callback(null,rep);
              }).catch((error)=>{
                   callback(new Error());
              });
            },
            (message)=>{
              callback(new Error(message));
          });

        },function(error){
          // error Handler
          if (!error.err_code){
            DrugStoreService.displayErrorPage(error);
          }

        });
            
      }
    },function(err,results){

        if (err){
          console.log(err.message);
          DrugStoreService.failedRequest(MessageManager.M26);
          
        }
        else{

          // ajout de la commande dans la dailySale.
          // affichage du message et redirection vers la page d'acceuil.
          $state.go("home",{"selectedMenu":MENU.COMMANDE});
           DrugStoreService.succesRequest(MessageManager.M19);
        }

    });

        
    }
};

$scope.updateResteApayer=()=>{
    var chiffreAffaire=Number.parseInt($scope.commande.chiffreAffaire);
    var montantPayer=Number.parseInt($scope.commande.montantPayer);
     var reduction=Number.parseInt($scope.commande.reduction);
    
      if( !Number.isNaN(reduction) && !Number.isNaN(montantPayer) && (montantPayer <= chiffreAffaire)){

         $scope.resteAPayer=chiffreAffaire - reduction - montantPayer;
       }
};
$scope.imprimerFacture=()=>{
  // functionnality not added yet;
};


}]);



