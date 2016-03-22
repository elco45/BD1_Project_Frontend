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
      $scope.registroCorrecto=false;
      $scope.signUpCorrecto=false;
      $scope.mySelect;
      $scope.universidades=[];
      $scope.universidad={};

      $scope.getUniversidades = function(){
        UserService.GetUniversidades().then(function(response){
          $scope.universidades=response.data;
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        })
      }

      $scope.logout = function(){
        authService.Logout().then(function(response){
          $sessionStorage.$reset();
          $state.go("login");
        }).catch(function(err){
          BootstrapDialog.alert({
              title: 'ERROR',
              message: 'Sesión expirado, vuelva a conectarse',
              type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
              closable: true, // <-- Default value is false
              buttonLabel: 'Cerrar', // <-- Default value is 'OK',
          });
        })
      }

      $scope.login = function(){
        if ($scope.signIn.email || $scope.signIn.password) {
          authService.Login($scope.signIn).then(function(response){
            if (response.data=='error') {
              BootstrapDialog.alert({
                title: 'ERROR',
                message: 'El usuario o contraseña que usted ingreso es incorrecto!',
                type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                closable: true, // <-- Default value is false
                buttonLabel: 'Cerrar', // <-- Default value is 'OK',
              });
            }else{
              $sessionStorage.currentUser = response.data;
              if($sessionStorage.currentUser.IdUser <= 99999 && $sessionStorage.currentUser.IdUser >= 10000){
                $state.go('docente_main');
              }else if($sessionStorage.currentUser.IdUser >= 10000000){
                $state.go('estudiante_main');
              }
            }
          })
        }else{
          BootstrapDialog.alert({
            title: 'ERROR',
            message: 'Porfavor ingrese un usuario y contraseña valido.',
            type: BootstrapDialog.TYPE_DANGER, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            buttonLabel: 'Cerrar', // <-- Default value is 'OK',
          });
        }
      }

      $scope.signUp =function(){
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

      $scope.seleccionar=function(tipo){
        if (tipo==1) {//docente
          $scope.docenteDivs=true;
          $scope.estudianteDivs=false;
          $scope.getUniversidades();
        }else{//estudiante
          $scope.estudianteDivs=true;
          $scope.docenteDivs=false;
          $scope.getUniversidades();
        }
        $scope.presionado=false;
      }
      $scope.retroceder = function(){
        $scope.user.id = "";
        $scope.user.nombre = "";
        $scope.user.apellido = "";
        $scope.user.email="";
        $scope.user.password="";
        $scope.user.especialidad = "";
        $scope.user.unversidad_txt = "";
        $scope.estudianteDivs=false;
        $scope.docenteDivs=false;
        $scope.registroCorrecto=false;
        $scope.presionado=!$scope.presionado;

      }
      $scope.register = function() {
        if ($scope.user.nombre==undefined) {
          $scope.registroCorrecto=true;
        }
        if($scope.user.apellido==undefined){
          $scope.registroCorrecto=true;
        }
        if($scope.user.email==undefined){
          $scope.registroCorrecto=true;
        }
        if($scope.user.password==undefined){
          $scope.registroCorrecto=true;
        }
        if($scope.user.universidad_cb==undefined){
          $scope.registroCorrecto=true;
        }
        if($scope.registroCorrecto==false){
          UserService.GetControl().then(function(response){
            var paramU={
              control_id:response.data,
              nombre:$scope.user.universidad_txt,
              user:$scope.user
            }

            if ($scope.user.universidad_txt!=undefined) {
              UserService.CreateUniversity(paramU).then(function(response1){

              }).catch(function(err){
                $scope.registroCorrecto=true;

              });

              UserService.Register(paramU).then(function(response2){
                $scope.registroCorrecto=false;
                $scope.user.id = "";
                $scope.user.nombre = "";
                $scope.user.apellido = "";
                $scope.user.email="";
                $scope.user.password="";
                $scope.user.especialidad = "";
                $scope.user.unversidad_txt = "";
                $scope.estudianteDivs=false;
                $scope.docenteDivs=false;
                $scope.registroCorrecto=false;
                $scope.signUpCorrecto=true;
              }).catch(function(err){
                $scope.registroCorrecto=true;

              });

              $state.go("login")
            }else{
              $scope.universidad.Nombre=$scope.user.universidad_cb;
              UserService.GetUniversidadByName($scope.universidad).then(function(response3){
                $scope.universidad=response3.data;
                $scope.registroCorrecto=false;
                var paramU2={
                  control_id:response.data,
                  universidad:$scope.universidad,
                  user:$scope.user
                }
                UserService.RegisterWithU(paramU2).then(function(response4){
                  $scope.registroCorrecto=false;
                  $scope.user.id = "";
                  $scope.user.nombre = "";
                  $scope.user.apellido = "";
                  $scope.user.email="";
                  $scope.user.password="";
                  $scope.user.especialidad = "";
                  $scope.user.unversidad_txt = "";
                  $scope.estudianteDivs=false;
                  $scope.docenteDivs=false;
                  $scope.registroCorrecto=false;
                  $scope.signUpCorrecto=true;
                }).catch(function(err){
                  $scope.registroCorrecto=true;

                });
              }).catch(function(err){
                $scope.registroCorrecto=true;

              });
            }

            $state.go("login")
          }).catch(function(err){
            $scope.registroCorrecto=true;
            alert('Error agregando usuario')
          });
        }
      }
      $scope.cancel_registration = function(){
        $state.go('login');
      }

      $scope.verifyOtros=function(mySelect){
        if (mySelect==="Otro") {
          $scope.universidadDiv=true;
        }else{
          $scope.universidadDiv=false;
          $scope.user.universidad_cb=mySelect;
        }
      }

      $scope.verifyRegistro=function(){
        return $scope.registroCorrecto;
      }

      $scope.verifySignUp=function(){
        return $scope.signUpCorrecto;
      }

  }]);
