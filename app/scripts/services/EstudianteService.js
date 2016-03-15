angular.module('AngularScaffold.Services').factory('EstudianteService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'http://localhost:8000/';
		return {

				GetCursos: function(payload){
					return $http.post(baseUrl + "v1/getStudentCourse", payload);
				},
				VisualizarCourse: function(payload){
					return $http.post(baseUrl + "v1/SeeCourse", payload);
				},
				BuscarDocente: function(payload){
					return $http.post(baseUrl + "v1/docenteid", payload);
				}
		};
}]);
