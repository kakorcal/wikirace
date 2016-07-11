(()=>{
  angular.module('users.service', [])
    .service('UserService', UserService);

  UserService.$inject = ['$http'];
  function UserService($http){
    const BASE_URL = '/api/users';
    
    this.getUsers = function(){
      return $http.get(BASE_URL);
    };

    this.getSingleUser = function(id){
      return $http.get(`${BASE_URL}/${id}`);
    };

    this.createUser = function(data){
      return $http.post(BASE_URL, data);
    }

    this.updateUser = function(data){
      return $http.put(`${BASE_URL}/${data.user.id}`, data);
    };

    this.deleteUser = function(id){
      return $http.delete(`${BASE_URL}/${id}`);
    }
  }
})();