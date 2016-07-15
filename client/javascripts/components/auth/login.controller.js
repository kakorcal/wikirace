(()=>{
  angular.module('login.controller', [])
    .controller('LoginController', LoginController);

  LoginController.$inject = ['UserService', '$location', '$ngBootbox'];
  function LoginController(UserService, $location){
    let vm = this;
      
    vm.onFormSubmit = function(user){
      // send username and password to db
      debugger;
      UserService.login({user}).then(({data})=>{
        if(data.error){
          // error
          $ngBootbox.alert(data.error).then(()=>{
            console.log(data.error);
          });
        }else{
          // success
          $ngBootbox.alert(data.success).then(()=>{
            UserService.setCurrentUser(data);
            $location.path(`/users/${data.user.id}`);
          });
        }
      }).catch(err=>{
        // fallback
        $ngBootbox.alert(err).then(()=>{
          console.log(err);
        });
      });
    };
  }
})();