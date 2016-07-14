(()=>{
  angular.module('userShow.controller', [])
    .controller('UserShowController', UserShowController);
  
  UserShowController.$inject = ['user', 'UserService', '$location'];
  function UserShowController({data:user}, UserService, $location){
    let vm = this;
    vm.user = user;
    console.log(vm.user);
  }
})();