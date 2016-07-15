(()=>{
  anguler.module('userIndex.controller', [])
    .controller('UserIndexController', UserIndexController)
  
  UserIndexController.$inject = ['users'];
  function UserIndexController({data:users}){
    let vm = this;
    vm.users = users;
  }
})();