(()=>{
  angular.module('userEdit.controller', [])
    .controller('UserEditController', UserEditController);
  
  UserEditController.$inject = ['user', 'UserService', '$location', '$ngBootbox'];
  function UserEditController({data:user}, UserService, $location, $ngBootbox){
    let vm = this;
    vm.user = {
      id: user.id,
      username: user.username,
      thumbnail_url: user.thumbnail_url
    };

    vm.onFormSubmit = function(user){
      UserService.editUser({user}).then(({data})=>{
        $ngBootbox.alert(data).then(()=>{
          console.log(data);
          $location.path(`/users/${user.id}`);
        });
      }).catch(err=>{
        $ngBootbox.alert('Failed To Edit Profile').then(()=>{
          console.log(err);
        });
      });   
    };
  }
})();