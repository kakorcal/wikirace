(()=>{
  angular.module('users.service', [])
    .service('UserService', UserService);

  UserService.$inject = ['$http'];
  function UserService($http){
    const USER_URL = '/api/users';
    const user = {};

    // AUTH
    // TODO: Separate auth methods into auth service
    this.currentUser = function () {
      return user;
    };

    this.login = function(user){
      console.log('LOGIN', user);
      return $http.post('/auth/login', user)
    };

    this.logout = function(){
      console.log('LOGOUT', user);
      user = null;
      $window.localStorage.clear();
    };

    this.signup = function(user){
      console.log('SIGNUP', user);
      return $http.post('/api/new', user);
    };

    this.setCurrentUser = function(data){
      console.log('SET CURRENT USER', data);
      user = data.data.user
      $window.localStorage.setItem("token", data.data.token);
      $window.localStorage.setItem("user", JSON.stringify(data.data.user));
    };

    this.getCurrentUser = function(){
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