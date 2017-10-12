angular.module("drugstore.manager")
		.service('CommandeManager',[function(PouchdbService){

		this.buildCommand=function(rows){
			var commande={};
			
			if (rows.length>0){
					commande=rows[0].doc;
					commande.client=rows.length ==2 ?rows[1].doc:null;
			}
			return commande;
		}


}]);
		

 	