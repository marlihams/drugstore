
angular.module('drugstore.produit')
.controller('ProduitEditController',[
'$scope',
'$state',
'UserAuthService',
'DrugStoreService',
'ProduitService',
'produit',
function($scope,$state,UserAuthService,DrugStoreService,ProduitService,produit){


  DrugStoreService.setOldState(MENU.PRODUIT);

  console.log("produit  edit controller");
  console.log(produit);
  $scope.produit=produit;
  $scope.deletedDetails=[];

  $scope.initializeExpirationDate=(details)=>{

    return new Date(details.expirationDate);
  };
  $scope.initializeKey=(details)=>{

    return details._id !=undefined ? details._id : details.key;
  };
  $scope.addDetailToDelete=(details)=>{
     $scope.isStarted=false;
    if (details.selected){
         $scope.deletedDetails.push(details.key);
         $scope.nbSelected++;
    }
    else{
      var index= $scope.deletedDetails.indexOf(details.key);
        $scope.deletedDetails.splice(index,1);
         $scope.nbSelected--;
    }
   
  };

  $scope.addDetails=()=>{

    $scope.produit.details.push({
      "expirationDate":(new Date()).toISOString(),
      "emplacement":"",
      "quantite":"",
      "key":""+ $scope.produit.details.length
    });

  };
  $scope.deleteSelectedDetails=()=>{
     var index=-1;
     $scope.isStarted=true;
     if ($scope.deletedDetails.length >0){
       $scope.deletedDetails.forEach((id)=>{

        index=$scope.produit.details.findIndex((element)=>{
           return element.key===id;
          });

        if(index!=-1)
          $scope.produit.details.splice(index,1);
        
       });
       $scope.deletedDetails=[];
       $scope.nbSelected=0;
      $scope.isStarted=false;
     }

  };

  $scope.saveChangement=()=>{
    console.log("*******save produit*********");
    $scope.produit.details.forEach((detail)=>{
        delete detail.key;
    });
    console.log($scope.produit);
    ProduitService.update($scope.produit,function(response){
      if (response.status){
        DrugStoreService.succesRequest(response.message);
      //  $scope.produit=response.data;
      console.log(response);
        $state.go("home",{"selectedMenu":MENU.PRODUIT});
      }
    },(error)=>{
       DrugStoreService.failedRequest(error.message);
    });

  };
  $scope.close=()=>{
      console.log("close edit produit");
     $state.go("home",{"selectedMenu":MENU.PRODUIT});
  };

  $scope.deleteProduit=()=>{

  if (confirm("voulez vous vraiment supprimer ce produit")){
    ProduitService.delete($scope.produit,function(response){

      if (response.status){
        DrugStoreService.succesRequest(response.message);
         $state.go("home",{"selectedMenu":MENU.PRODUIT});
      }
    },function(error){
      
        DrugStoreService.infoRequest(error.data.message);

    });
    }

  };

}
]);

