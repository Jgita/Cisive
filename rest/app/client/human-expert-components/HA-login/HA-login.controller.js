app.controller('HALoginController', [
    '$scope',
    '$timeout',
    '$uibModal',
    '$css',
    'toastr',
    '$rootScope',
    '$state',
    '$q',
    '$http',
    'AuthenticationService',
    'globalService',
    'CONSTANTS',
    function ($scope, $timeout, $uibModal, $css, toastr, $rootScope, $state, $q, $http, AuthenticationService, globalService, CONSTANTS) {

        $css.bind({
            href: 'rest/app/client/human-expert-components/HA-login/HA-login.css'
        }, $scope);

        sessionStorage.clear();

        $rootScope.refAPIFaild = false;

        var vm = this;
        vm.login = login;

        (function initController() {
            AuthenticationService.ClearCredentials();
        })();

        $scope.paste = function () {
            toastr.warning(CONSTANTS.copyPasteNotAllowed, {timeOut: $rootScope.toastrTimeThreeSec});
        }

        function login() {

            vm.dataLoading = true;

            var dataValue = {
                USERROLEID: 3,
                HE_USER_NAME: vm.HE_USER_NAME,
                HE_PASSWORD: vm.HE_PASSWORD
            }

            var deferred = $q.defer();
            var header = {
                'Content-Type': 'application/json'
            }

            /**
             * Encryption Code Starts here
             */
            var getRSAKey = new Promise(function (resolve, reject) {
                globalService
                    .globalServiceAPI("GET", "user/GetPublicKey", header)
                    .then(function (response) {
                        if (response.status == 200) {
                            resolve(response);
                        } else {
                            reject(true);
                        }
                    }, function (response) {

                        vm.dataLoading = false;
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                        return false;
                    })
            });

            getRSAKey.then(function (response) {

                dataValue.UId = response.data.UId;

                var rsa = new RSAKey();
                rsa.setPublic(response.data.Modulus, response.data.Exponent);
                var res = rsa.encrypt(vm.HE_PASSWORD);
                dataValue.HE_PASSWORD = res
                    ? hex2b64(res)
                    : vm.HE_PASSWORD;

                globalService
                    .globalServiceAPI("POST", "user/LoginUser", dataValue, header)
                    .then(function (response) {
                        if (response.data.access_token) {

                            $timeout(function () {
                                $rootScope.refreshTokenStatus = true;
                                if (!$rootScope.logoutExecute) {
                                    $scope.HETokenRefresh();
                                }
                            }, $rootScope.sessionExpireTime);
                        }

                        //saving token in python
                        $scope.userNameL = response.data.userdisplayname;
                        $scope.lowerCaseUserName = $scope
                            .userNameL
                            .toLowerCase()

                        var data = {
                            username: $scope.lowerCaseUserName,
                            token: response.data.access_token,
                            siteid: '0'
                        }

                        if (response) {
                            $rootScope.tokenSaveSucess = false;
                            globalService
                                .globalSessionCheck("POST", "token_saving_on_login", data, header)
                                .then(function (response) {
                                    if (response.status == 200) {
                                        $rootScope.tokenSaveSucess = true;
                                    } else {
                                        $rootScope.tokenSaveSucess = false;
                                    }

                                    if (response.data.Result == 'fail') {
                                        $rootScope.tokenSaveSucess = false
                                        toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                                    } else {
                                        $rootScope.tokenSaveSucess = true;
                                    }
                                }, function (error) {
                                    $rootScope.tokenSaveSucess = false;
                                })
                        }

                        vm.dataLoading = false;
                        sessionStorage.HE_USERID = response.data.HE_USERID;
                        sessionStorage.HE_TOKEN = response.data.access_token;
                        sessionStorage.HE_refreshToken = response.data.refresh_token;
                        $state.transitionTo('humanExpert.queueList');

                        sessionStorage.isAuthenticated = true;
                        sessionStorage.userDispalyName = response.data.userdisplayname;
                        localStorage.isAuthenticated = true;
                        deferred.resolve({success: true});
                        return true,
                        response;
                    }, function (response) {
                        vm.dataLoading = true;
                        $timeout(function () {
                            vm.dataLoading = false;
                            toastr.error(CONSTANTS.incorrectCredential, {timeOut: $rootScope.toastrTimeThreeSec});
                        }, 2000)

                        deferred.resolve({success: false});
                        return false;

                    });

                deferred.resolve({success: true});

            })

        };

        $scope.HETokenRefresh = function () {

            var deferred = $q.defer();
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            }

            var dataValue = {
                refresh_token: sessionStorage.HE_refreshToken,
                client_id: sessionStorage.HE_USERID
            }
            $rootScope.tokenSaveSucess = false;
            globalService
                .globalServiceAPI("POST", "user/RefreshToken", dataValue, header)
                .then(function (response) {
                    if (response.data.access_token) {

                        sessionStorage.HE_TOKEN = response.data.access_token;
                        sessionStorage.HE_refreshToken = response.data.refresh_token;

                        //saving token in python
                        sessionStorage.userDispalyName = response.data.userdisplayname;
                        $scope.userNameL = response.data.userdisplayname;
                        $scope.lowerCaseUserName = $scope
                            .userNameL
                            .toLowerCase()

                        var data = {
                            username: $scope.lowerCaseUserName,
                            token: response.data.access_token,
                            siteid: '0'
                        }

                        globalService
                            .globalSessionCheck("POST", "token_saving_on_login", data, header)
                            .then(function (response) {
                                if (response.status == 200) {
                                    $rootScope.tokenSaveSucess = true;
                                } else {
                                    $rootScope.tokenSaveSucess = false
                                }

                                if (response.data.Result == 'fail') {
                                    $rootScope.tokenSaveSucess = false
                                    toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                                } else {
                                    $rootScope.tokenSaveSucess = true;
                                }

                            }, function (error) {
                                if (!$rootScope.logoutExecute) {
                                    $rootScope.tokenSaveSucess = false
                                    $rootScope.refAPIFaild = true;
                                    $rootScope.logoutExecute = true;
                                    $rootScope.ServerErrorModel();
                                }

                            });

                        $timeout(function () {
                            $rootScope.refreshTokenStatus = true;
                            if (!$rootScope.logoutExecute) {
                                $scope.HETokenRefresh();
                            }
                        }, $rootScope.sessionExpireTime);

                    } else {
                        //  $rootScope.refAPIFaild = true;
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    }
                    deferred.resolve({success: true});
                }, function (response) {

                    if (!$rootScope.logoutExecute) {
                        $rootScope.refAPIFaild = true;
                        $rootScope.tokenSaveSucess = false;
                        $rootScope.logoutExecute = true;
                        $rootScope.ServerErrorModel();
                    }
                    //      toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut:
                    // $rootScope.toastrTimeThreeSec});
                    deferred.resolve({success: false});
                    return false;
                });
            deferred.resolve({success: true});
        }

        $rootScope.ServerErrorModel = function () {

            $uibModal.open({
                backdrop: 'static',
                backdropClick: false,
                dialogFade: false,
                keyboard: false,
                size: 'md',
                templateUrl: 'rest/app/client/human-expert-components/HE-formProcessing-model/HE-formProcessin' +
                        'g-model.html',
                controller: 'HE-formProcessingController',
                resolve: {
                    items: function () {
                        return 'It seems server is not responding, Please try after some time.';
                    }
                }
                })
                .result
                .then(function (response) {}, function () {});

        }

    }
]);
