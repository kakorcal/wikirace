(()=>{
  angular.module('userIndex.controller', [])
    .controller('UserIndexController', UserIndexController);
  
  UserIndexController.$inject = ['users'];
  function UserIndexController({data:users}){
    let vm = this;

    vm.oneplayer = [...users].sort((a, b)=>{
      return b['1p_score'] - a['1p_score'];
    });     

    vm.twoplayer = [...users].sort((a, b)=>{
      return b['2p_score'] - a['2p_score'];
    });   
  
    // TODO: not elegant solution. find better one.

    vm.gameType = 'oneplayer';
    vm.buttonOne = 'md-warn md-hue-1';
    vm.buttonTwo = '';

    vm.toggleGameType = function(type){
      if(type === 'oneplayer'){
        vm.gameType = 'oneplayer';
        vm.buttonOne = 'md-warn md-hue-1';
        vm.buttonTwo = '';
      }else{
        vm.gameType = 'twoplayer';
        vm.buttonTwo = 'md-warn md-hue-1';
        vm.buttonOne = '';
      }
    }

  }
})();