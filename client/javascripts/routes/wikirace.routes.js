(()=>{
  angular.module('wikirace.routes', ['ngRoute']).config(routes);

  routes.$inject = ['$routeProvider', '$locationProvider'];

  function routes($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/home.html'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
    $locationProvider.html5Mode(true);
  }

})();