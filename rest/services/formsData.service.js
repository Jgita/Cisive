app.factory('formsData', ['$http', '$rootScope', function($http, $rootScope, $scope) {
     var books = [];

     $scope.$on('handleSharedBooks', function(events, insuredInfo) {
        $scope.books = insuredInfo;
      
      });
  }]);