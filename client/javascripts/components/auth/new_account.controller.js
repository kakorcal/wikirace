(()=>{
  angular.module('new_account.controller', [])
    .controller('NewAccount', NewAccount)
  
  NewAccount.$inject = ['UserService', '$location', '$ngBootbox'];
  function NewAccount(UserService, $location, $ngBootbox){
    let vm = this;
    vm.user = {};
      
    vm.onFormSubmit = function(user){
      // initialize default
      user.thumbnail_url = '/assets/thumbnails/blanka.gif';
      user['1p_score'] = 0;
      user['2p_score'] = 0;

      // send username and password to db
      UserService.createUser({user}).then(({data})=>{
        if(data === 'Login Successful'){
          // if username doesn't exist in db, authenticate with sockets
          // and redirect them to the users/:id page
          $ngBootbox.alert(data).then(()=>{
            $location.path('/');                  
          });
        }else if(data === 'Username Already Exists'){
          // otherwise send error popup saying that the username already exists
          $ngBootbox.alert(data).then(()=>{
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