(()=>{
  angular.module('one_player.controller', ['ngSanitize'])
    .controller('OnePlayerGame', OnePlayerGame)
    .directive('compile', compile);
  
  //***************************************************************************
  // NOT MY CODE!! check out: https://github.com/angular/angular.js/issues/4992
  //***************************************************************************
  compile.$inject = ['$compile'];
  function compile($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes assign it into the current DOM
          element.html(value);
          // compile the new DOM and link it to the current scope.
          // NOTE: we only compile .childNodes so that we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  };
  //***************************************************************************
    // END
  //***************************************************************************

  OnePlayerGame.$inject = ['$scope', '$sce', 'Socket', '$location', '$ngBootbox'];
  function OnePlayerGame($scope, $sce, Socket, $location, $ngBootbox){
    let vm = this;
    vm.clicks = 0;
    vm.articles = [];
    vm.timerRunning = false;
    vm.isPlaying = false;

    vm.startGame = function(){
      $scope.$broadcast('timer-start');
      vm.timerRunning = true;
      vm.isPlaying = true;
      Socket.emit('Generate Article', `/wiki/${vm.first}`);
    };
    
    vm.toggleSound = function(){
      
    };

    vm.toggleTime = function(){
      if(vm.isPlaying){
        if(vm.timerRunning){
          $scope.$broadcast('timer-stop');
          vm.timerRunning = false;
        }else{
          $scope.$broadcast('timer-resume');
          vm.timerRunning = true;
        }
      }
    };

    vm.quitGame = function(){
      $ngBootbox.confirm('Are You Sure?').then(()=>{
        Socket.disconnect(true);
        $location.path('/play');
      });
    };

    vm.generateArticle = function(path){
      Socket.emit('Generate Article', path);
    };
    
    // SOCKET LISTENERS
    Socket.connect().emit('Setup One Player Game');

    Socket.on('Receive Titles', titles=>{
      [vm.first, vm.last] = titles;
    });

    Socket.on('Receive Article', data=>{
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
    });

    Socket.on('Error', data=>{
      $ngBootbox.alert('An Error Has Occurred', ()=>{
        console.log(data);
      });
    });

    $scope.$on('$locationChangeStart', e=>{
      Socket.disconnect(true);
    });
  }
})();