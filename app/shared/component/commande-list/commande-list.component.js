angular.module("commandeList").
		component("commandeList",{
	templateUrl:"component/commande-list/commande-list.template.html",
	controller: ['DrugStoreService',function CommandeListController(DrugStoreService){
		var ctrl=this;
		
		/* var CommandeSchema = new Schema({
    title:String,
    client: mongoose.Schema.Types.ObjectId,
    clientType:{type:String,enum:['recommandeur','abonner']},
    payer: Boolean,
    recompense: Boolean,
    date: {type:Date, default:Date.now},
    details:[
    {
    	produit:[ProduitSchema],
    	quantite:Number
    }]
});
*/
    console.log("component");
 

		this.accordionData = [
        {
            "title" : "holden",
            "details" : [
            	{
            		nom:"aspirine 500mg",
            		quantite:2
            	},
            	{
            		nom:"nivaquine 500mg",
            		quantite:2

            	},
            	{
            		nom:"paracetamol 100mg",
            		quantite:2

            	},
            	{
            		nom:"acétylsalicylique 500mg",
            		quantite:2

            	}

            ]
        },
        {
            "title" : "1234572197",
            "details" : [
            	{
            		nom:"aspirine 500mg",
            		quantite:2
            	},
            	{
            		nom:"nivaquine 500mg",
            		quantite:2

            	},
            	{
            		nom:"paracetamol 500mg",
            		quantite:2

            	},
            	{
            		nom:"acétylsalicylique 500mg",
            		quantite:2

            	}

            ]
        },
      
    ];

	  this.collapseAll = function(data) {
		   for(var i in this.accordionData) {
		       if(this.accordionData[i] != data) {
		           this.accordionData[i].expanded = false;   
		       }
		   }
		   data.expanded = !data.expanded;
		};
	 this.addCommand=function(command){
	 	this.accordionData.push(command);
	 };


}]
});