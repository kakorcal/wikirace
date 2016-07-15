(()=>{
  angular.module('users.service', [])
    .service('UserService', UserService);

  UserService.$inject = ['$http', '$window'];
  function UserService($http, $window){
    const USER_URL = '/api/users';
    // AUTH
    // TODO: Separate auth methods into auth service
    this.login = function(user){
      console.log('LOGIN');
      debugger;
      return $http.post('/api/login', user);
    };

    this.logout = function(){
      console.log('LOGOUT');
      $window.localStorage.clear();
    };

    this.signup = function(user){
      console.log('SIGNUP');
      return $http.post('/api/new', user);
    };

    this.setCurrentUser = function(data){
      console.log('SET CURRENT USER');
      $window.localStorage.setItem("token", data.token);
      $window.localStorage.setItem("user", JSON.stringify(data.user));
    };

    this.getCurrentUser = function(){
      console.log('GET CURRENT USER');
      return JSON.parse($window.localStorage.getItem("user"));
    };
    
    // API
    this.getUsers = function(){
      return $http.get(USER_URL);
    };

    this.getSingleUser = function(id){
      return $http.get(`${USER_URL}/${id}`);
    };

    this.updateUser = function(data){
      return $http.put(`${USER_URL}/${data.user.id}`, data);
    };

    this.deleteUser = function(id){
      return $http.delete(`${USER_URL}/${id}`);
    }
  }
})();