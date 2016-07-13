(()=>{
  angular.module('one_player.controller', ['ngSanitize'])
    .controller('OnePlayerGame', OnePlayerGame);

  OnePlayerGame.$inject = ['Socket', '$location', '$ngBootbox'];
  function OnePlayerGame(Socket, $location, $ngBootbox){
    let vm = this;
    vm.clicks = 0;
    
    vm.quitGame = function(){
      $ngBootbox.confirm('Are You Sure?').then(()=>{
        Socket.disconnect(true);
        $location.path('/play');
      });
    };

    Socket.connect().emit('Setup One Player Game');

    Socket.on('Retrieve Article Titles', titles=>{
      [vm.first, vm.second] = titles;
      
    });
  }
})();