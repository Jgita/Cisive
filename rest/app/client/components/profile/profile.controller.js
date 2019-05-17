app
    .controller('ProfileController', ['$scope', '$q', '$http', '$rootScope', 'toastr', 'CONSTANTS', function ($scope, $q, $http, $rootScope, toastr, CONSTANTS) {

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.route = 'insuredPage.editProfile';
            $scope.USERID = sessionStorage.userId;
        }
        
        $scope.onLoad = function () {

            $rootScope.isProcessShow(true);
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: $rootScope.baseUrl + 'user/getuserprofile/' + $scope.USERID,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }
            };

            $http(request).then(function (response) {
                $rootScope.isProcessShow(false);
                $scope.profileData = response.data["0"];
                deferred.resolve({ success: true });
                return true,
                    response;
            }, function (response) {
                $rootScope.isProcessShow(false);
                deferred.resolve({ success: false });
                return false;
            });
            deferred.resolve({ success: true });
        };

        if ($scope.USERID != null) {
            $scope.onLoad();
        } else {
            toastr.error(CONSTANTS.somethingWentWrong, { timeOut: $rootScope.toastrTimeThreeSec });
        }
        $rootScope.sessionLogout();
    }]);