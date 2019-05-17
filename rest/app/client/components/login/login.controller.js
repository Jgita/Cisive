app.controller('LoginController', [
    '$scope',
    '$timeout',
    '$css',
    'toastr',
    '$rootScope',
    '$state',
    '$q',
    '$uibModal',
    'AuthenticationService',
    'globalService',
    '$location',
    'CONSTANTS',
    function ($scope, $timeout, $css, toastr, $rootScope, $state, $q, $uibModal, AuthenticationService, globalService, $location, CONSTANTS) {
        $css.bind({
            href: 'rest/app/client/components/login/login.css'
        }, $scope);

        var vm = this;
        vm.login = login;
        $rootScope.isProcessShow(false);
        var INSURED = "insured";
        var locationPath = $location.path();
        

        /* Here we have checked if session is available or not ...  */
        if (sessionStorage) {

            $scope.userNameL = sessionStorage.userDispalyName;
            if ($scope.userNameL) {
                $scope.lowerCaseUserName = $scope
                    .userNameL
                    .toLowerCase();
            }

            if (sessionStorage.siteId) {
                $scope.siteidAI = sessionStorage.siteId
            } else {
                $scope.siteidAI = '0';
            }

            var data = {
                username: $scope.lowerCaseUserName,
                token: sessionStorage.accessToken,
                siteid: $scope.siteidAI
            };

            var deferred = $q.defer();
            var header = {
                "Content-Type": "application/json"
            };

            if (sessionStorage.accessToken) {
                globalService
                    .globalSessionCheck("POST", "token_saving_on_login", data, header)
                    .then(function (response) {

                        if (response.data.Result == 'fail') {
                            toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                        }
                    }, function (error) {});

                vm.dataLoading = false;
                if ($scope.loginUser === "Insured" || (sessionStorage.userType && sessionStorage.userType.toLowerCase() == "insured")) {
                    if ($location.path().indexOf("pdfView") != -1 || $location.path().indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                        $rootScope.pdfViewRouteCheck();
                    } else {
                        $state.transitionTo("insuredPage.newInspection");
                    }
                } else {
                    if ($location.path().indexOf("pdfView") != -1 || $location.path().indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                        $rootScope.pdfViewRouteCheck();
                    } else {
                        $state.transitionTo("inspectionPage.newInspection");
                    }
                }

            }
            /**
             * If URL from Email is hit on browser,
             * checks if browser url contains pdfView of redirected ==>> showPDF
             * else redirect to ==>> login/redirected
             */
            if ($location.path().indexOf("pdfView") != -1 || $location.path().indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                $rootScope.pdfViewRouteCheck();
            }

            deferred.resolve({success: true});
        }

        $scope.paste = function () {
            toastr.warning(CONSTANTS.copyPasteNotAllowed, {timeOut: $rootScope.toastrTimeThreeSec});
        }

        function login() {

            if (!localStorage.userName) {
                vm.dataLoading = true;
            }

            if (!localStorage.userName) {

                if ($scope.loginUser && $scope.loginUser.toLowerCase() === INSURED) {

                    // var insuredPassword = vm.PASSWORD; var secret =
                    // window._config.hashPasswordSecretKey; var encrypted =
                    // CryptoJS.HmacSHA1(insuredPassword, secret); var insuredHasedPassword =
                    // encrypted.toString();

                    var dataValue = {
                        grant_type: 'password',
                        username: vm.USER_NAME,
                        password: vm.PASSWORD
                    }
                } else {

                    var dataValue = {
                        grant_type: 'password',
                        username: vm.USER_NAME_INSPECTOR,
                        password: vm.PASSWORD_INSPECTOR,
                        SITE_ID: vm
                            .siteid
                            .toUpperCase()
                    }
                }

            } else {
                if (localStorage.userType && localStorage.userType.toLowerCase() === INSURED) {
                    var dataValue = {
                        grant_type: 'password',
                        username: '',
                        password: ''
                    }
                } else {
                    var dataValue = {
                        grant_type: 'password',
                        username: '',
                        password: '',
                        SITE_ID: ''
                    }
                }

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

                if ($scope.loginUser && $scope.loginUser.toLowerCase() === INSURED) {
                    var res = rsa.encrypt(vm.PASSWORD);
                    dataValue.password = res
                        ? hex2b64(res)
                        : vm.PASSWORD;

                } else {
                    var res_inspector = rsa.encrypt(vm.PASSWORD_INSPECTOR);
                    dataValue.password = res_inspector
                        ? hex2b64(res_inspector)
                        : vm.PASSWORD_INSPECTOR;
                }

                globalService
                    .globalServiceAPI("POST", "user/LoginUser", dataValue, header)
                    .then(function (response) {

                        if (response.data.access_token) {
                            $rootScope.start();
                            $timeout(function () {
                                if ($rootScope.isPDFProced !== false) {
                                    $scope.tokenRefresh();
                                }
                            }, $rootScope.sessionExpireTime);
                            //3600000 for 60 sec 3300000 for 55 min
                        }

                        sessionStorage.FirstNameToDispaly = response.data.FirstName;
                        sessionStorage.LastNameToDispaly = response.data.LastName;
                        sessionStorage.IsWindEnable = response.data.IsWindEnable;
                        sessionStorage.CellPhone = response.data.CellPhone;
                        sessionStorage.email = response.data.Email;

                        sessionStorage.IsAllowPhotoSelect = response.data.IsAllowPhotoSelect;

                        //saving token in python
                        $scope.userNameL = response.data.userdisplayname;
                        $scope.lowerCaseUserName = $scope
                            .userNameL
                            .toLowerCase()

                        if (vm.siteid) {
                            $scope.siteidAI = vm
                                .siteid
                                .toUpperCase();
                        } else {
                            $scope.siteidAI = '0';
                        }

                        var data = {
                            username: $scope.lowerCaseUserName,
                            token: response.data.access_token,
                            siteid: $scope.siteidAI
                        }

                        if (response) {
                            var AIStatus = new Promise(function (resolve, reject) {
                                globalService
                                    .globalSessionCheck("POST", "token_saving_on_login", data, header)
                                    .then(function (resp) {

                                        if (resp.data.Result == 'fail') {
                                            toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                                            reject(false)
                                        } else {
                                            resolve(true);
                                        }
                                        vm.dataLoading = false;

                                    }, function (error) {
                                        vm.dataLoading = false;
                                        reject(false)

                                    })
                            });

                            AIStatus.then(function (AIResp) {

                                vm.dataLoading = false;
                                $scope.AIsuccess = AIResp;
                                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() === INSURED) {
                                    if (sessionStorage.IsWindEnable != 'false') {
                                        sessionStorage.InspectionType = 'Windshield'
                                    } else {
                                        sessionStorage.InspectionType = 'Pre-Inspection'
                                    }
                                }

                                if (sessionStorage.IsWindEnable == 'false') {
                                    sessionStorage.IsWindShieldVisible = 'No'
                                } else {
                                    sessionStorage.IsWindShieldVisible = 'Yes'
                                }

                                if (!localStorage.userName) {
                                    vm.dataLoading = false;
                                }

                                if (response.data) {
                                    $rootScope.clientID = response.data["as:client_id"];
                                }

                                if (response.data.userdisplayname) {
                                    $rootScope.userDispalyName = response.data.userdisplayname;
                                    sessionStorage.userDispalyName = $rootScope.userDispalyName;
                                }

                                if (response.data.access_token) {
                                    $rootScope.accessToken = response.data.access_token;
                                    sessionStorage.accessToken = $rootScope.accessToken;
                                    sessionStorage.refreshToken = response.data.refresh_token;
                                    vm.dataLoading = false;
                                    if (($scope.loginUser && $scope.loginUser.toLowerCase() === INSURED)) {
                                        sessionStorage.userType = 'Insured';
                                        localStorage.userType = 'Insured';
                                        sessionStorage.userId = response.data.User_Id;
                                        delete sessionStorage.clientID;
                                        /**
                                       * After login
                                       * This block of code checks
                                       * if browser path contains pdfView ==>> show PDF
                                       * else redirect newInspection
                                       */
                                        if ($rootScope.authVIN === '1') {
                                            $state.transitionTo('VINRedirected');
                                        } else if (sessionStorage.accessToken && $rootScope.authVIN === '0' && $rootScope.isPDFProced != false) {
                                            $state.transitionTo('pdfView');
                                        } else if (!sessionStorage.accessToken && $rootScope.authVIN === '0') {
                                            $state.transitionTo('login.redirected');
                                        } else {
                                            $state.transitionTo('insuredPage.newInspection');
                                        }
                                    } else {
                                        if (vm.siteid != undefined) {
                                            sessionStorage.siteId = vm
                                                .siteid
                                                .toUpperCase();
                                            localStorage.siteId = sessionStorage.siteId;
                                        } else {
                                            sessionStorage.siteId = dataValue.SITE_ID;
                                            localStorage.siteId = dataValue.SITE_ID;
                                        }
                                        sessionStorage.siteLocation = response.data.siteLocation || '';
                                        sessionStorage.siteName = response.data.siteName || '';
                                        sessionStorage.userType = 'Inspector';
                                        localStorage.userType = 'Inspector';
                                        /**
                                       * After login
                                       * This block of code checks
                                       * if browser path contains pdfView ==>> show PDF
                                       * else redirect newInspection
                                       */
                                        if ($rootScope.authVIN === '1') {
                                            $state.transitionTo('VINRedirected');
                                        } else if (sessionStorage.accessToken && $rootScope.authVIN === '0' && $rootScope.isPDFProced != false) {
                                            $state.transitionTo('pdfView');
                                        } else if (!sessionStorage.accessToken && $rootScope.authVIN === '0') {
                                            $state.transitionTo('login.redirected');
                                        } else {
                                            $state.transitionTo('inspectionPage.newInspection');
                                        }
                                    }
                                }
                                sessionStorage.isAuthenticated = true;
                                localStorage.isAuthenticated = true;

                                deferred.resolve({success: true});
                            })
                                .catch(function (err) {

                                    vm.dataLoading = false;
                                    toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                                });

                        }

                    })
                    .catch(function () {
                        localStorage.clear();
                        vm.dataLoading = true;
                        $timeout(function () {
                            vm.dataLoading = false;
                            toastr.error(CONSTANTS.incorrectCredential, {timeOut: $rootScope.toastrTimeThreeSec});
                        }, 2000)

                        deferred.resolve({success: false});
                        return false;
                    })
            })
        }

        $scope.setActiveTab = function (userName) {

            $scope.loginUser = userName;
            if ($scope.loginUser && $scope.loginUser.toLowerCase() === INSURED) {
                $scope.InsuredLoginForm = true;
                $scope.InspectorLoginForm = false;
                delete sessionStorage.siteId;
            } else if ($scope.loginUser && $scope.loginUser.toLowerCase() === 'inspector') {
                $scope.InspectorLoginForm = true;
                $scope.InsuredLoginForm = false;
            }
        }

        $scope.tokenRefresh = function () {

            var deferred = $q.defer();
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.accessToken
            }

            var dataValue = {
                refresh_token: sessionStorage.refreshToken
            }

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

                        $timeout(function () {
                            if ($rootScope.isPDFProced !== false) {
                                $scope.tokenRefresh();
                            }
                        }, $rootScope.sessionExpireTime);

                    } else {
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});

                    }
                    deferred.resolve({success: true});
                }, function (response) {

                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    deferred.resolve({success: false});
                    return false;
                });
            deferred.resolve({success: true});
        }

        /* Disable the Browser Back Button */
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    }
]);
