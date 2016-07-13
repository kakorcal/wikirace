(()=>{
  angular.module('two_player.controller', [])
    .controller('TwoPlayerGame', TwoPlayerGame);
  
  TwoPlayerGame.$inject = ['$scope', 'Socket', '$location', '$ngBootbox', '$anchorScroll'];
  function TwoPlayerGame($scope, Socket, $location, $ngBootbox, $anchorScroll){
    let vm = this;
    vm.clicks = 0;
    vm.time = 0;
    vm.points = 0;
    vm.articles = [];
    vm.timerRunning = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;
  }


})();