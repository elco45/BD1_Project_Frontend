angular.module('AngularScaffold.Controllers')
.controller('DocenteController', ['$scope','$state','DocenteService','$sessionStorage', function ($scope,$state, DocenteService,$sessionStorage) {

$scope.curso = {};
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

  $scope.crearCursos = function(){
    console.log($scope.$sessionStorage)
    var param = {
      course: $scope.curso,
      idTeacher: $scope.$sessionStorage.currentUser.IdUser
    }
    console.log(param)
    DocenteService.CrearCurso(param).then(function(response){
        console.log(response);
        $scope.clearCreateCurso();
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