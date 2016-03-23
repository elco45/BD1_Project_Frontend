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
			},
			GetDocenteByUniversidad:function(payload){
				return $http.post(baseUrl + "v1/getDocenteByUniversidad", payload);
			},
			GetCourseByIdDocente:function(payload){
				return $http.post(baseUrl + "v1/getCourseByIdDocente", payload);
			},
			EstaEnCurso:function(payload){
				return $http.post(baseUrl + "v1/estaEnCurso", payload);
			},
			AddConfirmacion:function(payload){
				return $http.post(baseUrl + "v1/addConfirmacion", payload);
			},
			GetEstudianteById:function(payload){
				return $http.post(baseUrl + "v1/getEstudianteById", payload);
			},
			SubirTarea:function(payload){
				return $http.post(baseUrl + "v1/uploadTarea", payload);
			},
			GetTarea: function(payload){
          return $http.post(baseUrl + "v1/getTarea",payload);
    	},
			UpdateTareaSolucion: function(payload){
          return $http.post(baseUrl + "v1/updateTarea",payload);
    	},
			VerificarSiTieneSolucion: function(payload){
          return $http.post(baseUrl + "v1/verifySolution",payload);
    	},
			ModificaSolucion:function(payload){
          return $http.post(baseUrl + "v1/modificaSolution",payload);
    	},
			GetTareaDeCurso: function(payload){
          return $http.post(baseUrl + "v1/gettareadecurso",payload);
    	},
			GetSoluciones: function(payload){
          return $http.post(baseUrl + "v1/getsolucionesdetarea",payload);
    	},
			GetNotaEstudiante: function(payload){
          return $http.post(baseUrl + "v1/getnotasolucion",payload);
    	},
    	GetAnuncio_id_Estudiante: function(payload){
			   return $http.post(baseUrl + "v1/getAnuncios_Estudiantes",payload);
          }
		};
}]);
