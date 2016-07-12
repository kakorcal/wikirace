(()=>{
  angular.module('new_account.controller', [])
    .controller('NewAccount', NewAccount)
  
  NewAccount.$inject = ['UserService', '$location'];
  function NewAccount(UserService, $location){
    let vm = this;
    vm.user = {};
      
    vm.onFormSubmit = function(user){
      // initialize default
      user.thumbnail_url = '/assets/thumbnails/blanka.gif';
      user['1p_score'] = 0;
      user['2p_score'] = 0;
      
      // send username and password to db
      UserService.createUser({user}).then(res=>{
        if(res.data === 'Account Created!'){
          // if username doesn't exist in db, authenticate with sockets
          // and redirect them to the users/:id page
          $location.path('/');                  
        }else{
          // otherwise send error popup saying that the username already exists
          alert(res.data);
        }
      }).catch(err=>{
        alert('An Error Has Occurred In The Database');
      });
    };
  }
})();