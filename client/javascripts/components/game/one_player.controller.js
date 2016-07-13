(()=>{
  angular.module('one_player.controller', ['ngSanitize'])
    .controller('OnePlayerGame', OnePlayerGame);

  OnePlayerGame.$inject = ['$scope', 'Socket', '$location', '$ngBootbox'];
  function OnePlayerGame($scope, Socket, $location, $ngBootbox){
    let vm = this;
    vm.clicks = 0;
    vm.timerRunning = true;
    
    vm.toggleSound = function(){
      
    };

    vm.toggleTime = function(){
      if(vm.timerRunning){
        $scope.$broadcast('timer-stop');
        vm.timerRunning = false;
      }else{
        $scope.$broadcast('timer-resume');
        vm.timerRunning = true;
      }
    };

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