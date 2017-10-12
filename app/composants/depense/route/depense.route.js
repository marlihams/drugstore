angular.module('drugStoreSoftware')
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('depense-edit', {
          url: '/depense/edit',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("home state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
          views: {
            '': {
             templateUrl: 'app/composants/depense/view/depenses.html',
             controller:'DepenseController',
            
              },
            'header@depense-edit': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             }
             
         },
         resolve:{
           depenses:function(DepenseService,UtilityManager,DrugStoreService){
                        var month=UtilityManager.getCurrentMonthInterval();

                  return DepenseService.filterDepenseByDate(month.beginMonth,month.endMonth,(depenses)=>{
                  
                    return depenses;
                  },(error)=>{
                    DrugStoreService.displayErrorPage(error);
                  });

                }
            
            }
        });
    }]);





