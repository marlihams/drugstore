angular.module("drugstore.manager")
		.service('ProduitManager',["UtilityManager",function(UtilityManager){

	this.buildStatInfo=function(produits){

		var nbstock=0;
		var outOfStock=0;
		var yearExpiration=0;
		var expired=0;
		var monthExpiration=0;
		var expDateFormat;
		var today= new Date(UtilityManager.getCurrentDate());
		var results={};
		produits.forEach((produit)=>{
			if (produit.details){
				produit.details.forEach((detail)=>{
					if (detail.quantite){
						nbstock+=detail.quantite;
					}
					else{
						outOfStock++;
					}
					expDateFormat=new Date(detail.expirationDate);

					if (expDateFormat.getFullYear()==today.getFullYear()){
						yearExpiration+=detail.quantite;
						if (expDateFormat.getMonth()==today.getMonth())
							monthExpiration+=detail.quantite;
					}
					if  (expDateFormat < today){
						expired+=detail.quantite;
					}

				});
			}
		});
		results.nbProduit=produits.length;
		results.nbstock=nbstock;
		results.outOfStock=outOfStock;
		results.expired=expired;
		results.yearExpiration=yearExpiration;
		results.monthExpiration=monthExpiration;

		return results;
	}

	this.buildListProduits=function(produitsArr){

		var produits=[];
		produitsArr.forEach((element)=>{
			produits.push(element.doc);
		});
		return produits;
	}


	this.expandProduit=function(produitsArr){
		var produitList=[];
		var produits=this.buildListProduits(produitsArr);
		 produits.forEach((produit)=>{
	      if (produit.details.length>1){
	         produit.details.forEach(function(detail){
	          var cloneProduit={};
	          angular.copy(produit,cloneProduit);
	       //   cloneProduit.expirationDate=details.
	          cloneProduit=cloneDetails(cloneProduit,detail);
	          produitList.push(cloneProduit);
	         });
	      }
	      else{
	      	 var cloneProduit={};
	        cloneProduit=cloneDetails(produit,produit.details[0]);
	        produitList.push(cloneProduit);
	      }

    });
		 return produitList;

	}

	this.createListProduits=(obj)=>{
     var produitList=[];
     var refProduits={};
     var indexProduit=null;
     var listProduitName=[];
     var details;
     var buildDetails=(prod)=>{
     	return {
     			"emplacement":prod.emplacement,
     			"expirationDate":UtilityManager.getDateCorrectedFormat(prod.expirationDate),
     			"quantite":Number.parseInt(prod.quantite,10)
     		};
     };
     obj.forEach(function(prod){
     	prod.ttype="produit";
     	detail=buildDetails(prod);
     	if (listProduitName.indexOf(prod.nom)==-1){
     		listProduitName.push(prod.nom);
     		refProduits[prod.nom]=produitList.length;
     		prod.details=[];
     		
     		prod.details.push(detail);
     		delete prod.emplacement;
     		delete prod.expirationDate;
     		delete prod.quantite;
     		prod.prixAchat=Number.parseInt(prod.prixAchat,10);
     		prod.prixVente=Number.parseInt(prod.prixVente,10);
     		produitList.push(prod);
     	}
     	else{
     		indexProduit=refProduits[prod.nom];
     		produitList[indexProduit].details.push(detail);
     	}

     });

     return produitList;

	};

	function cloneDetails(clone,details){

	    clone.expirationDate=details.expirationDate;
	    clone.emplacement=details.emplacement;
	    clone.oldStock=details.quantite;
	    clone.stock=details.quantite;
	    delete clone.details;

	    return clone;
 	};

 	this.updateProduitsQuantite=function(produits,produitsVal){
 			var idProduitToUpdates=Object.keys(produitsVal);
	 	produits.forEach((produit)=>{
	 		if (idProduitToUpdates.indexOf(produit._id) !=-1){
		      if (produit.details.length>0){
		         	produit.details.forEach(function(detail){
		         		var val=produitsVal[produit._id];
		         		if (detail.emplacement==val[0]){
		         		  if (val.length==3){
		         		  	// emplacement, stock, quantite
		         		  	detail.quantite+=val[2];
		         		  }
		         		  else{	
		         		  	// emplacement, stock
		         			detail.quantite=val[1];
		         		 }
		         		}		         		
		         });
		     }
		    }
		 });
	 	return produits;
	 }
 

}]);