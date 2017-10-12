angular.module("drugstore.produit")
		.factory('ProduitService',['$resource','Upload','UserAuthService','DrugStoreService','ProduitManager','PouchdbService','MessageManager',function($resource,Upload,UserAuthService,DrugStoreService,ProduitManager,PouchdbService,MessageManager){
			var produitService={};
			produitService.quantity=0;
			/*produitService.request= $resource('/produit/:id',{id:'@_id'},{
					update:{
						method:'PUT'
					},
					info:{
						method:'GET'
					}
				});*/

			/**
				  getting a produit By his Id
				 @function getProduitById
				 @params produitId  id of the produit
				 @callback  cb to manage the result 
				 	@callback params  produit{Object}

			*/

			produitService.getProduitById=function(produitId,successHandler,errorHandler){

				return PouchdbService.get(produitId)
				.then((rep)=>{
				 	return successHandler(rep);
				 }).catch((error)=>{
				 	var err={
							"err_code":0,
							"message":MessageManager.M1 +MessageManager.M2,
							"error":error
						};
						errorHandler(err);
				 });
			};

			/**
				  update  a  specific produit 
				 @function update
				 @params produit{Object}  the updated produit
				 @callback  cb to manage the result 
				 	@callback params  updatedProduit{Object}

			*/

			produitService.update=function(produit,successHandler,errorHandler){
			

				PouchdbService.save(produit)
					.then(function(rep){
							console.log(rep);
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M8;
							successHandler(rep);
						}
						else{
							
							var err={
							"err_code":1,
							"message":MessageManager.M16 +MessageManager.M2,
							"error":rep
							};
						drugStoreService.errorHandler(err,errorHandler);
						}
				
					}).catch(function(error){
						var err={
							"err_code":1,
							"message":MessageManager.M16 +MessageManager.M4,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					
					});
					
				
			};

			/**
				 delete a produit 
				 @function delete
				 @params produitId{String} id of the produit
				 @callback  cb to manage the result 

			*/

			produitService.delete=function(produit,successHandler,errorHandler){
				
					PouchdbService.delete(produit._id,produit._rev)
					.then(function(rep){
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M5 +MessageManager.M22;
							successHandler(rep);
						}
						else{

							var err={
							"err_code":1,
							"message":MessageManager.M16 +MessageManager.M2,
							"error":rep
							};
						drugStoreService.errorHandler(err,errorHandler);
						}
					}).catch(function(error){

						var err={
							"err_code":1,
							"message":MessageManager.M10,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					});
			};

			/**
				 create a  new produit 
				 @function create
				 @params produitId{String} id of the produit
				 @callback  cb to manage the result 
				 	@callback params {object} othe created produit and his dailySale

			*/

			produitService.create=function(produit,successHandler,errorHandler){
				
				  PouchdbService.save(produit).then((rep)=>{
				 	console.log(rep);
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M23;
							successHandler(rep);
						}
						else{

							var err={
							"err_code":1,
							"message":MessageManager.M3,
							"error":rep
							};
						drugStoreService.errorHandler(err,errorHandler);
						}
				 }).catch((error)=>{
				 var err={
							"err_code":1,
							"message":MessageManager.M3,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					});
			};
				/**
				  getting all product
				 @function getAll
				 @params produitId  id of the produit
				 @callback  cb to manage the result 
				 	@callback params  produit{Object}

			*/

			produitService.getAll=function(successHandler,errorHandler){
				/*var query={
						selector:{
							"ttype":"produit"
						}
					};*/

			return	PouchdbService.query("produitView/getAll",{
				include_docs:true
			}).
				then((rep)=>{
					 var produits=ProduitManager.buildListProduits(rep.rows);
					 	return successHandler(produits);
					}).
					catch((error)=>{
						var err={
							"err_code":0,
							"message":MessageManager.M1 +MessageManager.M2,
							"error":error
						};
						DrugStoreService.errorHandler(err,errorHandler);
					});
			}

			produitService.getAllProduit=function(successHandler,errorHandler){
				

			return	PouchdbService.query("produitView/getAll",{
				include_docs:true
			}).
				then((rep)=>{
					 var produits=ProduitManager.expandProduit(rep.rows);
					 	return successHandler(produits);
					}).
					catch((error)=>{
						var err={
							"err_code":0,
							"message":MessageManager.M1 +MessageManager.M2,
							"error":error
						};
						DrugStoreService.errorHandler(err,errorHandler);
					});
			}



		
			/**
				  getting global Info of product
				 @function getGlobalInfo
				 @params produitId  id of the produit
				 @callback  cb to manage the result 
				 	@callback params  produit{Object}

			*/

			produitService.getGlobalInfo=function(successHandler,errorHandler){
				 
				return new Promise((resolve,reject)=>{
						produitService.getAll((produits)=>{
							var stats=ProduitManager.buildStatInfo(produits);
							resolve(stats);
						},(error)=>{
							reject(error);
						});
					});

			};
			produitService.addMultipleProduit=function(obj,successHandler,errorHandler){

				
				var produits=ProduitManager.createListProduits(obj);
				console.log(produits);
				return PouchdbService.bulkDocs(produits)
						.then(function(rep){
							rep.message=MessageManager.M15 +MessageManager.M7;
							successHandler(rep);
						})
						.catch((error)=>{
							var err={
							"err_code":1,
							"message":MessageManager.M32 + MessageManager.M14+ MessageManager.M2,
							"error":error
						};
						console.log(error);
						drugStoreService.errorHandler(err,errorHandler);

						});
				
			};
			/**
			* @updateMultipleProduit
			* params produitValue objet du type {id:[emplacement,stock,quantite]}
			*/

			produitService.updateMultipleProduit=function(produitValue){
				var ListProduitId=Object.keys(produitValue);

			return new Promise((resolve,reject)=>{
				
				PouchdbService.allDocs({
					 include_docs: true,
					 keys:ListProduitId
				}).then(function(rep){
					
					var produits=ProduitManager.updateProduitsQuantite (
						ProduitManager.buildListProduits(rep.rows),
						produitValue
						);
					PouchdbService.bulkDocs(produits).then(function(resp){
						
						resolve(resp);
					}).catch((err)=>{

						reject(MessageManager.M25);
						
					});

			});	
			});


			};

			return produitService;

		}]);