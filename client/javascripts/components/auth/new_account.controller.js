(()=>{
  angular.module('new_account.controller', [])
    .controller('NewAccount', NewAccount)
  
  NewAccount.$inject = ['UserService', '$location', '$ngBootbox'];
  function NewAccount(UserService, $location, $ngBootbox){
    let vm = this;
    vm.user = {};
      
    vm.onFormSubmit = function(user){
      // send username and password to db
      UserService.createUser({user}).then(({data})=>{
        if(data.message === 'Login Successful'){
          // if username doesn't exist in db, authenticate with sockets
          // and redirect them to the users/:id page
          $ngBootbox.alert(data.message).then(()=>{
            // TODO: USE JWT FOR AUTHENTICATION      
            $location.path(`/users/${data.id}`);                  
          });
        }else if(data.message === 'Username Already Exists'){
          // otherwise send error popup saying that the username already exists
          $ngBootbox.alert(data.message).then(()=>{
            console.log(data);
          });
        }
      }).catch(err=>{
        $ngBootbox.alert('An Error Has Occurred In The Database').then(()=>{
          console.log(err);
        });
      });
    };
  }
})();