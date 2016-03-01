angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
      $scope.user = {};
      $scope.$sessionStorage = $sessionStorage;
      $scope.title = "Login"
      $scope.presionado = true;
      $scope.docente =false;
      $scope.estudiante = false;
      $scope.universidad = false;

      $scope.logout = function(){
        authService.Logout().then(function(response){
          $sessionStorage.$reset();
          $state.go("login");
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        })
      }

      $scope.login = function(user){
        authService.Login(user).then(function(response){
          $sessionStorage.currentUser = response.data;
          $scope.user = {};
          if ($sessionStorage.currentUser.scope[0]==="admin") {
            $state.go('admin');
          }else if($sessionStorage.currentUser.scope[0]==="vendedor"){
            $state.go('vendedor');
          }
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        });
      }

      $scope.signUp =function(){
        console.log('adasdas')
        $state.go("signUp")
      }

      $scope.selectButton = function(){
        return $scope.presionado;
      }

      $scope.pressDocente = function(){

        return $scope.docente;
      }

      $scope.showUniversidad = function(){
        if($scope.universidad === true)
          $scope.user.universidad_txt = "";
        $scope.universidad = !$scope.universidad;
      }

      $scope.pressUniversidad = function(){

        return $scope.universidad;
      }

      $scope.pressEstudiante = function(){
        return $scope.estudiante;
      }

      $scope.AddUniversidad = function(){

      }

      $scope.seleccionar=function(tipo){
        if (tipo==1) {
          $scope.docente=true;
          $scope.estudiante=false;
        }else{
          $scope.estudiante=true;
          $scope.docente=false;
        }
        $scope.presionado=false;
      }
      $scope.retroceder = function(){
        $scope.user.id = "";
        $scope.user.nombre = "";
        $scope.user.apellido = "";
        $scope.user.especialidad = "";
        $scope.user.unversidad_txt = "";
        $scope.estudiante=false;
        $scope.docente=false;
        $scope.presionado=!$scope.presionado;

      }
      $scope.register = function() {
        UserService.Register($scope.user).then(function(response){
            
        }).catch(function(err){
          alert('Error agregando usuario')
        });
      }
      $scope.cancel_registration = function(){
        $state.go('login');
      }
  }]);
