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
	$scope.datoTarea = {};
	$scope.usuario = {};


	$scope.todoLosAnuncios=[];

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
        $scope.$sessionStorage.IdTarea = null;
      }else if (nombre==="estudiante_calificacion"){
        $scope.template = '/views/estudiante_nota.html';
        $scope.$sessionStorage.IdTarea = null;
      }else if (nombre==="estudiante_participantes") {
        $scope.template = '/views/estudiante_participantes.html';
        $scope.$sessionStorage.IdTarea = null;
      }else if (nombre==="estudiante_secciones_presenciales") {
        $scope.template = '/views/estudiante_matricula.html';
        $scope.$sessionStorage.IdTarea = null;
      }else if (nombre==="estudiante_tareas") {
        $scope.template = '/views/estudiante_tareas.html';
      }else if (nombre==="estudiante_solucion") {
        $scope.template = '/views/estudiante_solucion.html';
      }else if (nombre==="comentarios") {
			$scope.template = '/views/comentarios.html';
			$scope.$sessionStorage.IdTarea = null;
		};
    }
	
	$scope.llenarNota = function(){
		var param = {
			cursoActual: $scope.$sessionStorage.CurrentCurso
		}
		var tare;
		EstudianteService.GetTareaDeCurso(param).then(function(response){
			for (var i = 0; i < response.data.tareas.length; i++) {
				var param2 = {
					idTarea: response.data.tareas[i],
					Id_estudiante: $scope.$sessionStorage.currentUser.IdUser
				}
				tare=response.data.tareas[i];
				EstudianteService.GetNotaEstudiante(param2).then(function(response2){
					var parametro = {
						idTarea:response2.data.Id_tarea
					}
					EstudianteService.GetSoluciones(parametro).then(function(response3){
						var llenar={
							titulo:response3.data.titulo,
							nota:response2.data.nota
						}	
						
						$scope.llenadoNota.push(llenar)
					})
					
				})//fin GetNotaEstudiante
			}//fin for 2
		})
	}//fin llenarNota

	$scope.divSubirSolucion = function(){
	 	$scope.divSubir = !$scope.divSubir;
	}//divSubirSolucion

	$scope.uploadAnswer = function(indice){
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
					$scope.solucionDisponible.nombreArchivo = param.nameArchivo;
					$scope.solucionDisponible.respuesta = param.archivo;
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
						$scope.solucionDisponible.nombreArchivo = param.nameArchivo;
						$scope.solucionDisponible.respuesta = param.archivo;
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

   	$scope.goMainSolucion = function(indice,tarea,usuario){
		$scope.$sessionStorage.IdTarea = tarea
    	$state.go('solucion', {content:
	      {
	      	indice: indice,
	      	tarea:$scope.$sessionStorage.IdTarea,
	      	usuario:usuario
	      }
   		});
	}

   	$scope.tieneSolucion = function(){
		var param = {
			id_tarea: $scope.$sessionStorage.IdTarea._id,
			Id_estudiante: $scope.$sessionStorage.currentUser.IdUser
		}
		EstudianteService.VerificarSiTieneSolucion(param).then(function(response){
			$scope.datoTarea = $scope.$sessionStorage.IdTarea;
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
	    element.setAttribute('download', fileName);
	    element.setAttribute('href', 'data:' + mimeString + ';base64,' + btoa(byteString));
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
			for (var j = 0; j < cursos.length; j++) {
				$scope.courses.push(cursos[j]);
				var paramsDocente = {
					idDocente : cursos[j].Id_docente
				}
				EstudianteService.BuscarDocente(paramsDocente).then(function(response3){
					$scope.docentes.push(response3.data);
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



	$scope.get_Anuncio_by_id = function(){
	    var parametros = {
	        Id_curso: $scope.$sessionStorage.CurrentCurso
	    }
	    EstudianteService.GetAnuncio_id_Estudiante(parametros).then(function(response){
	        $scope.todoLosAnuncios= response.data
	    });
    }


    $('ul li').click( function() {
      $(this).addClass('active').siblings().removeClass('active');
    });
}]);
