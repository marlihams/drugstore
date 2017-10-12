angular.module("drugstore.depense")
		.factory('DepenseService',['$resource','PouchdbService','UserAuthService','DepenseManager','MessageManager',function($resource,PouchdbService,UserAuthService,DepenseManager,MessageManager){
			var depenseService={};
			
			/**
				  getting a depense By between two date or the depense of the current month
				 @function filterDepenseByDate
				 @params beginDate 
				  @params endDate 
				 @callback  cb to manage the result 
				 	@callback params  produit{Object}

			*/

			depenseService.filterDepenseByDate=function(beginDate,endDate,succcessHandler,errorHandler){

				return PouchdbService.query("depenseView/byDate",{
					startkey:beginDate,
					endkey:endDate,
					 include_docs: true
				}).then((rep)=>{
					console.log(rep);
					var listDepense=[];
					if (rep.rows.length >0){
						 listDepense= DepenseManager.buildListDepense(rep.rows);
						  return succcessHandler(listDepense);
					}
					else{
						return succcessHandler(listDepense);
					}
				}).catch((error)=>{
					var err={
							"err_code":0,
							"message":MessageManager.M1 + MessageManager.M2,
							"error":error
						};
					console.log(error);
					errorHandler(err);
				});

			};
				
			/**
				  update  a  specific depense 
				 @function update
				 @params produit{Object}  the updated produit
				 @callback  cb to manage the result 
				 	@callback params  updatedDepense{Object}

			*/

			depenseService.update=function(depense,successHandler,errorHandler){
				PouchdbService.save(depense)
					.then(function(rep){
							console.log(rep);
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M39;
							successHandler(rep);
						}
						else{
							
							var err={
							"err_code":1,
							"message":MessageManager.M41,
							"error":rep
							};
						drugStoreService.errorHandler(err,errorHandler);
						}
				
					}).catch(function(error){
						var err={
							"err_code":1,
							"message":MessageManager.M40,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					
					});


			};

			/**
				 create a  new depense 
				 @function create
				 @params commandId{String} id of the depense
				 @callback  cb to manage the result 
				 	@callback params {object} the  depense of the month 

			*/

			depenseService.create=function(depense,successHandler,errorHandler){
				
				return PouchdbService.save(depense).then((rep)=>{
				 	console.log(rep);
					successHandler(rep);
				 }).catch((error)=>{
				 	var err={
							"err_code":1,
							"message":MessageManager.M35,
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

			/*depenseService.delete=function(produitId,cb){
				var $depenseService=new depenseService.request();
				 
				if(produitId){
					$depenseService._id=produitId;
					$depenseService.$delete(function(dailySale){

						if (cb){
							cb(dailySale);
						}

					});
				
				}
			};*/

			/**
				 create a  new produit 
				 @function create
				 @params produitId{String} id of the produit
				 @callback  cb to manage the result 
				 	@callback params {object} othe created produit and his dailySale

			*/

			/*depenseService.validate=function(userId,cb){
				var $depenseService=new depenseService.request();
				 $depenseService.data=userId;
				if(userId){
					$depenseService.$save(function(rep){

						if (cb){
							cb(rep);
						}

					});
				
				}
			};*/
				/**
				  getting all product
				 @function getAll
				 @params produitId  id of the produit
				 @callback  cb to manage the result 
				 	@callback params  produit{Object}


			depenseService.getAll=function(cb){

				var produits=depenseService.request.query(function(produits){
					
					if (cb)
						cb(produits);
				});

				return produits;
			};

			*/

			return depenseService;

		}]);