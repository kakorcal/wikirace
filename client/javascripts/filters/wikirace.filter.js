(()=>{
  angular.module('wikirace.filter', [])
    .filter('truncate', truncate)

  function truncate(){
    return function(str, chars){
      if(typeof str !== 'string') str = str + '';

      if(str.length > chars){
        return `${str.substring(0, chars)}...`;
      }else{
        return str;
      }
    }
  }
})();