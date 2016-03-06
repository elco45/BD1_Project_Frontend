angular.module('AngularScaffold.Controllers')
  .controller('UsersController', ['AuthService','UserService' , '$scope', '$state', '$rootScope', '$sessionStorage',
  	function (authService,UserService, $scope, $state, $rootScope, $sessionStorage) {
      $scope.user = {};
      $scope.$sessionStorage = $sessionStorage;
      $scope.title = "Login";
      $scope.presionado = true;
      $scope.docenteDivs =false;
      $scope.estudianteDivs = false;
      $scope.universidadDiv = false;
      $scope.signIn= {};
      $scope.docentes={};
      $scope.docente;

      $scope.logout = function(){
        authService.Logout().then(function(response){
          $sessionStorage.$reset();
          $state.go("login");
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        })
      }

      $scope.login = function(){
        authService.Login($scope.signIn).then(function(response){
          $sessionStorage.currentUser = response.data;
          console.log(response.data);
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

        return $scope.docenteDivs;
      }

      $scope.showUniversidad = function(){
        if($scope.universidadDiv === true)
          $scope.user.universidad_txt = "";
        $scope.universidadDiv = !$scope.universidadDiv;
      }

      $scope.pressUniversidad = function(){
        return $scope.universidadDiv;
      }

      $scope.pressEstudiante = function(){
        return $scope.estudianteDivs;
      }

      $scope.AddUniversidad = function(){

      }

      $scope.seleccionar=function(tipo){
        if (tipo==1) {//docente
          $scope.docenteDivs=true;
          $scope.estudianteDivs=false;
          UserService.GetDocentes().then(function(response){
            $scope.docentes=response.data;
          }).catch(function(err){
            alert('Error buscando docentes')
          });
        }else{//estudiante
          $scope.estudianteDivs=true;
          $scope.docenteDivs=false;
        }
        $scope.presionado=false;
      }
      $scope.retroceder = function(){
        $scope.user.id = "";
        $scope.user.nombre = "";
        $scope.user.apellido = "";
        $scope.user.especialidad = "";
        $scope.user.unversidad_txt = "";
        $scope.estudianteDivs=false;
        $scope.docenteDivs=false;
        $scope.presionado=!$scope.presionado;

      }
      $scope.register = function() {
        UserService.GetControl().then(function(response){
            console.log(response);//ultimo~~~~~~
            var params = {
              user : $scope.user,
              control_id : response.data
            }
            UserService.Register(params).then(function(response){
                console.log(response);
            }).catch(function(err){
              alert('Error agregando usuario')
            });

        }).catch(function(err){
          alert('Error agregando usuario')
        });
      }
      $scope.cancel_registration = function(){
        $state.go('login');
      }

      $scope.verifyOtros=function(mySelect){
        if (mySelect==="Otro") {
          $scope.universidadDiv=true;
        }else{
          console.log(mySelect)
        }
      }

  }]);
