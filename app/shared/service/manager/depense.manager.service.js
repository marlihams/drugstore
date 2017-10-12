angular.module("drugstore.manager")
		.service('DepenseManager',['MessageManager',function(MessageManager){


		this.buildListDepense=function(objArr){
			var depenses=[];
			objArr.forEach((obj)=>{
				depenses.push(obj.doc);
			});
			return depenses;
		}
		this.buildMessageDepenseInfo=(depenses,user)=>{

			if (user.profil=="pharmacien"){
				return null;
			}
			else{

				var depenseEntreprise=0;
				var depenseActionnaire=0;
				depenses.forEach((depense)=>{
					
						depenseActionnaire+=depense.validateActionnaire==false ? 1:0;
						depenseEntreprise+=depense.validateEntreprise==false ? 1:0;
				});
				 var message=null;
				 var m1=null;
				 var m2=null;
				if (user.profil=="actionnaire" && depenseActionnaire>0){
					var m1=MessageManager.M42.replace("?",""+depenseActionnaire);
					var m2=MessageManager.M43.replace("?",""+depenseEntreprise);
					message=m1+MessageManager.M44+m2;
				}
				if (user.profil=="admin" && depenseEntreprise>0){
					var m1=MessageManager.M42.replace("?",""+depenseEntreprise);
					var m2=MessageManager.M43.replace("?",""+depenseActionnaire);
					message=m1+MessageManager.M44+m2;
				}
				return message;
			}
		
		};

}]);