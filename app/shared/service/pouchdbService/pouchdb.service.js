angular.module("pouchdb.service")
		.service('PouchdbService',["$rootScope", "$q","DailySaleManager" /*, "pouchDB","pouchDBDecorators"*/,function($rootScope, $q,DailySaleManager,pouchDB ,pouchDBDecorators){
			
		var database;
    	var changeListener;

    this.getDatabase=function(){
      return database;
    }
    this.setDatabase = function(databaseName) {
        database = new PouchDB(databaseName);
        this.configDatabase();

    }
    this.query=function(viewName,options){
      return database.query(viewName,options);
    }

   /* this.startListening = function() {
        changeListener = database.changes({
            live: true,
            include_docs: true
        }).on("change", function(change) {
            if(!change.deleted) {
                $rootScope.$broadcast("$pouchDB:change", change);
            } else {
                $rootScope.$broadcast("$pouchDB:delete", change);
            }
        });
    }*/

    this.stopListening = function() {
        changeListener.cancel();
    }

    this.sync = function(remoteDatabase) {

        this.find({
            selector:{
                _id:'582da2ee665b792864a1050d'
            }
        })
.then(function(res){
    console.log("localDatabase  using find method database");
    console.log(res);
}).catch(function(err){
    console.log(err);
});

       /* database.sync(remoteDatabase, {live: true, retry: true})
.on('change', function (info) {
  // handle change
  console.log("changmeent...");
}).on('complete', function (info) {
  // handle complete
    console.log("complete...");
}).on('error', function (err) {
  // handle error
  console.log("error ;....");
  console.log(err);
});
*/
//
/*var rep = database.replicate.from(remoteDatabase,'mydb', {
  live: true,
  retry: true
}).on('change', function (info) {
 console.log("changement occured...");
}).on('paused', function (err) {
  console.log(" paused occured...");
  // replication paused (e.g. replication up to date, user went offline)
}).on('active', function () {
  console.log(" active occured...");
  // replicate resumed (e.g. new changes replicating, user went back online)
}).on('denied', function (err) {
  console.log(" denied occured...");
  // a document failed to replicate (e.g. due to permissions)
}).on('complete', function (info) {
  console.log("complete occured...");
  // handle complete
}).on('error', function (err) {
  console.log(" error occured...");
  console.log(err);
  // handle error
});*/

/*var remoteDB=PouchDB(remoteDatabase);
remoteDB.get("582da2ee665b792864a1050d")
.then(function(res){
    console.log("remote database");
    console.log(res);
}).catch(function(err){
    console.log(err);
});

database.get("582da2ee665b792864a1050d")
.then(function(res){
    console.log("local database");
    console.log(res);
}).catch(function(err){
    console.log(err);
});*/

/*database.replicate.from(remoteDB)
.then(function (obj) {
  // yay, we're done!
  console.log("complete");
  console.log(obj);
}).catch(function (err) {
  // boo, something went wrong!
  console.log(err);
});*/

/*.$promise
  .then(null, null, function(progress) {
    console.log('replication status', progress);
  })
  .then(function(result) {
    console.log('replication resolved with', result);
  })
  .catch(function(reason) {
    console.error('replication failed with', reason);
  })
  .finally(function() {
    console.log('done');
  });
*/

};

    this.save = function(jsonDocument) {
        var deferred = $q.defer();
        if(!jsonDocument._id) {
            database.post(jsonDocument).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });
        } else {
            database.put(jsonDocument).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    this.delete = function(documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
    }

    this.get = function(documentId) {
        return database.get(documentId);
    }

    this.destroy = function() {
        database.destroy();
    }

    this.find=function(query){
    	return database.find(query);
    }
    this.createIndex=function(fieldArray){

        database.createIndex({
            index:{
                fields:fieldArray
            }
        }).then(function(result){

            console.log(result);
        }).catch(function(err){
            console.log(err);
        });
    }
    this.createView=function(designDocName,viewName,mapFunction,reduceFunction){
      var name=viewName;
      var ddoc = {
                  _id: '_design/'+designDocName,
                  views: {
                    'byDate':{
                      map: mapFunction.toString(),
                    }
                  }
                };

      if (reduceFunction){
        ddoc.views.viewName.reduce=reduceFunction.toString();
      }

      database.put(ddoc).catch(function(err){
         console.log(err);
        if (err.name !=='conflict'){
          throw err;
        }
  
      }).then(function(){
        console.log(viewName+"  has been created....");
      });          

    }

    this.allDocs=function(parameters){

      if (parameters){
        return database.allDocs(parameters);
      }
    }

    this.bulkDocs=function(objArray){

      return database.bulkDocs(objArray);
    }

    this.configDatabase=function(){

       //  database.find=pouchDBDecorators.qify(database.find);
    
   //  this.createIndex(['ttype']);
  //  this.createIndex(['ttype','date']);
   // this.createIndex(['ttype','date','validateEntreprise','validateActionnaire']);
     
    // this.createIndex(['username','password']);
     /*database.viewCleanup().then(function(result){
      console.log("cleaning up  view...");
      console.log(result);
     }).
     catch(function(err){
      console.log(err);
     });*/


    /* this.createView("dailySaleView","byDate",
            DailySaleManager.dailySaleByDateView
          );*/


    }

}]);