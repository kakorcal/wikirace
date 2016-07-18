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
    vm.players = [];
    vm.articles = [];
    vm.extraTitles = null;
    vm.countdown = 3;
    vm.time = 0;
    vm.gameType = '2';
    vm.timerRunning = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;

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
      vm.clicks++;
      vm.isLoading = true;
      Socket.emit('Generate Article', path);
    };

    $scope.$on('timer-stopped', (e, time)=>{
      vm.time = (time.minutes * 60) + time.seconds;
    });

    Socket.connect().emit('Setup Two Player Game');

    Socket.on('Player Join', ()=>{
      Socket.emit('Check Game Status');
    });

    Socket.on('Player Leave', ()=>{
      Socket.emit('Check Game Status');
    });

    Socket.on('Ready To Play', ids=>{
      vm.players = [new Player(ids[0]), new Player(ids[1])];
      Socket.emit('Load Game');
    });

    Socket.on('Not Ready', ids=>{
      vm.players = null;
    });

    Socket.on('Receive Titles', titles=>{
      // since two people are emitting load game, extra titles get received from the server.
      // so only set vm.first and vm.last to titles if the extra titles were received.
      if(!vm.extraTitles){
        vm.extraTitles = titles;
      }else{
        [vm.first, vm.last] = titles;

        let timer = $interval(()=>{
          vm.countdown--;
          if(vm.countdown === 0){
            $interval.cancel(timer);
            Socket.emit('Start Game');
          }
        }, 1000);
      }
    });

    Socket.on('Load First Article', ()=>{
      $scope.$broadcast('timer-start');
      vm.timerRunning = true;
      vm.isPlaying = true;
      vm.isLoading = true;
      Socket.emit('Generate Article', `/wiki/${vm.first}`);
    });

    Socket.on('Receive Article', data=>{
      console.log('Receive Article');
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
      vm.thumbnail = data.thumbnail ? `https:${data.thumbnail}` : '/assets/wiki-logo.png';
      vm.articles.push({title: data.text, path: data.path, thumbnail: vm.thumbnail});
      vm.isLoading = false;

      if(data.text === vm.last) {
        $scope.$broadcast('timer-stop');
        vm.timerRunning = false;
        vm.isPlaying = false;
        vm.isWin = true;
        Socket.emit('Game Finished');
      }
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

  function Player(socketId){
    this.socketId = socketId;
    this.clicks= 0;
    this.points= 0;
    this.articles= [];
    this.isPlaying= false;
    this.isLoading= false;
    this.isWin= false;
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