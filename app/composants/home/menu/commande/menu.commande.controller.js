angular.module("drugstore.menu")
.controller('MenuCommande',[
	'$scope',
	'$state',
	'UserAuthService',
	'DrugStoreService',
	'$mdMenu',
	function($scope,$state,UserAuthService,DrugStoreService,$mdMenu){


		 $scope.commandes=DrugStoreService.getCurrentDailySale().commandes;
		 
		

$scope.closeMenu=function(){
	console.log("function close Mneu");
	$mdMenu.hide();
};

/*$scope.openMenu=function(){
	console.log("function open Mneu");
	$mdMenu.show();
};*/
	DrugStoreService.subscribe(function(){
		$scope.commandes=DrugStoreService.getCurrentDailySale().commandes;
	});

	$scope.title=DrugStoreService.getCurrentDailySale().date;
	$scope.getClientFullName=(commande)=>{
		//return commande.clientType=="autre" ? "inconnu" : (commande.client.nom + commande.client.prenom);
		return "inconnu";
	};

	$scope.displayDetails=(commande)=>{
		console.log("displaycommande details");
		console.log(commande._id);

		$state.go("commande-details",{commandId:commande._id});
	};

	$scope.modifierCommande=(commande)=>{
		console.log("editerCommande");
		console.log(commande._id);
		$state.go("commande-edit",{commandId:commande._id});

	};

	$scope.getTitle=function(input){
	//	$scope.title=
	}
	$scope.filtreCommande=function(key,type){

	type= type ? Number.parseInt(type):1;
		if(key){
			$scope.commandes.sort((a,b)=>{

				if(key=="client"){
					return DrugStoreService.filtreAscOrDesc($scope.getClientFullName(a),
															$scope.getClientFullName(b),
															type
															);
				}
				else{
					// tri selon le chiffreAffaire ou totalProduits
					return DrugStoreService.filtreAscOrDesc(Number.parseInt(a[key]),
										Number.parseInt(b[key]),
										type
										);
				}
			});
		}
		else{

			 console.log("key of tri is mandatory");
		}

	};
}]);


/*var CommandeSchema = new Schema({
    title:String,
    client: {type:mongoose.Schema.Types.ObjectId,default:null},
    clientType:{type:String,enum:['recommandeur','abonner','autre'],default:'autre'},
    payer: Boolean,
    montantPayer:Number,
    recompense: Boolean,
    date: {type:Date, default:Date.now},
    dailySaleId:{type:mongoose.Schema.Types.ObjectId,default:null},
    produits:[
    {
    	produit:ProduitSchema,
    	quantite:{type:Number,required:true}
    }]
});
*/