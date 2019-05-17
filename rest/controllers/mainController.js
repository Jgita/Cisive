app.controller("mainController", [
    '$scope',
    '$state',
    '$location',
    '$timeout',
    '$rootScope',
    'toastrConfig',
    '$q',
    'globalService',
    'Idle',
    '$uibModal',
    'toastr',
    '$uibModalStack',
    '$http',
    function ($scope, $state, $location, $timeout, $rootScope, toastrConfig, $q, globalService, Idle, $uibModal, toastr, $uibModalStack, $http) {

        $rootScope.baseUrl = window._config.apiUrl;
        $rootScope.remainingDamagePhotoLimit = 15;
        $rootScope.remainingWinFullPhotoLimit = 3;
        $rootScope.remainingWinDamagePhotoLimit = 6;
        $rootScope.toastrTimeThreeSec = 3000;
        $rootScope.toastrErrorFiveSec = 5000;
        $rootScope.sessionExpireTime = 3300000; // 55 min timer for refresh token
        $rootScope.toastrTimeTwentySec = 20000;
        $rootScope.imageMaxLimitToUpload = 15728640;
        $rootScope.IdleModel = false;
        $rootScope.isPDFProced = true;

        $rootScope.publicKey = window._config.captchaKey;

        toastrConfig.preventOpenDuplicates = true;
        $rootScope.toastrCloseFlag = false;

        $rootScope.pdfViewRouteCheck = function () {
            if ($rootScope.authVIN === '1') {
                $location.path('/VINRedirected');
            } else if (sessionStorage.accessToken && !$rootScope.authVIN) {
                $location.path("/pdfView");
            } else if (sessionStorage.accessToken && $rootScope.authVIN === '0') {
                $location.path("/pdfView");
            } else if (!sessionStorage.accessToken && $rootScope.authVIN === '0') {
                $location.path("/login/redirected");
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
                        // This is to trigger the localStorage once the page is reload
                        localStorage.accessToken = response.data.access_token;
                        localStorage.refreshToken = response.data.refresh_token;
                        localStorage.hitKey = 'HitKey';
                        // Delete the information in localStorage
                        $timeout(function () {
                            delete localStorage.accessToken;
                            delete localStorage.refreshToken;
                            delete localStorage.hitKey;
                        }, 1000);

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
                            token: sessionStorage.accessToken,
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
                            if ($rootScope.toastrCloseFlag == false) {
                                $scope.tokenRefresh();
                            }

                        }, $rootScope.sessionExpireTime);

                    } else {
                        toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                    }
                    deferred.resolve({success: true});
                }, function (response) {
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
                    deferred.resolve({success: false});
                    return false;
                });
            deferred.resolve({success: true});
        }

        //Human Expert Refresh token functionality 
        $scope.HETokenRefresh = function () {

            var deferred = $q.defer();
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            }

            var dataValue = {
                refresh_token: sessionStorage.HE_refreshToken
            }

            globalService
                .globalServiceAPI("POST", "user/RefreshToken", dataValue, header)
                .then(function (response) {
                    if (response.data.access_token) {

                        sessionStorage.HE_TOKEN = response.data.access_token;
                        sessionStorage.HE_refreshToken = response.data.refresh_token;

                        //saving token in python
                        var userNameL = response.data.userdisplayname;
                        var lowerCaseUserName = userNameL.toLowerCase();

                        if (sessionStorage.siteId) {
                            $scope.siteidAI = sessionStorage.siteId
                        } else {
                            $scope.siteidAI = '0';
                        }

                        var data = {
                            username: lowerCaseUserName,
                            token: sessionStorage.accessToken,
                            siteid: $scope.siteidAI
                        }

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
                            });

                        $timeout(function () {
                            $scope.HETokenRefresh();
                        }, $rootScope.sessionExpireTime);

                    } else {
                        toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});

                    }
                    deferred.resolve({success: true});
                }, function (response) {
                    if ($rootScope.IdleModel != true) {
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
                    deferred.resolve({success: false});
                    return false;
                });
            deferred.resolve({success: true});
        }
        
   // start idle timer of 30 min if application is inactive 
        $rootScope.start = function () {
            closeModals();
            Idle.watch();
            $scope.started = true;
        };

        $scope.started = false;

        function closeModals() {
            if ($scope.warning) {
                $scope
                    .warning
                    .close();
                $scope.warning = null;
            }
        }

        $scope
            .$on('IdleStart', function () {
                // When Idle first verify token using token_verification
                if (sessionStorage.accessToken) {
                    $scope.userNameL = sessionStorage.userDispalyName;
                    if ($scope.userNameL) {
                        $scope.lowerCaseUserName = $scope
                            .userNameL
                            .toLowerCase();
                    }

                    var header = {
                        "Content-Type": "application/json"
                    };
                    if (sessionStorage.siteId) {
                        $scope.siteidAI = sessionStorage.siteId
                    } else {
                        $scope.siteidAI = '0';
                    }
                    var data = {
                        username: $scope.lowerCaseUserName,
                        token: sessionStorage.accessToken,
                        humag_expert_flag: 'Not_human_expert',
                        siteid: $scope.siteidAI
                    };

                    globalService
                        .globalSessionCheck("POST", "token_verification", data, header)
                        .then(function (response) {
                            if (response.data.Result == "unauthorised") {
                                $rootScope.allReadyLogin();
                                localStorage.clear();
                                sessionStorage.clear();
                            } else if (response.data.Result == "fail" && $rootScope.IdleModel != true) {
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

                            } else {
                                $rootScope.IdleModel = true;
                                $scope.warning = $uibModal.open({
                                    backdrop: true,
                                    backdropClick: true,
                                    dialogFade: false,
                                    keyboard: true,
                                    size: 'md',
                                    templateUrl: 'rest/app/client/components/idle-model/idle-model.view.html',
                                    controller: 'idleModelController'
                                })
                                $scope
                                    .warning
                                    .result
                                    .then(function () {});
                            }
                        }, function () {});
                }

            });

        $scope.$on('IdleEnd', function () {
            closeModals();
        });

        $scope.$on('IdleTimeout', function () {
            closeModals();
            if ($rootScope.ok) {
                $rootScope.ok();
            }
            if ($rootScope.yes) {
                $rootScope.yes();
            }

            $rootScope.logout('Logout');
            $state.transitionTo("login");
            $rootScope.toastrCloseFlag = true;
            $rootScope.IdleModel = false;
            $uibModalStack.dismissAll();
            toastr.error(CONSTANTS.sessionExpired, {
                closeButton: true,
                timeOut: 0,
                tapToDismiss: false
            })
        });

        $scope.stop = function () {
            closeModals();
            Idle.unwatch();
            $scope.started = false;
        };

    // End

        $rootScope.photosUploadedByUser = {
            rear: null,
            front: null,
            damage: [],
            EPA: null
        };

        $rootScope.winPhotosUploadedByUser = {
            fullPhoto: [],
            damage: []
        };

        $rootScope.formStateValidation = {
            pageOne: false,
            pageTwo: false,
            pageThree: false,
            pageFour: false,
            pageFive: false
        };

        $rootScope.winFormStateValidation = {
            pageOne: false,
            pageTwo: false
        };

        $scope.onCancel = function () {
            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() === "insured") {
                if (typeof window.orientation != 'undefined') {
                    //"its mobile browser";
                    $state.transitionTo('dashboardInsured', {
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });
                } else {
                    //"it is web broser"
                    $state.transitionTo('insuredPage.dashboardInsured');
                }
            } else {
                if (typeof window.orientation != 'undefined') {
                    //"its mobile browser";
                    $state.transitionTo('dashboard', {
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });
                } else {
                    //"it is web broser"
                    $state.transitionTo("inspectionPage.dashboard");
                }
            }
        };

        $scope.isActive = function (viewLocation) {
            var route = "/" + viewLocation
                .split(".")
                .join("/");
            return route === $location.path();
        };

        $rootScope.ProcessCount = 0;
        $rootScope.isProcessShow = function (isShow) {
            if (isShow) {
                $rootScope.ProcessCount++;
                $rootScope.isLoader = true;
            } else if (!isShow) {
                $rootScope.ProcessCount--;
            } else {
                $rootScope.isLoader = false;
                $rootScope.ProcessCount = 0;
            }
            if ($rootScope.ProcessCount <= 0) {
                $rootScope.isLoader = false;
                $rootScope.ProcessCount = 0;
            }
        };

        var vm = this;
        var locationPath = $location.path();

        $rootScope.logout = function (title) {
            if (title && title == "Logout") {
                sessionStorage.clear();
                localStorage.clear();
                delete $rootScope.sessionData;
                $rootScope.isProced = false;
                $rootScope.isPDFProced = false;
                localStorage.setItem("isLogout", "1");
            }
        };

        $rootScope.sessionTransfer = function () {
            // transfers sessionStorage from one tab to another
            var sessionStorage_transfer = function (event) {
                if (!event) {
                    event = window.event;
                } // ie suq
                if (!event.newValue) 
                    return; // do nothing if no value to work with
                
                if (event.key && event.key == "getSessionStorage") {
                    // another tab asked for the sessionStorage -> send it
                    localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
                    // the other tab should now have it, so we're done with it.
                    localStorage.removeItem("sessionStorage"); // <- could do short timeout as well.
                } else if (event.key == "sessionStorage" && !sessionStorage.length) {
                    // another tab sent data <- get it
                    var data = JSON.parse(event.newValue);
                    for (var key in data) {
                        sessionStorage.setItem(key, data[key]);
                    }
                    showSessionStorage();
                }

                if (event.key && event.key == "hitKey") {
                    sessionStorage.accessToken = localStorage.accessToken;
                    sessionStorage.refreshToken = localStorage.refreshToken;
                }
                if (event.key === "isLogout") {

                    sessionStorage.clear();
                    $location.path("/login");
                }
            };

            /**
             * If URL is of humanExpert then don't transfer session
             * else transfer the session if present
             */
            if ($location.path().indexOf("humanExpert") != -1) {
                if (!sessionStorage.HE_TOKEN) {
                    $location.path("/humanExpertLogin");
                } else {
                    $location.path("/humanExpert/queueList");
                }
            } else {
                // listen for changes to localStorage

                if (window.addEventListener) {
                    window.addEventListener("storage", sessionStorage_transfer, false);
                } else {
                    window.attachEvent("onstorage", sessionStorage_transfer);
                }

            }

            // Ask other tabs for session storage (this is ONLY to trigger event)
            if (!sessionStorage.length) {
                localStorage.setItem("getSessionStorage", "getSession");
                localStorage.removeItem("getSessionStorage", "getSession");
            }

            function showSessionStorage() {
                $rootScope.sessionData = sessionStorage
                    ? sessionStorage
                    : false;

                if (sessionStorage) {
                    if (sessionStorage.accessToken) {

                        $timeout(function () {
                            $scope.tokenRefresh();
                        }, $rootScope.sessionExpireTime);
                        //3600000 for 60 sec 3300000 for 55 min
                    }

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
                    }

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

                        if (($scope.loginUser === "Insured" || sessionStorage.userType.toLowerCase() == "insured")) {

                            if (locationPath.indexOf("pdfView") != -1 || locationPath.indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                                $rootScope.pdfViewRouteCheck();
                            } else {
                                delete sessionStorage.clientID;
                                $state.transitionTo("insuredPage.newInspection");
                            }

                        } else {
                            if (locationPath.indexOf("pdfView") != -1 || locationPath.indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                                $rootScope.pdfViewRouteCheck();
                            } else {
                                if (vm.siteid != undefined) {
                                    sessionStorage.siteId = vm.siteid;
                                    localStorage.siteId = sessionStorage.siteId;
                                } else {
                                    sessionStorage.siteId = $rootScope.sessionData.siteId;
                                    localStorage.siteId = $rootScope.sessionData.siteId;
                                }
                                $state.transitionTo("inspectionPage.newInspection");
                            }

                        }

                    }
                    /**
                     * If URL from Email is hit on browser,
                     * checks if browser url contains pdfView of redirected ==>> showPDF
                     * else redirect to ==>> login/redirected
                     */

                    if (locationPath.indexOf("pdfView") != -1 || locationPath.indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
                        $rootScope.pdfViewRouteCheck();
                    }

                    deferred.resolve({success: true});
                }
            }
        };

        $rootScope.sessionTransfer();

        $rootScope.sessionLogout = function () {
            if (sessionStorage.accessToken) {
                $scope.userNameL = sessionStorage.userDispalyName;
                if ($scope.userNameL) {
                    $scope.lowerCaseUserName = $scope
                        .userNameL
                        .toLowerCase();
                }
                var header = {
                    "Content-Type": "application/json"
                };
                if (sessionStorage.siteId) {
                    $scope.siteidAI = sessionStorage.siteId
                } else {
                    $scope.siteidAI = '0';
                }
                var data = {
                    username: $scope.lowerCaseUserName,
                    token: sessionStorage.accessToken,
                    humag_expert_flag: 'Not_human_expert',
                    siteid: $scope.siteidAI
                };

                globalService
                    .globalSessionCheck("POST", "token_verification", data, header)
                    .then(function (response) {
                        if (response.data.Result == "unauthorised") {
                            $rootScope.allReadyLogin();
                            localStorage.clear();
                            sessionStorage.clear();
                        } else if (response.data.Result == "fail" && $rootScope.IdleModel != true) {
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
                    }, function () {});
            }
        };

        $rootScope.sessionLogoutComplete = function (url) {
            if (sessionStorage.accessToken) {
                var userNameL = sessionStorage.userDispalyName;
                var lowerCaseUserName = userNameL.toLowerCase();
                var header = {
                    "Content-Type": "application/json"
                };
                if (sessionStorage.siteId) {
                    $scope.siteidAI = sessionStorage.siteId
                } else {
                    $scope.siteidAI = '0';
                }
                var data = {
                    username: lowerCaseUserName,
                    token: sessionStorage.accessToken,
                    humag_expert_flag: 'Not_human_expert',
                    siteid: $scope.siteidAI
                };

                globalService
                    .globalSessionCheck("POST", "token_verification", data, header)
                    .then(function (response) {
                        if (response.data.Result == "unauthorised") {
                            $rootScope.allReadyLogin();
                            localStorage.clear();
                            sessionStorage.clear();
                        } else {
                            var index = url.indexOf("&VWV");
                            if (index == -1) {
                                index = url.length
                            } else {
                                index = index;
                            }
                            var CompletInspectionPDFURL = url.substring(0, index);
                            var indexOfRN = CompletInspectionPDFURL.indexOf("?RN=");
                            var indexOfType = CompletInspectionPDFURL.indexOf("&Type=");

                            var reportNumber = CompletInspectionPDFURL.substring(indexOfRN + 4, indexOfType);

                            var inspectionType = CompletInspectionPDFURL.substring(indexOfType + 6, index)

                            var defer = $q.defer();

                            var header = {
                                'Content-Type': 'application/pdf',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            if (inspectionType == 'P' && reportNumber) {
                                var siteId = "0";
                                if (sessionStorage.siteId) 
                                    siteId = sessionStorage.siteId;
                                $http({
                                        method: 'GET',
                                        url: $rootScope.baseUrl + 'InsuredSummary/GetPdf/' + reportNumber + '/' + siteId,
                                        responseType: 'arraybuffer',
                                        headers: header
                                    })
                                    .then(function onSuccess(response) {

                                        if (response.status == 200) {

                                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                                                var blob = new Blob([response.data]);
                                                window
                                                    .navigator
                                                    .msSaveOrOpenBlob(blob, reportNumber + 'InsuredSummaryDetail.pdf');
                                            } else {

                                                var file = new Blob([response.data], {type: 'application/pdf'});
                                                var fileURL = URL.createObjectURL(file);

                                                window.open(fileURL);

                                            }
                                        } else if (response.status == 501) {
                                            toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                                        }
                                        defer.resolve({success: true});
                                    })
                                    .catch(function onError() {
                                        toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                                        defer.resolve({success: false});
                                    });
                            } else if (inspectionType == 'W' && reportNumber) {
                                var siteId = "0";
                                if (sessionStorage.siteId) 
                                    siteId = sessionStorage.siteId;
                                
                                $http({
                                        method: 'GET',
                                        url: $rootScope.baseUrl + 'windShied/GetPdf/' + reportNumber + '/' + siteId,
                                        responseType: 'arraybuffer',
                                        headers: header
                                    })
                                    .then(function onSuccess(response) {

                                        if (response.status == 200) {
                                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                                                var blob = new Blob([response.data]);
                                                window
                                                    .navigator
                                                    .msSaveOrOpenBlob(blob, reportNumber + 'InsuredSummaryDetail.pdf');
                                            } else {

                                                var file = new Blob([response.data], {type: 'application/pdf'});
                                                var fileURL = URL.createObjectURL(file);

                                                window.open(fileURL);

                                            }

                                        } else if (response.status == 501) {
                                            toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                                        }
                                        defer.resolve({success: true});
                                    })
                                    .catch(function onError() {
                                        toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                                        defer.resolve({success: false});
                                    });
                            } else {
                                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                                defer.resolve({success: false});
                            }

                            /* Disable the Browser Back Button */
                            history.pushState(null, null, document.URL);
                            window.addEventListener('popstate', function () {
                                history.pushState(null, null, document.URL);
                            });

                        }
                    }, function () {});
            }
        };

        /**
        * If URL from Email is hit on browser Initially ,
        * checks if browser url contains pdfView of redirected ==>> showPDF
        * else redirect to ==>> login/redirected
        */
        if (locationPath.indexOf("pdfView") != -1 || locationPath.indexOf("redirected") != -1 || locationPath.indexOf("VINRedirected") != -1) {
            var searchObject = $location.search();
            $rootScope.RN = searchObject.RN;
            $rootScope.Type = searchObject.Type;
            $rootScope.authVIN = searchObject.VWV;
            $rootScope.emailDetails = searchObject.emaildetails;

            $rootScope.pdfViewRouteCheck();
        } else if ($location.path().indexOf("humanExpert") != -1) {
            if (!sessionStorage.HE_TOKEN) {
                $location.path("/humanExpertLogin");
            } else {
                $location.path("/humanExpert/queueList");
            }
        }

        $rootScope.allReadyLogin = function () {
            if ($rootScope.IdleModel != true) {
                $uibModal
                    .open({
                        backdrop: "static",
                        backdropClick: false,
                        dialogFade: false,
                        keyboard: false,
                        templateUrl: "rest/app/client/components/formProcessing-model/formProcessing-model.html",
                        controller: "formProcessingController"
                    })
                    .result
                    .then(function () {}, function () {});
            }
        };

        // Bind the $locationChangeSuccess event on the //rootScope, so that we don't
        // need to bind in induvidual controllers.

        $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
            $rootScope.newLocation = $location.path();
        });

        $rootScope.$watch(function (event) {
            return $location.path()
        }, function (newLocation, oldLocation) {
            if ($rootScope.newLocation === newLocation) {
                if ($rootScope.ok) {
                    $rootScope.ok();
                }
                if ($rootScope.yes) {
                    $rootScope.yes();
                }
                if ($rootScope.closeModalOnBack) {
                    $rootScope.closeModalOnBack();
                }
                history.pushState(null, null, location.href);
                window.onpopstate = function () {
                    history.go(1);
                };
                // run a function or perform a reload
            }

            /*
                Back button when newLocation is wizards form
                "/home/clientId/accessToken/userType/page/userName/siteID/InspectionType/randomNumber/userId"
            */
            if ($rootScope.newLocation && $rootScope.newLocation.indexOf("/home/clientId/accessToken/userType/page/userName/siteID/InspectionType/randomNu" +
                    "mber/userId/refreshToken/siteLocation/siteName/IsDevice") > -1) {
                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == "insured") {
                    if ($rootScope.wizardWelcomeDropDown != true) {
                        $state.transitionTo("insuredPage.dashboardInsured");
                    }
                } else {
                    $state.transitionTo("inspectionPage.dashboard");
                }
            }

            if (oldLocation && oldLocation.indexOf("/home/clientId/accessToken/userType/page/userName/siteID/InspectionType/randomNu" +
                    "mber/userId/refreshToken/siteLocation/siteName/IsDevice") > -1) {
                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == "insured") {
                    if ($rootScope.wizardWelcomeDropDown != true) {
                        $state.transitionTo("insuredPage.dashboardInsured");
                    }
                } else {
                    $state.transitionTo("inspectionPage.dashboard");
                }
            }

        });

// checking if Browser refresh button click 
        if (window.performance) {}
        if (performance.navigation.type == 1) {

            if (sessionStorage.accessToken) {
                $rootScope.start();
            }

            if (sessionStorage.accessToken) {
                $scope.tokenRefresh();
            }

            if (sessionStorage.HE_TOKEN) {
                $scope.HETokenRefresh();
            }
        } else {}
    }
]);