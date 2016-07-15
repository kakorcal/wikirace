(()=>{
  angular.module('userShow.controller', [])
    .controller('UserShowController', UserShowController);
  
  UserShowController.$inject = ['user', 'UserService', '$location'];
  function UserShowController({data:user}, UserService, $location){
    let vm = this;
    vm.user = user;
    console.log(user);
    // name, image, 1p_score total, 2p_score total, total win, total lose, rank
  }
})();