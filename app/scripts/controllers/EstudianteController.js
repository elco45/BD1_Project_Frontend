angular.module('AngularScaffold.Controllers')
.controller('EstudianteController', ['$scope','$state','EstudianteService','UserService','$sessionStorage', function ($scope,$state, EstudianteService,UserService,$sessionStorage) {
	$scope.displayCursos = [];
	$scope.AllCourse = [];
	$scope.AllCourseDocente = [];
	$scope.AllCourseData = [];
	$scope.$sessionStorage = $sessionStorage;
	$scope.NameDocente = {};
	$scope.check = false;
	$scope.CursosByU=[];
	$scope.courses=[];
	$scope.docentes=[];
	$scope.AllEstudiantes=[];

	$scope.cambiar_div = function(nombre){
      if (nombre==="estudiante_inicio") {
        $scope.template = '/views/estudiante_inicio.html';
        $scope.$sessionStorage.CurrentCurso="0";
      }else if (nombre==="estudiante_anuncios") {
        $scope.template = '/views/estudiante_anuncios.html';
      }else if (nombre==="estudiante_calificacion"){
        $scope.template = '/views/estudiante_calificacion.html';
      }else if (nombre==="estudiante_participantes") {
        $scope.template = '/views/estudiante_participantes.html';
      }else if (nombre==="estudiante_secciones_presenciales") {
        $scope.template = '/views/estudiante_matricula.html';
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
			var today = new Date();
			if (response1.data.year==today.getFullYear() && response1.data.trimestre==Math.floor((today.getMonth()/3)+1)) {
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
			}	
		})//fin DocenteService.VisualizarCourse

	}

	$scope.selectCurso=function(curso,docente){
	    $scope.$sessionStorage.CurrentCurso=curso._id;
	}


	$scope.getCursosByUniversidad=function(){
		var param ={
			Id_universidad: $scope.$sessionStorage.currentUser.Id_universidad
		}
		EstudianteService.GetDocenteByUniversidad(param).then(function(response1){
			var docentesConU=response1.data;
			for (var i = 0; i < docentesConU.length; i++) {
				for (var j = 0; j < docentesConU[i].cursos.length; j++) {
					var param ={
						id: response1.data[i].cursos[j]
					}
					EstudianteService.VisualizarCourse(param).then(function(response){
						var paramsDocente = {
							idDocente : response.data.docente
						}
						EstudianteService.BuscarDocente(paramsDocente).then(function(response2){
							var dataCurso={
								course:response.data,
								docente:response2.data
							}
							
							var params ={
								id: $scope.$sessionStorage.currentUser.IdUser
							}
							EstudianteService.GetCursos(params).then(function(response3){
								var existe=false;
								$scope.displayCursos = response3.data.cursos;
								for(var i=0;i<$scope.displayCursos.length;i++){
									if ($scope.displayCursos[i]==dataCurso.course._id) {
										existe=true;
									}
								}
								var today = new Date();
								if (!existe && dataCurso.course.year==today.getFullYear() && dataCurso.course.trimestre==Math.floor((today.getMonth()/3)+1)) {
									$scope.CursosByU.push(dataCurso);	
								}
							})
							
						})
					})

				}
			}
		})
	}

	$scope.buscarCursos=function(idDocente){
		EstudianteService.GetCourseByIdDocente(idDocente).then(function(response2){
			var cursos=response2.data;
			console.log(response2.data)
			for (var j = 0; j < cursos.length; j++) {
				$scope.courses.push(cursos[j]);
				var paramsDocente = {
					idDocente : cursos[j].Id_docente
				}
				EstudianteService.BuscarDocente(paramsDocente).then(function(response3){
					console.log(response3.data)
					$scope.docentes.push(response3.data);
					console.log(response3.data)
				})
			}
		})
	}

	$scope.matricular=function(idCurso){
		var param={
			Id_Curso:idCurso,
			Id_estudiante:$scope.$sessionStorage.currentUser.IdUser
		}
		var existe=false;
		EstudianteService.EstaEnCurso(param).then(function(response){
			existe= response.data.esta;
			if (existe) {
				alert("Su solicitud de matrícula aún no ha sido confirmada");
			}else{
				EstudianteService.AddConfirmacion(param).then(function(response1){
					alert("Su solicitud se ha enviado exitosamente");
				})
			}
		})
	}

	$scope.visualizarEstudiantes=function(){
	    var param={
	      id:$scope.$sessionStorage.CurrentCurso
	    }
	    EstudianteService.VisualizarCourse(param).then(function(response){
	      var cursoo=response.data;
	      for (var i = 0; i < cursoo.estudiantes.length; i++) {
	        var paramEst={
	          Id_estudiante:cursoo.estudiantes[i]
	        }
	        EstudianteService.GetEstudianteById(paramEst).then(function(response1){
	          $scope.AllEstudiantes.push(response1.data);
	        })
	      }
	    })
	  }

	
    $('ul li').click( function() {
      $(this).addClass('active').siblings().removeClass('active');
    });
}]);
