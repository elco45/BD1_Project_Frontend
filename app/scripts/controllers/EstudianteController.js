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
	$scope.llenadoTarea=[];
	$scope.TareaSubido = [];
	$scope.selected = {value: 0};
	$scope.divSubir = false;
	$scope.solucionDisponible = {};
	$scope.llenadoNota = [];

	$scope.indice = {};
	$scope.tarea = {};
	$scope.usuario = {};

	if($state.params.content){
    $scope.indice = $state.params.content.indice;
    $scope.tarea = $state.params.content.tarea;
    $scope.usuario = $state.params.content.usuario;
  }

	$scope.goMain=function(){
	  $state.go('estudiante_main');
	}

	$scope.cambiar_div = function(nombre){
      if (nombre==="estudiante_inicio") {
        $scope.template = '/views/estudiante_inicio.html';
        $scope.$sessionStorage.CurrentCurso="0";
      }else if (nombre==="estudiante_anuncios") {
        $scope.template = '/views/estudiante_anuncios.html';
      }else if (nombre==="estudiante_calificacion"){
        $scope.template = '/views/estudiante_nota.html';
      }else if (nombre==="estudiante_participantes") {
        $scope.template = '/views/estudiante_participantes.html';
      }else if (nombre==="estudiante_secciones_presenciales") {
        $scope.template = '/views/estudiante_matricula.html';
      }else if (nombre==="estudiante_tareas") {
        $scope.template = '/views/estudiante_tareas.html';
      }else if (nombre==="estudiante_solucion") {
        $scope.template = '/views/estudiante_solucion.html';
      };
    }
	$scope.goMainSolucion = function(indice,tarea,usuario){
    	$state.go('solucion', {content:
	      {
	      	indice: indice,
	      	tarea:tarea,
	      	usuario:usuario
	      }
   		});
	}
	$scope.llenarNota = function(){
		var param = {
			cursoActual: $scope.$sessionStorage.CurrentCurso
		}
		EstudianteService.GetTareaDeCurso(param).then(function(response){
			for(var i = 0;i < response.data.tareas.length;i++){
				var param2 = {
					idTarea: response.data.tareas[i]
				}
				EstudianteService.GetSoluciones(param2).then(function(response1){
					for(var i=0;i<response1.data.solucion.length;i++){
						var param3 = {
							idSolucion: response1.data.solucion[i],
							idEstudiante: $scope.$sessionStorage.currentUser
						}
						EstudianteService.GetNotaEstudiante(param3).then(function(response2){
							$scope.llenadoNota.push(response2.data.nota);
						})//fin GetNotaEstudiante
					}//fin for 2
				})//fin GetSoluciones --> agarra va a entrar a cada tarea para agarrar sus soluciones
			}//fin for 1
		})//fin GetTareaDeCurso
	}//fin llenarNota

	$scope.divSubirSolucion = function(){
	 		$scope.divSubir = !$scope.divSubir;
	}//divSubirSolucion

	$scope.uploadAnswer = function(indice){
    	/*console.log($scope.$sessionStorage.currentUser)
    	console.log($scope.llenadoTarea[$scope.selected.value])*/
      var file = document.querySelector('input[type=file]').files[0];
	    var reader  = new FileReader();

	    reader.addEventListener("load", function () {
	      var param = {
	          archivo: reader.result,
	          nameArchivo: file.name,
	          tarea: $scope.tarea,
	          Id_estudiante: $scope.usuario
	        }
					if($scope.solucionDisponible){//modifica la solucion anterior
						var parametros = {
							busqueda:$scope.solucionDisponible._id,
							newData: param
						}
						EstudianteService.ModificaSolucion(parametros).then(function(response){

		        }).catch(function(err){
		          alert('Error agregando tarea')
		        });//fin EstudianteService.SubirTarea
					}else{//crea una nueva solucion
						EstudianteService.SubirTarea(param).then(function(response){
		          var param2 = {
		            answer:response.data,
		            cursoActual: $scope.usuario.CurrentCurso
		          }
		          EstudianteService.UpdateTareaSolucion(param2).then(function(response1){

		          })
		        }).catch(function(err){
		          alert('Error agregando solucion')
		        });//fin EstudianteService.SubirTarea
					}

	    }, false);

	    if (file) {
	      reader.readAsDataURL(file);
	    }
   	}//fin uploadAnswer


   	$scope.tieneSolucion = function(idTarea,idEstudiante){
			var param = {
				id_tarea: idTarea,
				Id_estudiante: idEstudiante
			}
			EstudianteService.VerificarSiTieneSolucion(param).then(function(response){
				$scope.solucionDisponible = response.data;
			})

   	}

		$scope.decode = function(file,fileName){
	    var byteString;
	    if (file.split(',')[0].indexOf('base64') >= 0){
	        byteString = atob(file.split(',')[1]);
	    }else{
	        byteString = unescape(file.split(',')[1]);
	    }
	    var mimeString = file.split(',')[0].split(':')[1].split(';')[0];

	    var element = document.createElement('a');
	    element.setAttribute('href', 'data:' + mimeString + ';base64,' + btoa(byteString));
	    element.setAttribute('download', fileName);
	    element.style.display = 'none';
	    document.body.appendChild(element);
	    element.click();
	    document.body.removeChild(element);
	  }//fin decode

   	$scope.llenarTarea = function(){
	    var param ={
	      id: $scope.$sessionStorage.CurrentCurso
	    }
	    EstudianteService.VisualizarCourse(param).then(function(response){
	      $scope.curso = response.data;
	      for(var i = 0; i < $scope.curso.tareas.length;i++){
	        var params = {
	          id:$scope.curso.tareas[i]
	        }
	        EstudianteService.GetTarea(params).then(function(response1){
	          $scope.llenadoTarea.push(response1.data)
	        });//fin GetTarea
	      }//fin for
	    });//fin Visualizar

	}//fin llenarTarea

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
	    $state.go('estudiante');
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
				 BootstrapDialog.alert({
	              title: 'ALERTA',
	              message: 'Su solicitud de matrícula aún no ha sido confirmada',
	              type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
	              closable: true, // <-- Default value is false
	              buttonLabel: 'Cerrar', // <-- Default value is 'OK',
	            });
			}else{
				EstudianteService.AddConfirmacion(param).then(function(response1){
					 BootstrapDialog.alert({
		              title: 'EXITO',
		              message: 'Su solicitud ha sido enviado exitosamente!',
		              type: BootstrapDialog.TYPE_SUCCESS, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
		              closable: true, // <-- Default value is false
		              buttonLabel: 'Cerrar', // <-- Default value is 'OK',
		            });
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
