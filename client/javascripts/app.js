(()=>{
  angular.module('wikirace', [
    'ngMaterial',
    'btford.socket-io',
    'socket.service',
    'users.service',
    'wikirace.routes',
    'wikirace.filter'
  ]);
})();