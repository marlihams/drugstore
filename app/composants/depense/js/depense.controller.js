angular.module("drugstore.depense")
.controller('DepenseController',[
	'$scope',
	'$state',
	'$filter',
	'UserAuthService',
	'DepenseService',
	'DrugStoreService',
	'MessageManager',
	'depenses',
	'$mdDialog',
	function($scope,$state,$filter,UserAuthService,DepenseService,DrugStoreService,MessageManager,depenses,$mdDialog){

			console.log("depense view");
			$scope.globalDepense=[];
			$scope.bonDepense=[];
			$scope.displayedDepense=DrugStoreService.createDepense();
			$scope.title="Depense du mois courant";
			$scope.typeDepense=[{
				"type":"autre",
				"selected":true
				},{
				 "type":"actionnaire",
				 "selected":false
				},{
				"type":"entreprise",
				"selected":false
				}
			];
		var updateTitle=function(){
			var title="Depense du ";
			/*title=title + $filter('date')(
				depenses[depenses.length-1].date,
				'dd/MM/yyyy'
				);
			title=title + " au "+ $filter('date')(
				depenses[0].date,
				'dd/MM/yyyy'
				);*/
		};

	var initializeObj=(depenses)=>{
	  	var totalActionnaire=0;
		var totalEntreprise=0;
		var otherDepense=0;
		$scope.globalDepense=[];
		$scope.bonDepense=[];

		for (var i=0;i<depenses.length;i++){

				if (depenses[i].type=="autre"){
					$scope.globalDepense.push(depenses[i]);
					otherDepense+=depenses[i].prix;

				}
				else if(depenses[i].type=="actionnaire"){
					$scope.bonDepense.push(depenses[i]);
					totalActionnaire+=depenses[i].prix;
				}
				else{
					$scope.bonDepense.push(depenses[i]);
					totalEntreprise+=depenses[i].prix;
				}
			}

			
			$scope.totalActionnaire=totalActionnaire;
			$scope.totalEntreprise=totalEntreprise;
			$scope.otherDepense=otherDepense;
			$scope.total=totalActionnaire+totalEntreprise+otherDepense;
			$scope.displayedDepense=DrugStoreService.createDepense();

			// $scope.submitted=false;
			// initialize begin date end End Date:
			var deb=null;
			var end=null;
			if(depenses.length>0){
			 	deb=new Date(depenses[0].date); 
			 	end=new Date(depenses[depenses.length-1].date)
			}
			else{
				deb=new Date();
				end=new Date();
			}

			$scope.beginDate=new Date(deb.getFullYear(),deb.getMonth(),1);
			$scope.endDate=new Date(end.getFullYear(),end.getMonth()+1,0);
	};
	initializeObj(depenses);

$scope.changeSelectedDepense=function(depense){
	 $scope.submitted=false;
	if ($scope.displayedDepense._id !=depense._id){ 
		//changement de selection
		unselectRefDepense();
 	}
      
       if(depense.selected){
      		angular.copy(depense, $scope.displayedDepense); 
       }
       else{
       		// aucune depense n'est selectionnée.
       		$scope.displayedDepense=DrugStoreService.createDepense();
       	}
      reInitiateDepenseType();

    $scope.statusValidation=$scope.displayedDepense.validateActionnaire && $scope.displayedDepense.validateEntreprise;
};
var unselectRefDepense=()=>{

	if ($scope.displayedDepense && $scope.displayedDepense._id){
		var obj;
		obj=$scope.displayedDepense.type=="autre" ?$scope.globalDepense:$scope.bonDepense;
		var ref=obj.find((element)=>{
				return element._id==$scope.displayedDepense._id;
			});
			ref.selected=false;
	}
};

$scope.rechercheDepense=(beginDate,endDate)=>{

	DepenseService.filterDepenseByDate(
		$filter('date')($scope.beginDate,"yyyy-MM-dd"),
		$filter('date')($scope.endDate,"yyyy-MM-dd"),
		function(response){
				initializeObj(response);

				
		},function(error){
			DrugStoreService.failedRequest(MessageManager.M36);
		});
	
}

$scope.validerDepense=($event)=>{
	var bool=$scope.displayedDepense? $scope.displayedDepense.selected : null;
		if (bool){
			$mdDialog.show({
		         parent: angular.element(document.body),
		         targetEvent: $event,
		         templateUrl:'app/composants/depense/view/validation.template.html',
		         /*locals: {
		           items: details
		         },*/
		          scope: $scope,        // use parent scope in template
          		  preserveScope: true,
		         clickOutsideToClose:true,
		         controller:function DialogController($scope,$mdDialog,DrugStoreService,UserAuthService,MessageManager){
		         
		         var updateStatusDepense=()=>{
		         	var user=UserAuthService.currentUser();
						switch(user.profil){
							case 'admin':
									$scope.displayedDepense.validateEntreprise=$scope.displayedDepense.validation;
									$scope.displayedDepense.validateActionnaire=false;
									delete $scope.displayedDepense.validation;
									$scope.update();
								 break;
							case 'actionnaire':
									$scope.displayedDepense.validateActionnaire=$scope.displayedDepense.validation;
									$scope.displayedDepense.validateEntreprise=false;
									delete $scope.displayedDepense.validation;

									$scope.update();
								break;
							case 'pharmacien':
								$mdDialog.hide();
								DrugStoreService.infoRequest(MessageManager.M38)
								break;
						}
		         }
		            $scope.validateDepense=()=>{
		            		$scope.displayedDepense.validation=true;
		            		delete $scope.displayedDepense.selected;
					 	 	console.log("validation depense");
					 	 	updateStatusDepense();
					 	 	$mdDialog.hide();
					 	 
		            };
		            $scope.unValidateDepense=()=>{
		            	console.log("unValidateDepense");
		            	$scope.displayedDepense.validation=false;
		            	delete $scope.displayedDepense.selected;
						 updateStatusDepense();
						 	$mdDialog.hide();
					 
		            };
		            $scope.closeDialog=()=>{
		            	console.log("close dialog");
		            	$mdDialog.hide();
		            };
		         }
		      });
		}
		else{
			 DrugStoreService.infoRequest(MessageManager.M37);	
			}

};

var updateGenericInfo=(obj,id)=>{
	var depenseSelected=null;
	if (obj){
		depenseSelected= obj.find((element)=>{
			return element._id===id;
		});
		if (depenseSelected){
			$scope.submitted=false;
			depenseSelected.selected=false;
			$scope.displayedDepense.selected=false;
			var oldPrice=depenseSelected.prix;
			angular.copy($scope.displayedDepense,depenseSelected);
			if (depenseSelected.type=="actionnaire"){
				 $scope.totalActionnaire-=oldPrice;
				
				$scope.totalActionnaire+=$scope.displayedDepense.prix;
			}
			if (depenseSelected.type=="entreprise"){
				 $scope.totalEntreprise-=oldPrice;
				
				$scope.totalEntreprise+=$scope.displayedDepense.prix;
			}
			if (depenseSelected.type=="autre"){
				 $scope.otherDepense-=oldPrice;
				
				$scope.otherDepense+=$scope.displayedDepense.prix;
			}
			$scope.total=$scope.otherDepense+$scope.totalActionnaire+$scope.totalEntreprise;
		}
	}
};

$scope.changeDepenseType=()=>{

	if ($scope.displayedDepense.selected){
		// cas d'une modification
		 alert("vous ne pouvez pas changer le type de la dépense");
		console.log($scope.displayedDepense.type);
		
		var previous=$scope.typeDepense.find((element)=>{
			return element.selected==true;
		});
		$scope.displayedDepense.type=previous.type;
	}
	else{
		 reInitiateDepenseType();
	}
};

var reInitiateDepenseType=()=>{
	$scope.typeDepense.forEach(function(element){

			 	element.selected= element.type===$scope.displayedDepense.type ? true:false;
		});
};

$scope.saveChangement=()=>{

		 $scope.submitted=true;

	var bool=$scope.displayedDepense && $scope.displayedDepense.selected ?true  :false ;

	if (bool){
	// cas d'une modification
		delete $scope.displayedDepense.validation;
		delete $scope.displayedDepense.selected;
		$scope.displayedDepense.validateActionnaire=false;
		$scope.displayedDepense.validateEntreprise=false;
			$scope.update();
		}
	else {
		// cas new depense
		console.log("creation new depense");
		console.log($scope.displayedDepense);

			DepenseService.create($scope.displayedDepense,(rep)=>{
			if (rep){
					
					$state.go('depense-edit',{},{reload:true});
					DrugStoreService.succesRequest(MessageManager.M34);
			}

		},(error)=>{
			DrugStoreService.failedRequest(error.message);

		});
	}



};

 $scope.update=function(){
	
	console.log("modification depense");
		console.log($scope.displayedDepense);
		DepenseService.update($scope.displayedDepense,(rep)=>{
	 	 	$state.go('depense-edit',{},{reload:true});

	 	 	DrugStoreService.succesRequest(rep.message);

	 	 	},(error)=>{
	 	 		DrugStoreService.failedRequest(error.message);
	 	 	
	 	 	});
	};
	
	}]);