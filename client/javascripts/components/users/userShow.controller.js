(()=>{
  angular.module('userShow.controller', [])
    .controller('UserShowController', UserShowController);
  
  UserShowController.$inject = ['user', 'UserService', '$location'];
  function UserShowController({data:user}, UserService, $location){
    let vm = this;
    vm.user = user;
    vm.rank = user.oneplayer_rank;
    vm.wins = user.oneplayer_wins;
    vm.loses = user.oneplayer_loses;
    vm.score = user['1p_score'];

    // TODO: not elegant solution. find better one.
    vm.gameType = 'oneplayer';
    vm.buttonOne = 'md-primary md-hue-3';
    vm.buttonTwo = null;

    vm.toggleGameType = function(type){
      if(type === 'oneplayer'){
        vm.gameType = 'oneplayer';
        vm.rank = user.oneplayer_rank;
        vm.wins = user.oneplayer_wins;
        vm.loses = user.oneplayer_loses;
        vm.score = user['1p_score'];
        vm.buttonOne = 'md-primary md-hue-3';
        vm.buttonTwo = null;
      }else{
        vm.gameType = 'twoplayer';
        vm.rank = user.twoplayer_rank;
        vm.wins = user.twoplayer_wins;
        vm.loses = user.twoplayer_loses;
        vm.score = user['2p_score'];
        vm.buttonTwo = 'md-warn md-hue-1';
        vm.buttonOne = null;
      }
    }
  }
})();