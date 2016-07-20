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
          // TODO: Intercept with popup if error occurs when parsing
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

  OnePlayerGame.$inject = ['$scope', '$window', '$timeout', '$location', '$ngBootbox', '$anchorScroll', 'Socket', 'UserService'];
  function OnePlayerGame($scope, $window, $timeout, $location, $ngBootbox, $anchorScroll, Socket, UserService){
    let vm = this;
    vm.currentUser = UserService.getCurrentUser();
    vm.clicks = 0;
    vm.time = 0;
    vm.points = 0;
    vm.articles = [];
    vm.timerRunning = false;
    vm.isPlaying = false;
    vm.isLoading = false;
    vm.isWin = false;
    vm.gameType = '1';

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
          Socket.emit('Setup One Player Game');        
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
    Socket.connect().emit('Setup One Player Game');

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
          });
        });
      }
    });

    Socket.on('Error', data=>{
      $ngBootbox.alert('An Error Has Occurred', ()=>{
        console.log(data);
      });
    });

    $scope.$on('$locationChangeStart', e=>{
      if(vm.isPlaying){
        e.preventDefault();
        $ngBootbox.confirm(
          'Are You Sure? Note: If you want to go back to the previous articles,'+ 
          ' please click on the search history listed in the sidebar.').then(()=>{
          Socket.removeAllListeners();
          Socket.disconnect(true);
          vm.isPlaying = false;
          $location.path('/play');
        });
      }else{
        Socket.disconnect(true);
      }
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