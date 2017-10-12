
//var drugStore=angular.module('drugStoreSoftware',['ui.router','ngAnimate','userAuth','core','drugStorecomponent','home','controller.template']);


angular.module('drugStoreSoftware')
.run((PouchdbService)=>{
  //PouchdbService.setDatabase("drugstoreLocal");
  //PouchdbService.sync("http://diallomo:Madiou91@localhost:5984/drugstore");
  PouchdbService.setDatabase("http://diallomo:Madiou91@localhost:5984/drugstore");
 // PouchdbService.sync("null");

})
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('pharmacie-Dixin', {
      url: '/pharmacie-Dixin',
      templateUrl: 'app/composants/user/view/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'UserAuthService', function($state, auth){
        if(auth.isLoggedIn()){
          console.log("user logged");
          $state.go('home',{"selectedMenu":MENU.PRODUIT});
        }
        else{
          console.log("authentification failed");
        }
      }]
    })
   
  .state('register', {
    url: '/register',
    templateUrl: 'app/composants/user/view/register.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'UserAuthService', function($state, auth){
      if(auth.isLoggedIn()){
        $state.go('home',{"selectedMenu":MENU.PRODUIT});
      }
    }]
  })
  .state('pharmacie-Dixin-error',{
    url:'/pharmacie-Dixin-error',
    params:{
      error:null
    },
    templateUrl:'app/composants/error/view/error.html',
    controller:'ErrorController'
  });

  $urlRouterProvider.otherwise('pharmacie-Dixin');
}]);
