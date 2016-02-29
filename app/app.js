var app = angular.module('AngularScaffold', ['ui.router', 'ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        })
        .state('estudiante', {
            url: '/estudiante',
            params: {content:undefined},
            templateUrl: '/views/estudiante.html',
            controller: 'EstudianteController'
        })
        .state('admin', {
            url: '/admin',
            params: {content:undefined},
            templateUrl: '/views/admin.html',
            controller: 'AdminController'
        })
        .state('docente', {
            url: '/docente',
            params: {content:undefined},
            templateUrl: '/views/docente.html',
            controller: 'DocenteController'
        });   
}])
