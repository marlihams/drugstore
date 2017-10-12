angular.module("drugstore.service")
		.factory('DrugStoreService',['$resource','$state','$mdToast','PouchdbService','UtilityManager','UserAuthService','MessageManager',function($resource,$state,$mdToast,PouchdbService,UtilityManager,UserAuthService,MessageManager){
			
	var drugStoreService={};
			drugStoreService.produitList=null;
			drugStoreService.currentDailySale=null;
			drugStoreService.commandBoolean=false;
			drugStoreService.subscriber=[];
			drugStoreService.oldSate=MENU.PRODUIT;
			
			drugStoreService.setProduits=function(produits){

				drugStoreService.produitList=produits;
			};

			drugStoreService.getProduits=function(){

				return drugStoreService.produitList;
			};


			drugStoreService.setCurrentDailySale=function(dailySale){

				drugStoreService.currentDailySale=dailySale;

				if (drugStoreService.subscriber.length >0){
					drugStoreService.notify();
				}
			};


			drugStoreService.subscribe=function(callback){

				drugStoreService.subscriber.push(callback);
			};

			drugStoreService.notify=function(){

				drugStoreService.subscriber.forEach(function(callback){
					callback();
				});
			};
			
			drugStoreService.getCurrentDailySale=function(){

				return drugStoreService.currentDailySale;
			};
			drugStoreService.setOldState=function(lastState){
				if (Object.values(MENU).indexOf(lastState)!=-1){
					drugStoreService.oldSate=lastState;
				}
			};

			drugStoreService.filtreAscOrDesc=function(a,b,type){
	 
				 	if(a > b)
				 		return type==1 ? 1:-1 ;
				 else if (a<b)
				 	 return type==1 ? -1:1;
				 else
				 	return 0;
    
			};

			drugStoreService.reload=function(){

			 	console.log("reloading");
			 	$state.go("home",{"selectedMenu":drugStoreService.oldSate},{reload:true});
			 };
			
			drugStoreService.displayErrorPage=function(error){
				$state.go("pharmacie-Dixin-error",{error:error});
				
			};


	drugStoreService.errorHandler=function(err,callback){
		if (err.err_code){
			callback(err);
		}
		else{
			 drugStoreService.displayErrorPage(err);
		}

	};

	drugStoreService.succesRequest=function(message){
		       $mdToast.show(
		      $mdToast.simple()
		        .textContent(message)
		        .position('top right')
		        .toastClass("toast-success-class")
		        .hideDelay(3000)
		    );
	};
	drugStoreService.infoRequest=function(message){
		  $mdToast.show(
		      $mdToast.simple()
		        .textContent(message)
		        .position('top right')
		        .action('FERMER')
		        .highlightAction(true)
		        .toastClass("toast-info-class")
		        .hideDelay(6000)
		    ).then(function(rep){
		    	if (rep=="ok"){
		    		$mdToast.hide();
		    	}
		    });
	};
	drugStoreService.failedRequest=function(message){
		       $mdToast.show(
		      $mdToast.simple()
		        .textContent(message)
		        .position('top right')
		        .toastClass("toast-failed-class")
		        .hideDelay(3000)
		    );
	};

	drugStoreService.createCommand=()=>{
		return {
			title:Date.now(),
			client:null,
			clientType:"inconnu",
			ttype:"commande",
			montantPayer:0,
			chiffreAffaire:0,
			totalProduits:0,
			benefice:0,
			reduction:0,
			recompense:false,
			produits:[],
			date:""
		};
	};
	drugStoreService.createProduit=()=>{
		return {
		    nom: "",
		    description: "",
		    prixAchat:"",
		    prixVente:"",
		    ttype:"produit",
		    details:[{
		    	emplacement:"",
		    	expirationDate:new Date(),
		    	quantite:""
		    }]

		   };
		
	};
	drugStoreService.createDepense=()=>{
		return {
				"type":"autre",
				"ttype":"depense",
				"validateEntreprise":false,
				"validateActionnaire":false,
				"title":"",
				"commentaire":"",
				"userId":UserAuthService.getUserId(),
				"date":UtilityManager.getDateCorrectedFormat()
			};
		
	};

	drugStoreService.getHomeData=(successHandler,errorHandler)=>{

		async.parallel({
			weeklySale:function(callback){
				var week=UtilityManager.getCurrentWeekInterval();
				var query={
						selector:{
							"ttype":"dailySale",
							"date":{
								$gte:week.beginWeek,
								$lt:week.endWeek,
							}
						},
						sort:[{"date":"desc"}]
					};
				PouchdbService.find(query).then(function(dailySales){
					
					callback(null,dailySales.docs);
			});
			},
			monthDailySale:function(callback){
				var month=UtilityManager.getCurrentMonthInterval();
				var query={
						selector:{
							"ttype":"dailySale",
							"date":{
								$gte:month.beginMonth,
								$lte:month.endMonth
							}
						},
						sort:[{"date":"desc"}]
					};
			
				PouchdbService.find(query).then(function(dailySales){
					
					callback(null,dailySales.docs);
			});
			}

			},function(err,results){

				if (err){
					console.log("error in getHomeData");
					console.log(err);
					var err={
							"err_code":0,
							"message":MessageManager.M1 +MessageManager.M2,
							"error":err
						};
						errorHandler(err);
				}
				 
				var bestDailySale=0;
				var worstDailySale=results.monthDailySale[0].chiffreAffaire;

				
				
				results.monthDailySale.forEach((dailySale)=>{
					if(dailySale.chiffreAffaire > bestDailySale) {
                		bestDailySale= dailySale.chiffreAffaire;
           			 }
           			if (dailySale.chiffreAffaire < worstDailySale) {
                		worstDailySale= dailySale.chiffreAffaire;
           			 }

				});
				//delete results.monthDailySale;
				results.worstMonthDailySale=worstDailySale;
				results.bestMonthDailySale=bestDailySale;
				return successHandler(results);
			}
		);	
		
	};

	return drugStoreService;

}]);