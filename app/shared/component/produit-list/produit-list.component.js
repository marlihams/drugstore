angular.module("produitList").
		component("produitList",{
	templateUrl:"component/produit-list/produit-list.template.html",
	controller: ['DrugStoreService',function ProduitListController(DrugStoreService){
		var ctrl=this;


	    ctrl.produits={
              "details": [
                {
                  "_id": "586e5c5ccf4bf538d8ef07fb",
                  "quantite": 210,
                  "expirationDate": "2022-12-06T00:00:00.000Z",
                  "emplacement": "2F"
                }
              ],
              "__v": 0,
              "prixVente": 100,
              "prixAchat": 80,
              "description": " 3 comprimet par jour pendant 12 jours. deconseiller pour les femmes enceinte",
              "nom": "ibuprofène",
              "_id": "586e5c5ccf4bf538d8ef07fa"
            };

  }]


});