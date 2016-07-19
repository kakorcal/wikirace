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
    vm.countdownStart = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;
    vm.countdown = 10;
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
        username: vm.currentUser ? vm.currentUser.username : null,
        socketId: id,
        clicks: 0
      };
      Socket.emit('Add Player To Room', vm.player);
    });

    Socket.on('Set Players', players=>{
      let keys = Object.keys(players);
      vm.player = players[vm.player.socketId];
      vm.opponent = keys[0] !== vm.player.socketId ? players[keys[0]] : players[keys[1]];
      if(!vm.player.username) vm.player.username = 'You';
      if(!vm.opponent.username) vm.opponent.username = 'Guest';
      console.log('Player', vm.player);
      console.log('Opponent', vm.opponent);
      if(vm.player.username === vm.opponent.username){
        $ngBootbox.alert('Cannot Play Against Yourself').then(()=>{
          Socket.removeAllListeners();
          $location.path('/play');
        });
      }else{
        Socket.emit('Load Game');
      }
    });

    Socket.on('Player Leave', players=>{
      if(vm.isPlaying){
        $ngBootbox.alert('Your Opponent Left The Game. This Game Will Not Be Counted Towards Your Rankings.')
          .then(()=>{
            Socket.removeAllListeners();
            $location.path('/play');
          });        
      }
    }); 

    Socket.on('Receive Titles', titles=>{
      if(!vm.first && !vm.last){
        [vm.first, vm.last] = titles;
      }

      if(vm.first && vm.last){
        Socket.emit('Set Countdown');
      }
    });

    Socket.on('Start Countdown', ()=>{
      if(!vm.countdownStart){
        vm.countdownStart = true;
        let timer = $interval(()=>{
          vm.countdown--;
          if(vm.countdown === 0){
            $interval.cancel(timer);
            Socket.emit('Start Game');
          }
        }, 1000);
      }
    });

    Socket.on('Load Initial Article', ()=>{
      $scope.$broadcast('timer-start');
      vm.timerRunning = true;
      vm.isPlaying = true;
      vm.isLoading = true;
      Socket.emit('Generate Article', `/wiki/${vm.first}`);
    });

    Socket.on('Receive Article', data=>{
      vm.title = data.title;
      vm.content = data.content;
      vm.styles = data.styles;
      vm.thumbnail = data.thumbnail ? `https:${data.thumbnail}` : '/assets/wiki-logo.png';
      vm.articles.push({title: data.text, path: data.path, thumbnail: vm.thumbnail});
      vm.isLoading = false;

      if(vm.player.clicks){
        Socket.emit('Update Clicks', vm.player);
      }

      if(data.text === vm.last) {
        $scope.$broadcast('timer-stop');
        vm.timerRunning = false;
        vm.isPlaying = false;
        vm.isWin = true;
        Socket.emit('Game Finished', vm.player);
      }
    });

    Socket.on('Receive Updated Clicks', player=>{
      if(player.socketId !== vm.player.socketId) vm.opponent.clicks++;
    });

    Socket.on('Evaluate Score', player=>{
      console.log('Evaluate Score');
      if(vm.isWin){
        if(vm.time > 5){
          vm.points = Math.floor((1000 - (vm.time * (vm.player.clicks / 4))));
          if(vm.points < 0) vm.points = 0;
        }else{
          vm.points = 1000;
        }
      }else{
        $scope.$broadcast('timer-stop');
        vm.timerRunning = false;
        vm.isPlaying = false;
        // TODO: shouldn't call this isWin. Maybe isGameFinish
        vm.isWin = true;
        vm.points = 0;
      }

      if(vm.currentUser){
        // add score to db
        UserService.addScore({user: new Stat(vm)}).then(({data})=>{
          console.log(data);
        }).catch(err=>{
          $ngBootbox.alert('An Error Has Occurred', ()=>{
            console.log(err);
          });
        });
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

  function Stat(vm){
    this.username = vm.currentUser.username;
    this.id = vm.currentUser.id;
    this.path = vm.articles.map(article => article.title).join(' -> ');
    this.score = {
      user_id: vm.currentUser.id,
      points: vm.points,
      time: vm.time,
      clicks: vm.player.clicks,
      game_type: vm.gameType,
      result: vm.points ? 'win' : 'lose'
    };
  }
})();