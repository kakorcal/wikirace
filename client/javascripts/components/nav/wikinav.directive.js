(()=>{
  angular.module('wikinav.directive', [])
    .directive('wikiNav', wikiNav)
    // this directive is dependent on having the wiki-wrapper class as the container
    wikiNav.$inject = ['UserService'];
    function wikiNav(UserService){
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'views/partials/_nav.html',
        link: function(scope, element, attrs){
          scope.currentUser = UserService.getCurrentUser();
          scope.$watch(scope.currentUser, ()=>{
            scope.currentUser = UserService.getCurrentUser();
          });
        }
      }
    }
})();