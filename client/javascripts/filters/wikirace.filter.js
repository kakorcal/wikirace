(()=>{
  angular.module('wikirace.filter', [])
    .filter('truncate', truncate)

  function truncate(){
    return function(str, chars){
      if(typeof str !== 'string') str = str + '';

      if(str.length > chars){
        str = str.substring(0, chars);
        let lastSpace = str.lastIndexOf(' ');
        return `${str.substring(0, lastSpace)}...`;        
      }else{
        return str;
      }
    }
  }
})();