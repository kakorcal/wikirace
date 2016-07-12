(()=>{
  angular.module('wikirace.routes', ['ngRoute']).config(routes);

  routes.$inject = ['$routeProvider', '$locationProvider'];
  function routes($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/home.html'
      })
      .when('/play', {
        templateUrl: 'views/pages/game/play.html',
        controllerAs: 'vm'
      })
      .when('/play/one-player', {
        templateUrl: 'views/pages/game/one_player.html',
        controllerAs: 'vm'
      })
      .when('/play/two-player', {
        templateUrl: 'views/pages/game/two_player.html',
        controllerAs: 'vm'
      })
      .when('/instructions', {
        templateUrl: 'views/pages/game/how_to_play.html',
        controllerAs: 'vm'
      })
      .when('/auth/login', {
        templateUrl: 'views/pages/auth/login.html',
        controllerAs: 'vm'
      })
      .when('/auth/new', {
        templateUrl: 'views/pages/auth/create_account.html',
        controllerAs: 'vm',
        controller: 'NewAccount'
      })
      .when('/users', {
        templateUrl: 'views/pages/users/rankings.html',
        controllerAs: 'vm'
      })      
      .when('/users/:id', {
        templateUrl: 'view/pages/users/show.html',
        controllerAs: 'vm',
        resolve: {
          user: getUserById
        }
      })
      .when('/users/:id/edit', {
        templateUrl: 'view/pages/users/edit.html',
        controllerAs: 'vm'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
    $locationProvider.html5Mode(true);
  }

  getAllUsers.$inject = ['UserService'];
  function getAllUsers(UserService){
    return UserService.getUsers();
  }

  getUserById.$inject = ['UserService', '$route'];
  function getUserById(UserService, $route){
    return UserService.getSingleUser($route.current.params.id);
  }
})();