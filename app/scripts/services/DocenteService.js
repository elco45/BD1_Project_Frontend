angular.module('AngularScaffold.Services').factory('DocenteService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		return {
			
	    };
}]);
