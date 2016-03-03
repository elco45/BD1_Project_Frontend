angular.module('AngularScaffold.Services').factory('DocenteService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'http://localhost:8000/';
		return {
			CrearCurso: function(payload){
				console.log(payload)
	          return $http.post(baseUrl + "v1/createCourse", payload);
      		}
	    };
}]);
