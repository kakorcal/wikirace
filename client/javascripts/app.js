(()=>{
  angular.module('wikirace', [
    'ngMaterial',
    'ngMessages',
    'ngBootbox',
    'sockets.service',
    'users.service',
    'wikirace.routes',
    'wikirace.filter',
    'wikinav.directive',
    'new_account.controller'
  ]);

  //***************************************************************************
  // will not use a custom theme until conflicts with ngMessages are resolved
  //***************************************************************************
  // .config(theme);

  theme.$inject = ['$mdThemingProvider', '$mdIconProvider'];
  function theme($mdThemingProvider, $mdIconProvider){
    // alias materials-icons as mi
    $mdIconProvider.fontSet('mi', 'material-icons');

    // config theme to ensure text is always white
    $mdThemingProvider.definePalette('white-palette', {
      // Need 50 and 100 to prevent instantiation error
      '50': '#fff', '100': '#000',
      // primary teal
      '200': '#A7FFEB', '300': '#64FFDA', '400': '#1DE9B6', '500': '#00BFA5',
      // warn deep orange
      '600': '#FF9E80', '700': '#FF6E40', '800': '#FF3D00', '900': '#DD2C00',
      // accent blue
      'A100': '#82B1FF','A200': '#448AFF','A400': '#2979FF','A700': '#2962FF',
      'contrastDefaultColor': 'dark',
      'contrastDarkColors'  : undefined,
      'contrastLightColors' : [
        '200', '300', '400', '500', 
        '600', '700', '800', '900',
        'A100', 'A200', 'A400', 'A700'
      ]
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('white-palette', {
        'default': '300',
        'hue-1'  : '200',
        'hue-2'  : '400',
        'hue-3'  : '500'
      })
      .warnPalette('white-palette', {
        'default': '700',
        'hue-1'  : '600',
        'hue-2'  : '800',
        'hue-3'  : '900'
      })
      .accentPalette('white-palette', {
        'default': 'A200',
        'hue-1'  : 'A100',
        'hue-2'  : 'A400',
        'hue-3'  : 'A700'
      });
  }
})();