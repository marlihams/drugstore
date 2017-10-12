angular.module("filter.statusFilter")
		.filter('StatusFilter',[function($resource){
			
			return function(input){

				return input ? '\u2713' : '\u2718';
			};

		}]);