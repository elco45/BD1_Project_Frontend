angular.module('AngularScaffold.Controllers')
.controller('DocenteController', ['$scope','$state','DocenteService','$sessionStorage', function ($scope,$state, DocenteService,$sessionStorage) {

$scope.curso = {};
$scope.displayCursos = [];
$scope.AllCourse = [];
$scope.$sessionStorage = $sessionStorage;

	$scope.cambiar_div = function(nombre){
    if (nombre==="docente_inicio") {
      $scope.template = '/views/docente_inicio.html';
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
        console.log(response1.data)
      })//fin DocenteService.VisualizarCourse
  }

  $scope.crearCursos = function(){
    var param = {
      course: $scope.curso,
      idTeacher: $scope.$sessionStorage.currentUser.IdUser
    }
    DocenteService.CrearCurso(param).then(function(response){
        $scope.curso = response.data;
        DocenteService.UpdateTeacherCourse($scope.curso).then(function(response){
            $scope.clearCreateCurso();
        }).catch(function(err){
          alert('Error agregando curso')
        });
    }).catch(function(err){
      alert('Error agregando curso')
    });
  }

  $scope.clearCreateCurso = function(){
    $scope.curso.nombre = "";
    $scope.curso.trimestre = "";
    $scope.curso.year = "";
  }

  $('ul li').click( function() {
    $(this).addClass('active').siblings().removeClass('active');
  });

}]);