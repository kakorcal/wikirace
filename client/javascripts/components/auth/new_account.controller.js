(()=>{
  angular.module('new_account.controller', [])
    .controller('NewAccount', NewAccount)
  
  NewAccount.$inject = ['UserService', '$location', '$ngBootbox'];
  function NewAccount(UserService, $location, $ngBootbox){
    let vm = this;
      
    vm.onFormSubmit = function(user){
      // send username and password to db
      UserService.signup({user}).then(data=>{
        if(data.error){
          // error
          $ngBootbox.alert(data.error).then(()=>{
            console.log(data.error);
          });
        }else{
          // success
          $ngBootbox.alert(data.success).then(()=>{
            UserService.setCurrentUser(data);
            $location.path('/users');
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