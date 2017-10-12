angular.module("drugstore.dailySale")
		.factory('DailySaleService',['$resource','PouchdbService','UtilityManager','DailySaleManager','MessageManager','DrugStoreService',function($resource,PouchdbService,UtilityManager,DailySaleManager,MessageManager,DrugStoreService){
			var dailySaleService={};

			/**
				 * getting a dailySale By his Id
				 @function getDailySaleById
				 @params dailySaleId  id of the dailySale
				 @callback  cb to manage the result 

			*/

			dailySaleService.getDailySaleByDate=function(dailySale,cb){

					var date=UtilityManager.getDateCorrectedFormat(dailySale.date,false);
				return PouchdbService.query("dailySaleView/byDate",{
					startkey:[date,0],
					endkey:[date,2],
					 include_docs: true
				}).then((rep)=>{
					console.log(rep);
					var selectedDaySale=null;
					if (rep.rows.length >0){
						 selectedDaySale= DailySaleManager.populateDailySale(rep.rows);
						 return cb(selectedDaySale);
					}
				});
			};


			dailySaleService.getUniqueDailySale=function(key,cb){

					var date =UtilityManager.getDateCorrectedFormat(key,false);
				return PouchdbService.query("dailySaleView/byDate",{
					startkey:[date,0],
					endkey:[date,2],
					 include_docs: true
				}).then((rep)=>{
					console.log(rep);
					var selectedDaySale=null;
					if (rep.rows.length >0){
						 selectedDaySale= DailySaleManager.populateDailySale(rep.rows);
						 return cb(selectedDaySale);
					}
				});
			};


			/**
				 * getting the dailysale between two date the format of the date are yyy-MM-DD
				 @function filterDailySaleByDate
				 @params beginDate{string}  begin date of the filter
				 @params endDate{string}  end date of the filter
				 @callback  cb to manage the result 


			*/

			dailySaleService.filterDailySaleByDate=function(beginDate,endDate,cb){
				
				return PouchdbService.query("dailySaleView/byDate",{
					startkey:[beginDate,0],
					endkey:[endDate,0],
					 include_docs: true
				}).then((rep)=>{
					console.log(rep);
					var listDailySale=null;
					if (rep.rows.length >0){
						 listDailySale= DailySaleManager.buildListDailySale(rep.rows);
						  return cb(listDailySale);
					}
				});

			};

				/**
				 * update a specific dailySale
				 @function update
				 @callback  cb to manage the result 

			*/
			dailySaleService.updateDailySale=function(dailySale){
				return PouchdbService.save(dailySale);
			}

			dailySaleService.update=function(dailySale,successHandler,errorHandler){
				PouchdbService.save(dailySale)
					.then(function(rep){
							console.log(rep);
						if (rep.ok){
							rep.status=true;
							rep.message=MessageManager.M29;
							successHandler(rep);
						}
						else{
							
							var err={
							"err_code":1,
							"message":MessageManager.M16 +MessageManager.M2,
							"error":rep
							};
						DrugStoreService.errorHandler(err,errorHandler);
						}
				
					}).catch(function(error){
						var err={
							"err_code":1,
							"message":MessageManager.M16 +MessageManager.M4,
							"error":error
						};
						console.log(err);
						DrugStoreService.errorHandler(err,errorHandler);
					
					});
			};

			dailySaleService.updateOrDelDoc=function(objToDel,objToUpd,successHandler,errorHandler){
				objToDel.map(function(obj){
					obj._deleted=true;
				});
				var obj=objToDel.concat(objToUpd);
            	// return new Promise((resolve,reject)=>{
				return PouchdbService.bulkDocs(obj)
					.then(function(rep){
							console.log(rep);
						successHandler(rep);
				
					}).catch(function(error){
						errorHandler(error);
					});
			};




			/**
				 * get daily Sale  of the month 
				 @function getMonthDailySale
				 @callback  cb to manage the result 

			*/

			dailySaleService.getCurrentDailySale=function(successHandler,errorHandler){

				var date=UtilityManager.getCurrentDate();
				
				return PouchdbService.query("dailySaleView/byDate",{
					startkey:[date,0],
					endkey:[date,2],
					 include_docs: true
				}).then((rep)=>{
					console.log(rep);
					var currentDailySale=null;
					if (rep.rows.length >0){
						 currentDailySale= DailySaleManager.populateDailySale(rep.rows);
						 return successHandler(currentDailySale);
					}
					else{
						// creation of a new DailySale.
						currentDailySale=DailySaleManager.createDailySale();
						PouchdbService.save(currentDailySale).then((rep)=>{
							currentDailySale._id=rep.id;
							currentDailySale._rev=rep.rev;
							return successHandler(currentDailySale);
						});
						
					}
					
				}).catch((err)=>{
					console.log(err);
					var err={
							"err_code":0,
							"message":MessageManager.M1 +MessageManager.M2,
							"error":error
						};
					errorHandler(err);
				});

				
			};
		

			return dailySaleService;

		}]);