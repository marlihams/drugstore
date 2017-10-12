angular.module('drugStoreSoftware')
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('dailySale-details', {
          url: '/dailySale/details/:dailySaleDate',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("home state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
          views: {
            '': {
             templateUrl: 'app/composants/dailySale/view/dailySale.details.html',
             controller:'DailySaleDetailsController',
            
              },
            'header@dailySale-details': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             }
             
         },
         resolve:{
          currentDailySale:function($stateParams,DailySaleService){
              return new Promise((resolve,reject)=>{

                 DailySaleService.getUniqueDailySale($stateParams.dailySaleDate,(dailySale)=>{
                  resolve(dailySale);
                },(error)=>{
                    if (!error.err_code){
                      DrugStoreService.displayErrorPage(error);
                      resolve(error);
                    }
                });
              });
             
            }
            
            }
        });
    }]);





