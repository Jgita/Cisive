app.controller('editProfileController', [
    '$scope',
    '$state',
    '$q',
    '$filter',
    '$timeout',
    '$window',
    '$http',
    '$rootScope',
    'toastr',
    'CONSTANTS',
    function ($scope, $state, $q, $filter, $timeout, $window, $http, $rootScope, toastr, CONSTANTS) {

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.route = 'insuredPage.editProfile';
            $scope.USERID = sessionStorage.userId;
        } else {
            $scope.route = 'inspectionPage.editProfile';
        }

        $scope.editProfilSubmit = function () {
            if ($scope.maxLengnthValidation) {
                angular
                    .forEach($scope.editProfilForm.$error.phoneInput, function (field) {
                        toastr.error(CONSTANTS.maxLenCellphone, {timeOut: $rootScope.toastrTimeThreeSec});
                        field.$setDirty();

                    });
            } else {
                angular
                    .forEach($scope.editProfilForm.$error.required, function (field) {
                        toastr.error(CONSTANTS.requiredFields);
                        field.$setDirty();
                    });
            }

        };

        $scope.showMessageMaxLen = function (input) {
            if (input !== undefined && input.$error !== undefined) {

                var showMax = $scope.editProfilForm.$submitted && input.$error.phoneInput;
                $scope.maxLengnthValidation = showMax;
                return showMax;

            }

        };

        $scope.showMessage = function (input) {
            var show = $scope.editProfilForm.$submitted && input.$error.required;
            return show;
        };

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
                var formatCellPhone = response.data["0"].INSURED_CELL_PHONE;
                $scope.profileData.INSURED_CELL_PHONE = $filter('tel')(formatCellPhone);
                deferred.resolve({success: true});
                return true,
                response;
            }, function (response) {
                $rootScope.isProcessShow(false);
                deferred.resolve({success: false});
                return false;
            });
            deferred.resolve({success: true});
        };

        if ($scope.USERID != null) {
            $scope.onLoad();
        } else {
            toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
        }

        $scope.onCancel = function () {
            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                $state.transitionTo('insuredPage.profile');
            } else {
                $state.transitionTo('inspectionPage.profile');
            }
        };

        $scope.updateProfileInfo = function (profileData) {

            if ($scope.editProfilForm.$invalid) {
                $scope.editProfilForm.$submitted = true;
            } else {
                $scope.editProfilForm.$submitted = false;
            }

            if ($scope.maxLengnthValidation != true && $scope.editProfilForm.$submitted == false) {
                $rootScope.isProcessShow(true);
                var deferred = $q.defer();

                $scope.editProfileInfoData = {

                    INSURED_FIRST_NAME: profileData.INSURED_FIRST_NAME,
                    INSURED_LAST_NAME: profileData.INSURED_LAST_NAME,
                    INSURED_CELL_PHONE: profileData.INSURED_CELL_PHONE
                };

                $rootScope.UpdatedProfileInfo = $scope.editProfileInfoData;

                var request = {
                    method: 'POST',
                    url: $rootScope.baseUrl + 'user/updateuserprofile/' + $scope.USERID,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    },
                    data: JSON.stringify($scope.editProfileInfoData)
                };

                $http(request).then(function (response) {
                    $rootScope.isProcessShow(false);

                    if (response.status == 200) {
                        toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});

                        $rootScope.$broadcast('updateProfileSuccess', true);

                        $rootScope.FirstNameToDispaly = profileData.INSURED_FIRST_NAME;
                        $rootScope.LastNameToDispaly = profileData.INSURED_LAST_NAME;
                        $rootScope.CellPhone = profileData.INSURED_CELL_PHONE;

                        $scope.onCancel();
                    }

                    deferred.resolve({success: true});
                    return true,
                    response;
                }, function (response) {
                    $rootScope.isProcessShow(false);
                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});

                    deferred.resolve({success: false});
                    return false;
                });
                deferred.resolve({success: true});
            }

        };
    }
]);