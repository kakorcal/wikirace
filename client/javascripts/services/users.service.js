(()=>{
  angular.module('users.service', [])
    .service('UserService', UserService);

  UserService.$inject = ['$http'];
  function UserService($http){
    const USER_URL = '/api/users';
    const AUTH_URL = '/auth/new';
    
    this.getUsers = function(){
      return $http.get(USER_URL);
    };

    this.getSingleUser = function(id){
      return $http.get(`${USER_URL}/${id}`);
    };

    this.createUser = function(data){
      return $http.post(AUTH_URL, data);
    }

    this.updateUser = function(data){
      return $http.put(`${USER_URL}/${data.user.id}`, data);
    };

    this.deleteUser = function(id){
      return $http.delete(`${USER_URL}/${id}`);
    }
  }
})();