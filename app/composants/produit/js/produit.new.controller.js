
angular.module('drugstore.produit')
.controller('ProduitNewController',[
'$scope',
'$state',
'DrugStoreService',
'ProduitService',
'globalInfo',
'bestSaleProduit',
function($scope,$state,DrugStoreService,ProduitService,
  globalInfo,bestSaleProduit){

     $scope.isSubmited=false;
   $scope.globalInfo=globalInfo;
  
   $scope.bestSaleProduit=bestSaleProduit;
   $scope.bestSaleProduit=[];
   $scope.produit=DrugStoreService.createProduit();
   $scope.errorMessage="";

 /*  $scope.sortDetailProduit=(a,b)=>{
  if (a && b){
    var d1=new Date(a.expirationDate);
    var d2=new Date(b.expirationDate);
    return d1.getTime()-d2.getTime();
    }
  else
  return 0;
};*/
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
      "expirationDate":new Date(),
      "emplacement":"",
      "quantite":"",
      "key":""+ $scope.produit.details.length
    });
    // hide the error for the table 
    $scope.isDetailValid=true;

  };
  $scope.deleteSelectedDetails=()=>{
     var index=-1;
     $scope.isStarted=true;
      // hide the error for the table 
       $scope.isDetailValid=true;

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
    console.log($scope.produit);
    $scope.isSubmited=true;
    ProduitService.create($scope.produit,((response)=>{

        DrugStoreService.succesRequest(response.message);
      //  $scope.produit=response.data;
      console.log(response.data);
       // $state.go("home",{"selectedMenu":MENU.PRODUIT});
        }),((error)=>{

          // managing error 
         DrugStoreService.failedRequest(error.data.message);
        }));

  };
  
  $scope.clearProduit=()=>{
    $scope.produit=DrugStoreService.createProduit();
    isSubmited=false;

   };

// check that all the ligne of the details table are filled
   $scope.detailsProduitIsValid=()=>{
    $scope.isSubmited=true;
     var isValid=false;
     if ($scope.produit.details.length>0){
       isValid=$scope.produit.details.every((details)=>{
          return details.emplacement.length >0 && 
                  details.quantite>0 && 
                  Number.isNaN(details.quantite)==false;

        });

   }
    $scope.isDetailValid=isValid;
    return isValid;
   };

  function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if(roa.length) result[sheetName] = roa;
    });
    return result.produit_data;
  };

   $scope.addMultipleProduit=()=>{
    console.log("downolading a file");
      console.log($scope.fileName);
      var fd={"file":$scope.file};
      var reader=new FileReader();
      reader.onload=function(e){
        var bstr=e.target.result;
        var workbook=XLSX.read(bstr,{type:'binary'});
        ProduitService.addMultipleProduit(to_json(workbook),(resp)=>{

        // success request
          DrugStoreService.succesRequest(resp.message);
        $state.go("home",{"selectedMenu":MENU.PRODUIT});
     

      },(error)=>{
        // failure
          DrugStoreService.failedRequest(error.message);

      });

      };
      reader.readAsBinaryString($scope.file);

    

   };

}]);

