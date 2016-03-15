angular.module('AngularScaffold.Controllers')
.controller('EstudianteController', ['$scope','$state','EstudianteService','$sessionStorage', function ($scope,$state, EstudianteService,$sessionStorage) {
	$scope.displayCursos = [];
	$scope.AllCourse = [];
	$scope.AllCourseDocente = [];
	$scope.AllCourseData = [];
	$scope.$sessionStorage = $sessionStorage;
	$scope.$sessionStorage.CurrentCurso="0";
	$scope.NameDocente = {};
	$scope.check = false;

	$scope.cambiar_div = function(nombre){
      if (nombre==="estudiante_inicio") {
        $scope.template = '/views/estudiante_inicio.html';
        
      }else if (nombre==="estudiante_anuncios") {
        $scope.template = '/views/estudiante_anuncios.html';
      }else if (nombre==="estudiante_calificacion"){
        $scope.template = '/views/estudiante_calificacion.html';
      }else if (nombre==="estudiante_participantes") {
        $scope.template = '/views/estudiante_participantes.html';
      }else if (nombre==="estudiante_secciones_presenciales") {
        $scope.template = '/views/estudiante_secciones_presenciales.html';
      }else if (nombre==="estudiante_tareas") {
        $scope.template = '/views/estudiante_tareas.html';
      };
    }

	$scope.visualizarCursos =  function(){
		var param ={
			id: $scope.$sessionStorage.currentUser.IdUser
		}
		EstudianteService.GetCursos(param).then(function(response){
			$scope.displayCursos = response.data.cursos;
			for(var i=0;i<$scope.displayCursos.length;i++){
				$scope.WatchCourse($scope.displayCursos[i]);
			}
		})//fin DocenteService.GetCursos

	}//fin $scope

	$scope.repeat = function(){
		if ($scope.AllCourseData.length <0)
			return false
		else
			return true
	}
	$scope.WatchCourse = function(param){
		var params = {
			id : param
		}
		EstudianteService.VisualizarCourse(params).then(function(response1){
			$scope.AllCourse.push(response1.data)
			var paramsDocente = {
				idDocente : response1.data.docente
			}
			EstudianteService.BuscarDocente(paramsDocente).then(function(response2){
					$scope.AllCourseDocente.push(response2.data)
					var dataCurso={
						course:response1.data,
						docente:response2.data
					}
					$scope.AllCourseData.push(dataCurso)
			})//fin DocenteService.BuscarDocente*/
				
		})//fin DocenteService.VisualizarCourse

	}

	$scope.selectCurso=function(curso,docente){
	    $scope.$sessionStorage.CurrentCurso=curso._id;

	  }

	
    $('ul li').click( function() {
      $(this).addClass('active').siblings().removeClass('active');
    });
}]);
