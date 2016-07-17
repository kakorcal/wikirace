(()=>{
  angular.module('wikirace.routes', ['ngRoute']).config(routes);

  routes.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
  function routes($routeProvider, $locationProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/home.html'
      })
      .when('/play', {
        templateUrl: 'views/pages/game/play.html'
      })
      .when('/play/one-player', {
        templateUrl: 'views/pages/game/one_player.html',
        controllerAs: 'vm',
        controller: 'OnePlayerGame'
      })
      .when('/play/two-player', {
        templateUrl: 'views/pages/game/two_player.html',
        controllerAs: 'vm',
        controller: 'TwoPlayerGame'
      })
      .when('/instructions', {
        templateUrl: 'views/pages/game/how_to_play.html',
        controllerAs: 'vm'
      })
      .when('/auth/login', {
        templateUrl: 'views/pages/auth/login.html',
        controllerAs: 'vm',
        controller: 'LoginController',
        preventWhenLoggedIn: true
      })
      .when('/auth/logout',{
        restricted: true,
        resolve: {
          app: onLogout
        }
      })
      .when('/auth/new', {
        templateUrl: 'views/pages/auth/create_account.html',
        controllerAs: 'vm',
        controller: 'NewAccount',
        preventWhenLoggedIn: true,
        signup: true
      })
      .when('/rankings', {
        templateUrl: 'views/pages/users/rankings.html',
        controllerAs: 'vm',
        controller: 'UserIndexController',
        resolve: {
          users: getAllUsers
        }
      })      
      .when('/users/:id', {
        templateUrl: 'views/pages/users/show.html',
        controllerAs: 'vm',
        controller: 'UserShowController',
        restricted: true,
        resolve: {
          user: getUserById
        }
      })
      .when('/users/:id/edit', {
        templateUrl: 'view/pages/users/edit.html',
        controllerAs: 'vm',
        controller: 'UserEditController'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  
  //***************************************************************************
  // props to elie for the $httpProvider and jwt example
  // https://github.com/gSchool/angular-curriculum/tree/master/Unit-3/examples/auth_example
  //***************************************************************************
  angular.module('wikirace.routes').service('AuthInterceptor', AuthInterceptor);
  AuthInterceptor.$inject = ['$window', '$location', '$q'];
  function AuthInterceptor($window, $location, $q){
    return {
      request: function(config){
        // prevent browser bar tampering for /api routes
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        var token = $window.localStorage.getItem("token");
        if(token) config.headers.Authorization = "Bearer " + token;
        return $q.resolve(config);
      },
      responseError: function(err){
        // if you mess around with the token, log them out and destroy it
        if(err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed"){
          $location.path("/logout");
          return $q.reject(err);
        }
        // if you try to access a user who is not yourself
        if(err.status === 401){
          $location.path('/');
          return $q.reject(err);
        }
        return $q.reject(err);
      }
    };
  };

  angular.module('wikirace.routes').run(Authorize);
  Authorize.$inject = ['$rootScope', '$location', '$window'];
  function Authorize($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', (event, next, current)=>{

      // if you try access a restricted page without logging in
      if (next.restricted && !$window.localStorage.getItem("token")) {
        if(current && current.signup){
          $location.path('/signup');
        }else{
          $location.path('/login');
        }
      }
      
      // if you try to log in or sign up once logged in
      if (next.preventWhenLoggedIn && $window.localStorage.getItem("token")) {
        $location.path('/');
      }
    });
  };

  getAllUsers.$inject = ['UserService'];
  function getAllUsers(UserService){
    return UserService.getUsers();
  }

  getUserById.$inject = ['UserService', '$route'];
  function getUserById(UserService, $route){
    return UserService.getSingleUser($route.current.params.id);
  }

  onLogout.$inject = ['UserService', '$location', '$ngBootbox'];
  function onLogout(UserService, $location, $ngBootbox){
    $ngBootbox.alert('Logging Out').then(()=>{
      UserService.logout();
      $location.path("/");
    });
  }
})();