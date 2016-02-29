angular.module('AngularScaffold.Controllers')
.controller('DocenteController', ['$scope','$state','DocenteService', function ($scope,$state, DocenteService) {

	$scope.cambiar_div = function(nombre){
      if (nombre==="docente_inicio") {
        $scope.template = '/views/docente_inicio.html';
      }else if (nombre==="docente_crear_cursos") {
        $scope.template = '/views/docente_crear_cursos.html';
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
}]);