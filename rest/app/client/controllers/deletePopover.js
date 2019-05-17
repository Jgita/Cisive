app
    .controller('deleteController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.delete = function (item) {
            $rootScope.$broadcast('removeDamage', item);
        }

    }]);