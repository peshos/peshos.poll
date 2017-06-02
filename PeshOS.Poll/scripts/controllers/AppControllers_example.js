// My Controllers File
angular.module('my-controllers',[])
    .controller('oneCtrl',[...])
    .controller('twoCtrl',[...]);

// My Services File
angular.module('my-services',[])
    .factory('oneSrc',[...])
    .facotry('twoSrc',[...]);

// My Directives File
angular.module('my-directives',[])
    .directive('oneDrct',[...])
    .directive('twoDrct',[...]);

// My Main Application File
angular.module('my-app',['my-controllers','my-services','my-directives',...]);