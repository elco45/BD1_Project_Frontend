angular.module('AngularScaffold.Controllers')
.controller('DocenteController', ['$scope','$state','DocenteService','$sessionStorage', function ($scope,$state, DocenteService,$sessionStorage) {

$scope.curso = {};
$scope.displayCursos = [];
$scope.AllCourse = [];
$scope.$sessionStorage = $sessionStorage;
$scope.NameDocente = {};
$scope.entroCurso=false;
$scope.AllConfirmacion=[];
$scope.AllEstudiantes=[];
$scope.tarea = {};
$scope.llenadoTarea = [];

  $scope.goMain=function(){
    $state.go('docente_main');
  }

	$scope.cambiar_div = function(nombre){
    if (nombre==="docente_inicio") {
      $scope.template = '/views/docente_inicio.html';
      $scope.$sessionStorage.CurrentCurso="0";
    }else if (nombre==="docente_confirmacion"){
      $scope.template = '/views/docente_confirmacion.html';
    }else if (nombre==="docente_participantes") {
      $scope.template = '/views/docente_participantes.html';
    }else if (nombre==="docente_tareas") {
      $scope.template = '/views/docente_tareas.html';
    }else if (nombre==="docente_anuncios") {
      $scope.template = '/views/docente_anuncios.html';
    }else if (nombre==="docente_notas") {
      $scope.template = '/views/docente_notas.html';
    };
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


  $scope.crearTarea = function(){
    var file = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      var param = {
          archivo: reader.result,
          nameArchivo: file.name,
          tarea: $scope.tarea
        }
        DocenteService.PostTarea(param).then(function(response){
          var param2 = {
            idTarea: response.data._id,
            cursoActual: $scope.$sessionStorage.CurrentCurso
          }
          DocenteService.TareaEnCurso(param2).then(function(response1){

          })
        }).catch(function(err){
          alert('Error agregando tarea')
        });//fin DocenteService.PostTarea
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }


  }//fin $scope.crearTarea

  $scope.llenarTarea = function(){
    var param ={
      id: $scope.$sessionStorage.CurrentCurso
    }
    DocenteService.VisualizarCourse(param).then(function(response){
      $scope.curso = response.data;
      for(var i = 0; i < $scope.curso.tareas.length;i++){
        var params = {
          id:$scope.curso.tareas[i]
        }
        DocenteService.GetTarea(params).then(function(response1){
          $scope.llenadoTarea.push(response1.data)
        });//fin GetTarea
      }//fin for
    });//fin Visualizar

  }//fin llenarTarea
  
  $scope.visualizarCursos =  function(){
    var param ={
      id: $scope.$sessionStorage.currentUser.IdUser
    }
    DocenteService.GetCursos(param).then(function(response){
      $scope.displayCursos = response.data.cursos;
      for(var i=0;i<$scope.displayCursos.length;i++){
        $scope.WatchCourse($scope.displayCursos[i]);
      }
    })//fin DocenteService.GetCursos
  }//fin $scope

  $scope.WatchCourse = function(param){
    var params = {
      id : param
    }
    DocenteService.VisualizarCourse(params).then(function(response1){
        var today = new Date();
        if (response1.data.year==today.getFullYear() && response1.data.trimestre==Math.floor((today.getMonth()/3)+1)) {
  				$scope.AllCourse.push( response1.data)
  				var paramsDocente = {
  					idDocente : response1.data.docente
  				}
  				DocenteService.BuscarDocente(paramsDocente).then(function(response2){
  						$scope.NameDocente = response2.data.nombre

  				})//fin DocenteService.BuscarDocente
        }
    })//fin DocenteService.VisualizarCourse
  }

  $scope.actualDate=function(){
    var today = new Date();
    $scope.curso.trimestre = Math.floor((today.getMonth()/3)+1); //January is 0!
    $scope.curso.year = today.getFullYear();
  }

  $scope.crearCursos = function(){
    var param = {
      course: $scope.curso,
      idTeacher: $scope.$sessionStorage.currentUser.IdUser
    }
    DocenteService.CrearCurso(param).then(function(response){
      $scope.clearCreateCurso();
      $state.reload();
    }).catch(function(err){
      alert('Error agregando curso')
    });
  }

  $scope.clearCreateCurso = function(){
    $scope.curso.nombre = "";
    $scope.curso.trimestre = "";
    $scope.curso.year = "";
  }

  $scope.selectCurso=function(curso,nombre_docente){
    $scope.$sessionStorage.CurrentCurso=curso._id;
    $state.go('docente');
  }

  $scope.getAllConfirmacion=function(){
    $scope.AllConfirmacion=[];
    var param={
      Id_curso:$scope.$sessionStorage.CurrentCurso
    }
    DocenteService.GetConfirmacionById(param).then(function(response){
      var confirmaciones=response.data.confirmacion_alum;
      for (var i = 0; i < confirmaciones.length; i++) {
        var paramEst={
          Id_estudiante:confirmaciones[i]
        }
        DocenteService.GetEstudianteById(paramEst).then(function(response1){
          $scope.AllConfirmacion.push(response1.data);
        })
      }
    })
  }

  $scope.confirmar=function(idEstudiante,index){
    var param={
      Id_estudiante:idEstudiante,
      Id_curso:$scope.$sessionStorage.CurrentCurso
    }
    DocenteService.AceptarConfirmacion(param).then(function(response){
      $scope.AllConfirmacion.splice(index,1)
    })
  }

  $scope.rechazar=function(idEstudiante,index){
    var param={
      Id_estudiante:idEstudiante,
      Id_curso:$scope.$sessionStorage.CurrentCurso
    }
    DocenteService.RechazarConfirmacion(param).then(function(response){
      $scope.AllConfirmacion.splice(index,1)
    })
  }

  $scope.visualizarEstudiantes=function(){
    var param={
      id:$scope.$sessionStorage.CurrentCurso
    }
    DocenteService.VisualizarCourse(param).then(function(response){
      var cursoo=response.data;
      for (var i = 0; i < cursoo.estudiantes.length; i++) {
        var paramEst={
          Id_estudiante:cursoo.estudiantes[i]
        }
        DocenteService.GetEstudianteById(paramEst).then(function(response1){
          $scope.AllEstudiantes.push(response1.data);
        })
      }
    })
  }

  $('ul li').click( function() {
    $(this).addClass('active').siblings().removeClass('active');
  });

}]);
