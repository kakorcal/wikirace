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

  TwoPlayerGame.$inject = ['$scope', '$window', '$timeout', '$location', '$ngBootbox', '$anchorScroll', 'Socket', 'UserService'];
  function TwoPlayerGame($scope, $window, $timeout, $location, $ngBootbox, $anchorScroll, Socket, UserService){
    // For two players, the option to pause the game doesn't exist so vm.time is same for both
    let vm = this;
    // vm.currentUser = UserService.getCurrentUser();
    vm.player1 = null;

    vm.player1 = new Player(vm);
    vm.player2 = new Player(vm);
    vm.time = 0;
    vm.timerRunning = false;
    vm.gameType = '2';

    vm.startGame = function(){
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
      Socket.emit('Setup Two Player Game');
    };

    vm.onHashClick = function(hash){
      let old = $location.hash();
      $location.hash(hash);
      $anchorScroll();
      $location.hash(old);
    };

    vm.resetGame = function(){
      $scope.$broadcast('timer-reset');
      vm.title = null;
      vm.content = null;
      vm.styles = null;
      vm.thumbnail = null;
      vm.first = null;
      vm.last = null;

      // this is janky but it makes the transition a little smoother
      $timeout(()=>{
        vm.articles = [];
        vm.isWin = false;
        $timeout(()=>{
          vm.points = 0;
          vm.clicks = 0;
          vm.time = 0;
          Socket.emit('Setup Two Player Game');        
        }, 100);
      }, 100);
    };

    vm.quitGame = function(){
      $ngBootbox.confirm('Are You Sure?').then(()=>{
        Socket.removeAllListeners();
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
    Socket.connect().emit('Setup Two Player Game');

    Socket.on('Receive Titles', titles=>{
      console.log('Receive Titles');
      [vm.first, vm.last] = titles;
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

    Socket.on('Evaluate Score', ()=>{
      console.log('Evaluate Score');
      if(vm.isWin){
        if(vm.time > 5){
          vm.points = Math.floor((1000 - (vm.time * (vm.clicks / 4))));
          if(vm.points < 0) vm.points = 0;
        }else{
          vm.points = 1000;
        }
      }else{
        vm.points = 0;
      }

      if(vm.currentUser){
        // add score to db
        UserService.addScore({user: new Stat(vm)}).then(({data})=>{
          console.log(data);
        }).catch(err=>{
          $ngBootbox.alert('An Error Has Occurred', ()=>{
            console.log(err);
          })
        });
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

  function Player(vm){
      // clicks: 0,
      // points: 0,
      // articles: [],
      // isPlaying: false,
      // isLoading: false,
      // isWin: false
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