
angular.module("drugstore.manager")
		.service('UserManager',["MessageManager",function(PouchdbService,MessageManager){


this.getUserByID=function(id,successHandler,errorHandler) {
	
	PouchdbService.get(id)
	.then((user)=>{
		if (user)
			successHandler(user);
		else{
			var err={
			"err_code":0,
			"message":MessageManager.M21 +MessageManager.M2,
			"error":error
		};
			errorHandler(err);
		}
	})
	.catch((error)=>{
		console.log(error);
		var err={
			"err_code":0,
			"message":MessageManager.M1 +MessageManager.M2,
			"error":error
		};
		errorHandler(err);
	});
}

}]);	