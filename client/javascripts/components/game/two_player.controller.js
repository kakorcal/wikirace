(()=>{
  angular.module('two_player.controller', [])
    .controller('TwoPlayerGame', TwoPlayerGame)
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

  TwoPlayerGame.$inject = ['$scope', '$window', '$timeout', '$interval', '$location', '$ngBootbox', '$anchorScroll', 'Socket', 'UserService'];
  function TwoPlayerGame($scope, $window, $timeout, $interval, $location, $ngBootbox, $anchorScroll, Socket, UserService){
    // For two players, the option to pause the game doesn't exist so vm.time is same for both
    let vm = this;
    vm.currentUser = UserService.getCurrentUser();
    vm.articles = [];
    vm.player = null;
    vm.opponent = null;
    vm.socketId = null;
    vm.timerRunning = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;
    vm.countdown = 3;
    vm.gameType = '2';
    vm.time = 0;

    vm.quitGame = function(){
      $ngBootbox.confirm('Are You Sure?').then(()=>{
        Socket.removeAllListeners();
        $location.path('/play');
      });
    };

    vm.onHashClick = function(hash){
      let old = $location.hash();
      $location.hash(hash);
      $anchorScroll();
      $location.hash(old);
    };

    vm.generateArticle = function(path){
      vm.player.clicks++;
      vm.isLoading = true;
      Socket.emit('Generate Article', path);
    };

    $scope.$on('timer-stopped', (e, time)=>{
      vm.time = (time.minutes * 60) + time.seconds;
    });

    Socket.connect().emit('Setup Two Player Game');
    
    Socket.on('Receive Socket Id', id=>{
      vm.player = {
        id: vm.currentUser ? vm.currentUser.id : -1,
        username: vm.currentUser ? vm.currentUser.username : 'Guest',
        socketId: id,
        clicks: 0
      };

      Socket.emit('Add Player To Room', vm.player);
    });

    Socket.on('Player Leave', players=>{
      vm.players = players;
    }); 

    Socket.on('Room Full', ()=>{
      $ngBootbox.alert('Sorry :( please try again at another time').then(()=>{
        Socket.removeAllListeners();
        $location.path('/play');
      });
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

  function Stat(vm){
    this.username = vm.currentUser.username;
    this.id = vm.currentUser.id;
    this.path = vm.articles.map(article => article.title).join(' -> ');
    this.score = {
      user_id: vm.currentUser.id,
      points: vm.points,
      time: vm.time,
      clicks: vm.clicks,
      game_type: vm.gameType,
      result: vm.points ? 'win' : 'lose'
    };
  }
})();