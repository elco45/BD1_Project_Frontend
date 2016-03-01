angular.module('AngularScaffold.Services').factory('UserService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		//var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		var baseUrl = 'http://localhost:8000/';
		return {
			Register: function(payload){
						console.log(payload)
	          return $http.post(baseUrl + "v1/register", payload);
      },
      GetUsers:function(){
				return $http.get(baseUrl + "v1/users");
			},
			DelUsers: function(username,w){
				return $http.delete(baseUrl+"v1/deluser/"+username);
			}
	    };
}]);
