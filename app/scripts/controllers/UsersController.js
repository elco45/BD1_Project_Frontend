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
    	$scope.tree = [{id:-1, text: "",showReply: false, nodes: []}];
      
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
          alert(err.data.error + " " + err.data.message);
        })
      }

      $scope.login = function(){
        authService.Login($scope.signIn).then(function(response){
          $sessionStorage.currentUser = response.data;
          if($sessionStorage.currentUser.IdUser <= 99999 && $sessionStorage.currentUser.IdUser >= 10000){
            $state.go("docente");
          }else if($sessionStorage.currentUser.IdUser >= 10000000){
            $state.go("estudiante");
          }
        }).catch(function(err){
          alert(err.data.error + " " + err.data.message);
        });
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
                UserService.RegisterWithU(paramU2).then(function(response4){1
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


      //Inicio comentarios
        $scope.addFirstComment = function() {
            var post = 1;
            var txt =	document.getElementById("first_txtcomment").value;
            $scope.tree[0].nodes.push({id:-55,text: txt,nodes: []});
            UserService.GetControl().then(function(response1){
                var params = {
                   Id_comentario: response1.data.Id_comentario,
                   text: txt,
                   nodes: [],
                   scope: $scope.$sessionStorage
                }
                UserService.AddFirstParentComment(params).then(function(response2){
                    for (var i = 0; i < $scope.tree[0].nodes.length; i++) {
                      if($scope.tree[0].nodes[i].id === -55){
                          $scope.tree[0].nodes[i].id = response2.data.id
                          break;
                      }
                    }

                    console.log($scope.tree)
                });
            })

        };
        $scope.addComment = function(data) {
            var post = data.nodes.length + 1;
            var txt =	document.getElementById("txtcomment").value;
            data.showReply = false;
             // -55 será el id temporal para identificar el nodo que acaba de ser insertado.

            UserService.GetControl().then(function(response1){

              data.nodes.push({id: response1.data.Id_comentario,text: txt,nodes: []});
              //console.log(params)
              /*
             $scope.tree = $scope.agregarId(response1.data.Id_comentario, $scope.tree)*/
             console.log($scope.tree)
             var params = {
                Id_parentComment: data.id,
                Id_comentario: response1.data.Id_comentario,
                text: txt,
                nodes: [],
                scope: $scope.$sessionStorage
             }
             console.log(params)

              UserService.AddComment(params).then(function(response2){
                  console.log(response2)
              });
            })
        };

        $scope.agregarId = function(id, arreglo){
          for (var i = 0; i < arreglo.length; i++) {
            if(arreglo[i].id = -55){
                arreglo[i].id = id
                return arreglo
              }
            else
              if(arreglo[i].nodes.lenght >0 ){
                arreglo[i].nodes =  $scope.agregarId(id, arreglo[i].nodes)
              }
          }
          return arreglo
        }
        $scope.isFirst = function(data){
          return $scope.tree.indexOf(data)
        }
        $scope.enableReply = function(data){
           data.showReply = true;
        }
        $scope.showReply = function(){
          return $scope.reply
        }
        $scope.getCourseComments = function(){
          console.log($scope.$sessionStorage.CurrentCurso)
          UserService.getCourseComments({Id_curso: $scope.$sessionStorage.CurrentCurso}).then(function(response){
              var commentArray = response.data;
              var cont = 0;
              for (var i = 0; i < commentArray.length; i++) {
                if(commentArray[i].Id_comentario_padre === -1){
                    $scope.tree[0].nodes.push({id:commentArray[i].Id_comentario,text: commentArray[i].descripción,nodes: []})	//SE AÑADEN LOS NODOS PADRES
                    $scope.tree[0].nodes[cont].nodes=$scope.fillChildrenNodes(commentArray,commentArray[i].Id_comentario)
                    cont = cont +1;
                }
              }
              console.log($scope.tree)
          })
        }

        $scope.fillChildrenNodes = function(array, parentId){
            var newArray = [];
            var cont = 0;
            for (var i = 0; i < array.length; i++) {
              if(array[i].Id_comentario_padre === parentId){
                  newArray.push({id:array[i].Id_comentario,text: array[i].descripción,nodes: []})
                  console.log(newArray)
                  var children = $scope.fillChildrenNodes(array, array[i].Id_comentario)
                  if(children.length > 0 ){
                    newArray[cont].nodes.push(children)
                    cont= cont +1;
                  }
              }
            }
            return newArray;
        }
    //fin comentarios

  }]);
