(()=>{
  angular.module('login.controller', [])
    .controller('LoginController', LoginController);

  LoginController.$inject = ['UserService', '$location'];
  function LoginController(UserService, $location){

  }
})();