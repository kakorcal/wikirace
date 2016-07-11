(()=>{
  angular.module('wikirace', [
    'ngMaterial',
    'sockets.service',
    'users.service',
    'wikirace.routes',
    'wikirace.filter'
  ]);
})();