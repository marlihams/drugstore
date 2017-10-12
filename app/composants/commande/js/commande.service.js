angular.module("drugstore.commande")
		.factory('CommandeService',['$resource','UserAuthService','DrugStoreService','CommandeManager','PouchdbService','MessageManager',function($resource,UserAuthService,DrugStoreService,CommandeManager,PouchdbService,MessageManager){
			var commandeService={};
			commandeService.quantity=0;

			/**
				  getting a commande By his Id
				 @function getcommandById
				 @params commandeId  id of the commande
				  @callback  successHandler to manage the result 
				 @callback  errorHandler to manage the error if an error happen


			*/

			commandeService.getCommandById=function(commandeId,successHandler,errorHandler){
				
				return PouchdbService.query("commandeView/byId",{
				keys:[[commandeId,0],[commandeId,1]],
				include_docs:true,
			})
				.then((rep)=>{
					var commande=CommandeManager.buildCommand(rep.rows);
				 	return successHandler(commande);
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
				  update  a  specific command 
				 @function update
				 @params command{Object}  the updated command
				 @callback  successHandler to manage the result 
				 @callback  errorHandler to manage the error if an error happen

			*/

			commandeService.update=function(command,successHandler,errorHandler){
				PouchdbService.save(command)
					.then(function(rep){
							console.log(rep);
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M19;
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
				 delete a command 
				 @function delete
				 @params commandId{String} id of the command
				 @callback  successHandler to manage the result 
				 @callback  errorHandler to manage the error if an error happen

			*/

			commandeService.delete=function(command,successHandler,errorHandler){
				PouchdbService.delete(command._id,command._rev)
					.then(function(rep){
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M24 +MessageManager.M22;
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
							"message":MessageManager.M20,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					});
			};

			/**
				 delete  commands 
				 @function delete
				 @params commandId{String} id of the command
				 @callback  successHandler to manage the result 
				 @callback  errorHandler to manage the error if an error happen

			*/

			/*commandeService.delete=function(command,successHandler,errorHandler){
				PouchdbService.delete(command._id,command._rev)
					.then(function(rep){
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M24 +MessageManager.M22;
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
							"message":MessageManager.M20,
							"error":error
						};
						console.log(err);
						drugStoreService.errorHandler(err,errorHandler);
					});
			};*/


			/**
				 create a  new command 
				 @function create
				 @params commandId{String} id of the command
				 @callback  successHandler to manage the result 
				 @callback  errorHandler to manage the error if an error happen

			*/

			commandeService.create=function(command,successHandler,errorHandler){
			
				  PouchdbService.save(command).then((rep)=>{
				 	console.log(rep);
					successHandler(rep);
				 }).catch((error)=>{
				 	errorHandler(MessageManager.M3);

					});
			};


			return commandeService;


		}]);