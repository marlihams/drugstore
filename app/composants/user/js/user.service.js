angular.module('drugstore.user')
	   .factory('UserAuthService', ["PouchdbService", '$window', function(PouchdbService,$window){
   var auth = {};
   auth.tokenName='drugstore-software-token';

	/**
	 * setting a token inside the localstorage
	 * @param {token} 
	*/
   auth.saveToken = function (token){
  		$window.localStorage['drugstore-software-token'] = token;
	};

	/**
	 * getting a token inside the localstorage

	*/

	auth.getToken = function (){
 	 return $window.localStorage[auth.tokenName];
	};

	/**
	 * check is a user is logged
	 * @return {boolean} 
	*/

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse(token);
	    return payload.exp > (Date.now());
	  } else {
	    return false;
	  }
	 
	};

	/**
	 * getting the username of the user that's logged in
	 * @return {String} username 
	*/
	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse(token);
	    return payload;
	  }
	  return null;
	 
	};
	
	/**
	 * post a user to /register route and saves the token returned 
	 * @param {Object} user 
	*/

	auth.register = function(user){
	/*  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });*/
	};

	/**
	 * post a user to /login route and saves the token returned 
	 * @param {Object} user 
	*/
	auth.logIn = function(user,successHandler,failedHandler){
	

	  var userSelector={
	  	selector:user,
	  	fields:['_id','username','telephone','profil']
	  };
	  
	 	PouchdbService.find(userSelector)
	 	 .then(function(rep){
	 	 	var utilisateur=rep.docs[0];
	 	 	var today = new Date();
			  var exp = new Date();
			  exp.setDate(today.getDate() +1);
			  utilisateur["exp"]=exp.getTime();
			auth.saveToken(JSON.stringify(utilisateur));
	 	 	//redirect to the home page
	 	 	successHandler();
	 	 })
	 	 .catch(failedHandler);
	
	};

	/**
	 *  removes the user's token from localStorage, logging the user out.
	 * @function logout
	*/
	auth.logOut = function(){
	 $window.localStorage.removeItem(auth.tokenName);
	};
	auth.getUserId=()=>{
		if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse(token);
	    return payload._id;
	  }
	};

  return auth;
}]);