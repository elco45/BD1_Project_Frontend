angular.module('AngularScaffold.Services').factory('DocenteService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'http://localhost:8000/';
		return {
					CrearCurso: function(payload){
	         	return $http.post(baseUrl + "v1/createCourse", payload);
      		},
      		UpdateTeacherCourse: function(payload){
      			return $http.post(baseUrl + "v1/updateTeacher", payload);
      		},
      		GetCursos: function(payload){
      			return $http.post(baseUrl + "v1/getTeacherCourse", payload);
      		},
      		VisualizarCourse: function(payload){
      			return $http.post(baseUrl + "v1/SeeCourse", payload);
      		},
					BuscarDocente: function(payload){
      			return $http.post(baseUrl + "v1/docenteid", payload);
      		}
	    };
}]);
