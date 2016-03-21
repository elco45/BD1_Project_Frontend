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
      		},
                  GetConfirmacionById: function(payload){
                        return $http.post(baseUrl + "v1/getConfirmacionById", payload);
                  },
                  GetEstudianteById: function(payload){
                        return $http.post(baseUrl + "v1/getEstudianteById", payload); 
                  },
                  AceptarConfirmacion:function(payload){
                        return $http.post(baseUrl + "v1/aceptarConfirmacion", payload);     
                  },
                  RechazarConfirmacion:function(payload){
                        return $http.post(baseUrl + "v1/rechazarConfirmacion", payload);     
                  },
                     Register_anuncio: function(payload){
                        return $http.post(baseUrl+"v1/crearAnuncios", payload);
                  },
                  GetAnuncio_id: function(payload){
                        
                        return $http.post(baseUrl + "v1/getAnuncios",payload);
                  },
                  
	    };
}]);
