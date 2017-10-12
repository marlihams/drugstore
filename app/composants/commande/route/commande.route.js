angular.module('drugStoreSoftware')
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
      .state('commande-details', {
          url: '/commande/details/:commandId',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("commande details state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
          views:{
            '':{
              templateUrl:"app/composants/commande/view/commandes.details.html",
              controller:'CommandeDetailsController',
            },
            'header@commande-details': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             },
          },
          
         resolve:{
          
            currentCommand:function($stateParams,CommandeService,DrugStoreService){

              return CommandeService.getCommandById($stateParams.commandId.trim(),
                  function(commande){
                      return commande;
                  },function(error){
                     DrugStoreService.displayErrorPage(error);
                   });

            }

        }
        })
        .state('commande-edit', {
          url: '/commande/edit/:commandId',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("commande edit state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
            views:{
            '':{
              templateUrl:"app/composants/commande/view/commandes.edit.html",
            controller:'CommandeEditController',
            },
            'header@commande-edit': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             },
          },
          resolve:{
          
            currentCommand:function($stateParams,CommandeService,DrugStoreService){

              return CommandeService.getCommandById($stateParams.commandId.trim(),(commande)=>{
                  return commande;
              },(error)=>{
                   DrugStoreService.displayErrorPage(error);
              });

            },
            produitList:function(ProduitService,DrugStoreService){
            
              return ProduitService.getAllProduit((data)=>{
                return data;
              },(error)=>{
                  if (!error.err_code){
                    DrugStoreService.displayErrorPage(error);
                  }
              });
             
            },
            clientList:function(){
              return null;
            }
          }
        })
        .state('commande-new', {
          url: '/commande/create',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("commande edit state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
            views:{
            '':{
              templateUrl:"app/composants/commande/view/commandes.new.html",
            controller:'CommandeNewController',
            },
            'header@commande-new': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             },
          },
          resolve:{
             produitList:function(ProduitService,DrugStoreService){
              
              return ProduitService.getAllProduit((data)=>{
                return data;
              },(error)=>{
                  if (!error.err_code){
                    DrugStoreService.displayErrorPage(error);
                  }
              });
             
            },
            clientList:function(){
              return null;
            }
          }
        });
    }]);





