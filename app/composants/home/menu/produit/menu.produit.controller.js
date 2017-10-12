angular.module("drugstore.menu")
.controller('MenuProduit',[
	'$scope',
	'$state',
	'UserAuthService',
	'DrugStoreService',
	'produitList',
	'$mdDialog',
	function($scope,$state,UserAuthService,DrugStoreService,produitList,$mdDialog){


		$scope.produits=produitList;
		DrugStoreService.setProduits(produitList);
		
$scope.sortDetailProduit=(a,b)=>{
	if (a && b){
		var d1=new Date(a.expirationDate);
		var d2=new Date(b.expirationDate);
		return d1.getTime()-d2.getTime();
		}
	else
	return 0;
};

$scope.calculQuantiteProduit=(details)=>{
	if(details.length>1){
	return details.reduce((a,b)=>{
			return  a.quantite ? (Number.parseInt(a.quantite)+ Number.parseInt(b.quantite)): (a+ Number.parseInt(b.quantite));
	});
	}
	else{
		return details[0].quantite;
	}
};

$scope.filtreProduit=(key,type)=>{
	var d1,d2;
	type= type ? Number.parseInt(type):1;
	if(key){
	$scope.produits.sort((a,b)=>{

		if (key=="expirationDate"){

			$scope.produits.forEach(
				(produit)=>produit.details.sort($scope.sortDetailProduit)
				);

			 d1=new Date(a.details[0].expirationDate);
			 d2=new Date(b.details[0].expirationDate);
			return DrugStoreService.filtreAscOrDesc(d1.getTime(),d2.getTime(),type);
		}
		else if (key=="prix"){

			return DrugStoreService.filtreAscOrDesc(Number.parseInt(a.prixVente),
								Number.parseInt(b.prixVente),
								type
								);
		}
		else{

			return DrugStoreService.filtreAscOrDesc(
				 
				 	$scope.calculQuantiteProduit(a.details),
				 	$scope.calculQuantiteProduit(b.details),
				 type
				);
		}
	});
	}
	else{

		/*$mdDialog.show(
			$mdDialog.alert({
        title: 'Attention',
        textContent: 'option de tri est obligatoire',
        ok: 'Close'
      })
		);*/

		alert("option de tri est obligatoire");

	}

};
$scope.imgName=(ProduitName)=>{
	console.log(produitName);
		return produitName.length >0? (produitName.trim().charAt(0)+".PNG"):"";
};


    $scope.produitsDetails = function($event,details) {

    	console.log( "les details " +details);
    	$scope.details=details;
    	var parentEl = angular.element(document.body);

		$mdDialog.show({
		         parent: parentEl,
		         targetEvent: $event,
		         template:
		          
		           '<md-dialog aria-label="List dialog">' +
		           '  <md-dialog-content>'+
		           '<h3 class="popup-title">details du produit</h3>'+
		             '  <table class="w3-table w3-striped">'+
		              '  <tr>'+
		              	'<th>Date Expiration</th> '+
						 '<th> Emplacement</th> '+
						  '<th>Stock</th>'+
		             '</tr>'+
		           '      <tr ng-repeat="item in details">'+
		           '       <td class="md-list-item-text">{{item.expirationDate  |date :"dd- MMM- yyyy"}}</td>' +
		           '       <td class="md-list-item-text">{{item.emplacement}}</td>' +
		           '       <td class="md-list-item-text">{{item.quantite}}</td>' +
		           '      '+
		           '    </tr></table>'+
		           '  </md-dialog-content>' +
		           '</md-dialog>',
		         locals: {
		           items: details
		         },
		         clickOutsideToClose:true,
		         controller:function DialogController($scope,$mdDialog,items){
		         		$scope.details=items;
		         	/* $scope.closeDialog = function() {
		              $mdDialog.hide();
		            }*/
		         }
		      });

   
    };
    $scope.changeProductSelected=(produit)=>{
    	
    	if ($scope.selectedProduct && $scope.selectedProduct._id !==produit._id){
    			// produit.selected=false;
    			$scope.selectedProduct.selected=false;
    			
    		}
    	$scope.isProduitSelected=produit.selected;
    	$scope.selectedProduct=produit;

    	
    };
    $scope.editSelectedProduct=()=>{

    	$state.go("produit-edit",{produitId:$scope.selectedProduct._id});

    };

/*$scope.changeUrl=function(){

	$state.go()
};*/

	}]);