angular.module('drugStoreSoftware')
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/home/:selectedMenu',
           onEnter: ['$state', 'UserAuthService', function($state, auth){
             console.log("home state");
              if(!auth.isLoggedIn()){
                console.log("connexion expired");
                 $state.go("pharmacie-Dixin");
              }

             }],
          views: {
            '': {
             templateUrl: 'app/composants/home/view/home.html',
             controller:'HomeCtrl'
              },
            'header@home': { 
              templateUrl: 'app/composants/header/view/header.html',
              controller:'HeaderController'
             },
             'menu@home':{
              templateUrl :'app/composants/home/menu/menu.html',
              controller:'MenuController'
             },
             'clients@home':{
               templateUrl:'app/composants/home/menu/client/menuClients.html',
                controller:'MenuClient'
             },
             'produits@home':{
               templateUrl:'app/composants/home/menu/produit/menuProduits.html',
                controller:'MenuProduit'
             },
             'dailySales@home':{
               templateUrl:'app/composants/home/menu/dailySale/menuDailySales.html',
                controller:'MenuDailySale'
             },
             'commandes@home':{
               templateUrl:'app/composants/home/menu/commande/menuCommandes.html',
                controller:'MenuCommande'
             }/*,
             'depenses@home':{
               templateUrl:'views/templates/menuDepenses.html',
                controller:'MenuDepense'
             }*/

         },
         resolve:{
           commonData:function(DrugStoreService,$state){
                   
                   return  new Promise((resolve,reject)=>{

                    DrugStoreService.getHomeData((obj)=>{
                        resolve(obj);
                      },(error)=>{
                          if (!error.err_code){
                            DrugStoreService.displayErrorPage(error);
                            resolve(error);
                          }
                      });
                  });
                   
                },
            produitList:function(ProduitService,DrugStoreService){
              // var test=$q.defer();

              return ProduitService.getAll((data)=>{
                return data;
              },(error)=>{
                  if (!error.err_code){
                    DrugStoreService.displayErrorPage(error);
                  }
              });
             
            },
            currentDailySale:function(DailySaleService){
              return new Promise((resolve,reject)=>{

                 DailySaleService.getCurrentDailySale((dailySales)=>{
                  resolve(dailySales);
                },(error)=>{
                    if (!error.err_code){
                      DrugStoreService.displayErrorPage(error);
                      resolve(error);
                    }
                });
              });
             
            },
            nonValidateDepenseMsg:function(DepenseService,UtilityManager ,DrugStoreService ,DepenseManager ,UserAuthService){

                var month=UtilityManager.getCurrentMonthInterval();

                  return DepenseService.filterDepenseByDate(month.beginMonth,month.endMonth,(depenses)=>{
                      return DepenseManager.buildMessageDepenseInfo(depenses,
                              UserAuthService.currentUser());
                  

                  },(error)=>{
                    DrugStoreService.displayErrorPage(error);
                  });
                
          }

        }
      });
  }]);





