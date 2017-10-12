
angular.module("drugstore.manager")
		.service('UtilityManager',["MessageManager",function(PouchdbService,MessageManager){

			/*var devVariable={
				 currentDate:"2016-12-23",
    			 beginWeek: "2016-12-19"
			};*/
			var devVariable=null;

		this.getCurrentDate=function(fullFormat){
			 if (devVariable && devVariable.currentDate){

			 	return   this.getDateCorrectedFormat(devVariable.currentDate,fullFormat);
			 }
			 else{

			 	return this.getDateCorrectedFormat(null,fullFormat);

			 }
		}

		this.convertArrayToJson=function(keys,jsonArray){

			var jsonObject={};
			if (keys.lengh !=sonArray.lengh){
				console.log("error dans la fonction convertArrayToJson");
			}
			keys.forEach(function(key,index){
				jsonObject.key=jsonArray[index];

			});
			return jsonObject;
		};

/**
	@function getCurrentWeekInterval
	 determine the begin and the end of the current week



*/
this.getCurrentWeekInterval=function(fullFormat){


	var beginWeek;
	var endWeek;
	if (devVariable && devVariable.beginWeek && devVariable.beginWeek.length!=0){
		var beginWeek= new Date(devVariable.beginWeek);
		var endWeek=new Date(devVariable.beginWeek);
		endWeek.setDate(beginWeek.getDate()+6);
	}
	else{
		
		beginWeek=new Date();
		endWeek=new Date();
		beginWeek.setDate(beginWeek.getDate()-6);
		endWeek.setDate(endWeek.getDate()+1);
	}

	return {
			"beginWeek":this.getDateCorrectedFormat(beginWeek,fullFormat),
			"endWeek":this.getDateCorrectedFormat(endWeek,fullFormat),
		};


};

this.getDateFromMonth=function(){


 if (devVariable && devVariable.beginWeek){

 	return  new Date(devVariable.beginWeek);
 }
 else{

 	return new Date();

 }

};




this.getDateCorrectedFormat=function(date,fullFormat){
	
	var d= date ? new Date(date):(new Date());
	var dateFormat=d.toISOString();
	console.log(dateFormat);
	if (fullFormat){
		return dateFormat;
	}
	else{
		 var limitDate=dateFormat.indexOf("T");
		 limitDate=limitDate !=-1 ? limitDate:dateFormat.length;
		return dateFormat.substring(0,limitDate);
	}
};

this.getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};
this.getCurrentMonthInterval=function(){

	var beginMonth;
	var endMonth;
	var d;
	if (devVariable && devVariable.beginWeek && devVariable.beginWeek.length!=0){
		d=new Date(devVariable.beginWeek);
	}
	else{
		d=new Date();
	}
		d=this.getDateCorrectedFormat(d);
		 beginMonth=d.split("-");
		 beginMonth[2]="01";
		 endMonth=d.split("-");
		 endMonth[2]="31";
	return {
			"beginMonth":beginMonth.join("-"),
			"endMonth":endMonth.join("-")
		};
}

this.buildDepenseInfoQuery=(user)=>{

	var profil=user ? user.profil.trim() :null;
	
	var query=null;
	switch(profil){
		case 'admin':
				query={
						selector:{
							"ttype":"depense",
							"validateEntreprise":false,
						}
					};
			 break;
		case 'actionnaire':
				query={
						selector:{
							"ttype":"depense",
							"validateActionnaire":false,
						}
				};
			break;
		case 'superAdmin':
				query={
						selector:{
							"ttype":"depense",
							$or:[
								{"validateEntreprise":false},
								{"validateActionnaire" :false}
							]
						}
				};
			break;
	}
	if (query !=null){
		query.sort="date";
	}
	return query;
}


}]);	