(()=>{
  angular.module('wikirace', [
    'ngMaterial',
    'socket.service',
    'users.service',
    'wikirace.routes',
    'wikirace.filter'
  ]);
})();