(()=>{
  angular.module('one_player.controller', [])
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

  OnePlayerGame.$inject = ['$scope', '$window', 'Socket', '$location', '$ngBootbox', '$anchorScroll'];
  function OnePlayerGame($scope, $window, Socket, $location, $ngBootbox, $anchorScroll){
    let vm = this;
    vm.clicks = 0;
    vm.time = 0;
    vm.points = 0;
    vm.articles = [];
    vm.timerRunning = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;

    vm.startGame = function(){
      console.log($window.localStorage.getItem('user'));
      $scope.$broadcast('timer-start');
      vm.timerRunning = true;
      vm.isPlaying = true;
      vm.isLoading = true;
      Socket.emit('Generate Article', `/wiki/${vm.first}`);
    };
    
    vm.toggleSound = function(){
      // TODO: Add bgm and fx
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

    vm.changeArticles = function(){
      vm.first = null;
      vm.last = null;
      Socket.emit('Setup One Player Game');
    };

    vm.onHashClick = function(hash){
      let old = $location.hash();
      $location.hash(hash);
      $anchorScroll();
      $location.hash(old);
    };

    vm.resetGame = function(){
      $scope.$broadcast('timer-reset');
      vm.clicks = 0;
      vm.time = 0;
      vm.points = 0;
      vm.articles = [];
      vm.isWin = false;
      vm.first = null;
      vm.last = null;
      vm.title = null;
      vm.content = null;
      vm.styles = null;
      vm.thumbnail = null;
      Socket.emit('Setup One Player Game');
    };

    vm.quitGame = function(){
      $ngBootbox.confirm('Are You Sure?').then(()=>{
        Socket.disconnect(true);
        $location.path('/play');
      });
    };

    vm.generateArticle = function(path){
      vm.clicks++;
      vm.isLoading = true;
      Socket.emit('Generate Article', path);
    };

    $scope.$on('timer-stopped', (e, time)=>{
      vm.time = (time.minutes * 60) + time.seconds;
    });
    
    // SOCKET LISTENERS
    Socket.connect().emit('Setup One Player Game');

    Socket.on('Receive Titles', titles=>{
      [vm.first, vm.last] = titles;
    });

    Socket.on('Receive Article', data=>{
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
      vm.thumbnail = data.thumbnail ? `https:${data.thumbnail}` : '/assets/wiki-logo.png';
      vm.isLoading = false;
      vm.articles.push({title: data.text, path: data.path, thumbnail: vm.thumbnail});

      if(data.text === vm.last) {
        $scope.$broadcast('timer-stop');
        vm.timerRunning = false;
        vm.isPlaying = false;
        vm.isWin = true;
        Socket.emit('Player Win');
      }
    });

    Socket.on('Finish Game', ()=>{
      if(vm.time > 5){
        vm.points = (1000 - (vm.time * (vm.clicks / 4)));
        if(vm.points < 0) vm.points = 0;
      }else{
        vm.points = 1000;
      }
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