angular.module('AngularScaffold.Controllers')
.controller('EstudianteController', ['$scope','$state','EstudianteService', function ($scope,$state, EstudianteService) {

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

    $('ul li').click( function() {
      $(this).addClass('active').siblings().removeClass('active');
    });
}]);