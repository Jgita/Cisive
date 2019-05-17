app.controller('tokenExpireModelController', [
    '$scope',
    '$uibModal',
    '$timeout',
    'toastr',
    '$q',
    '$rootScope',
    '$state',
    '$css',
    '$uibModalInstance',
    'globalService',
    'Idle',
    'Keepalive',
    function ($scope, $uibModal, $timeout, toastr, $q, $rootScope, $state, $css, $uibModalInstance, globalService, Idle, Keepalive) {

        $css.bind({
            href: 'rest/app/client/components/alert-model/alert-model.css'
        }, $scope);

        $scope.$on('IdleStart', function () {
            $uibModalInstance.close();
            toastr.error("Your Session Expired! Please Re-Login", {
                closeButton: true,
                timeOut: 0,
                tapToDismiss: false
            });

        });

        $scope.$on('IdleWarn', function (e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is
            // considered timed out the countdown arg is the number of seconds remaining
            // until then. you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch() $scope.no();

        });

        $scope.$on('IdleTimeout', function () {});

        $scope.$on('IdleEnd', function () {});

        $scope.start = function () {
            Idle.watch();
        };

        $scope.$on('callTokenRef', function (event, result) {

            if (result) {

                $scope.yes();
            }

        });

        $scope.yes = function () {
            var deferred = $q.defer();
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.accessToken
            };

            var dataValue = {
                refresh_token: sessionStorage.refreshToken
            };

            globalService
                .globalServiceAPI("POST", "user/RefreshToken", dataValue, header)
                .then(function (response) {
                    if (response.data.access_token) {

                        $rootScope.accessToken = response.data.access_token;
                        sessionStorage.accessToken = $rootScope.accessToken;
                        sessionStorage.refreshToken = response.data.refresh_token;

                        //saving token in python
                        $scope.userNameL = response.data.userdisplayname;
                        $scope.lowerCaseUserName = $scope
                            .userNameL
                            .toLowerCase();

                        if (sessionStorage.siteId) {
                            $scope.siteidAI = sessionStorage.siteId
                        } else {
                            $scope.siteidAI = '0';
                        }

                        var data = {
                            username: $scope.lowerCaseUserName,
                            token: response.data.access_token,
                            siteid: $scope.siteidAI
                        }

                        globalService
                            .globalSessionCheck("POST", "token_saving_on_login", data, header)
                            .then(function (response) {
                                if (response.data.Result == 'fail') {
                                    toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                                }
                            }, function (error) {});

                        $uibModalInstance.close();

                        $timeout(function () {
                            $scope.yes();
                        }, $rootScope.sessionExpireTime);

                    } else {
                        toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                        $uibModalInstance.close();
                    }
                    deferred.resolve({success: true});
                }, function (response) {
                    $uibModalInstance.close();
                    if ($rootScope.IdleModel != true) {
                        $uibModal.open({
                            backdrop: 'static',
                            backdropClick: false,
                            dialogFade: false,
                            keyboard: false,
                            size: 'md',
                            templateUrl: 'rest/app/client/components/photoMissing-model/photoMissing-model.view.html',
                            controller: 'photoMissingModelController',
                            resolve: {
                                items: function () {
                                    return 'It seems server is not responding, Please try after some time.';
                                }
                            }
                            })
                            .result
                            .then(function (response) {}, function () {});
                    }
                    // toastr.error(CONSTANTS.somethingWentWrong, { timeOut:
                    // $rootScope.toastrTimeThreeSec });
                    deferred.resolve({success: false});
                    return false;
                });
            deferred.resolve({success: true});
        };
    }
]);