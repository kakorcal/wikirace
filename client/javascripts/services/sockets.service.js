(()=>{
  angular.module('sockets.service', ['btford.socket-io'])
    .service('Socket', Socket);
  
  Socket.$inject = ['socketFactory'];

  function Socket(socketFactory){
    return socketFactory();
  }
})();