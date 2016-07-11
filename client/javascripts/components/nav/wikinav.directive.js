(()=>{
  angular.module('wikinav.directive', [])
    .directive('wikiNav', wikiNav)
    // this directive is dependent on having the wiki-wrapper class 
    // as the container
    function wikiNav(){
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'views/partials/_nav.html'
      }
    }
})();