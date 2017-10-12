angular.module("filter.currencyFilter")
		.filter('CurrencyFilter',['$filter',function($filter){
			 
			return function(input){
				return $filter('currency')(input,"",0)+" GNF";
			};
		}]);