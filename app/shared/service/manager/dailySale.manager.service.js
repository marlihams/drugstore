angular.module("drugstore.manager")
		.service('DailySaleManager',['UtilityManager',function(UtilityManager){


		this.dailySaleByDateView=function (doc) {
			  var d=d.date;
			  var dateFormat;
			    if (d!=null){
			      var limitDate=d.indexOf("T");
			      limitDate=limitDate !=-1 ? limitDate:d.length;
			      dateFormat=d.substring(0,limitDate);
			      if (doc.ttype="dailySale"){
			        emit([dateFormat,0]);
			      }
			      else if (doc.ttype="commande"){
			        emit([dateFormat,1]);
			      }
			}

		}

		this.populateDailySale=function(docArray){
			var dailySale=docArray[0].doc;
			dailySale.commandes=[];
			var currentElement;
			for (var i=1;i<docArray.length;i++){
				currentElement=docArray[i];
				if(currentElement.key[1]==1){
					// it is a command
					dailySale.commandes.push(currentElement.doc);
				}
			}
			return dailySale;
		};
		this.buildListDailySale=function(docArray){
			var listDailySale=[];
			for (var i=0;i<docArray.length;i++){
				if (docArray[i].doc.ttype=="dailySale"){
					listDailySale.push(docArray[i].doc);
				}
			}
			return listDailySale.reverse();
		};

		this.createDailySale=function(){
			var d=new Date();
			return  {

			  "ttype": "dailySale",
			  "title": d.toDateString(),
			  "chiffreAffaire":0,
			  "etat": false,
			  "benefice":0 ,
			  "commandes": [ ],
			  "date":UtilityManager.getDateCorrectedFormat(null,true),
			  "totalProduits": 0
		};
	}

}]);