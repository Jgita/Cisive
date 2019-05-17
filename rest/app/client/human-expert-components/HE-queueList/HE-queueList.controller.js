app.controller('HAQueueListController', [
    '$scope',
    '$base64',
    '$uibModal',
    '$interval',
    '$timeout',
    '$css',
    'toastr',
    '$rootScope',
    '$state',
    '$q',
    'globalService',
    'CONSTANTS',
    '$uibModalStack',
    '$filter',
    function ($scope, $base64, $uibModal, $interval, $timeout, $css, toastr, $rootScope, $state, $q, globalService, CONSTANTS, $uibModalStack, $filter) {

        $css.bind({
            href: 'rest/app/client/human-expert-components/HE-queueList/HE-queueList.css'
        }, $scope);

        $rootScope.isProcessShow(true);
        $scope.photoViewVisiblity = true;
        $scope.lockStatus = false;
        $scope.recordId = 0;
        $scope.HEQueueList = [];
        $scope.totalHEQueueList = [];
        $scope.viewBtnEventStatus = false;

        $scope.updatedQueueList = {};
        $rootScope.disable = {};

        $scope.btnDisable = {};

        $scope.toggleBool = true;
        $scope.APIISINProgress = true;

        $rootScope.tokenVerifyAPIFaild = false;

        // extra new code
        delete sessionStorage.ID;
        delete sessionStorage.currentWorkingRow;
        var image = 'rest/assets/images/avatar.png'
        $scope.dummyImage = $base64.encode(image);

        $scope.photoViewModal = function () {
            $uibModal
                .open({
                    backdrop: 'static',
                    backdropClick: false,
                    dialogFade: false,
                    keyboard: false,
                    templateUrl: 'rest/app/client/human-expert-components/HE-photoView/HE-photoView.view.html',
                    controller: 'HEPhotoViewController'
                })
                .result
                .then(function (response) {}, function () {});
        }

        $rootScope.onLoadHE = function () {
            var DATA = {
                HE_USERID: sessionStorage.HE_USERID
            }

            $scope.queueListData = {}

            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            };

            var deferred = $q.defer();
            if (sessionStorage.HE_TOKEN) {
                $scope.APIISINProgress = true;
                globalService
                    .globalServiceAPI("POST", "humanexpert/getqueuedetials", DATA, header)
                    .then(function (response) {

                        $rootScope.isProcessShow(false);
                        $scope.queueList = response.data;
                        $scope.APIISINProgress = false;
                        if ($scope.queueList != null) {
                            $scope.total = new Promise(function (resolve, reject) {
                                var lockRowFound = false;
                                $scope.queueList = _.filter($scope.queueList, function (item) {

                                    if (item.ID == sessionStorage.currentWorkingRow) {
                                        item.IS_LOCK_STATUS = false;
                                        lockRowFound = true;
                                    }
                                    return !(item.IS_LOCK_STATUS == true),
                                    !(item.AUTO_APPROVE_STATUS == true);
                                });
                                if (lockRowFound == false) {
                                    $rootScope.$broadcast('closePhotoViewModal', true);
                                    delete sessionStorage.checkStatus;
                                    delete sessionStorage.currentWorkingRow;
                                }
                                resolve($scope.queueList);
                            })
                        }

                        $scope
                            .total
                            .then(function (response) {
                                $scope.totalQueueList = response;
                                $scope.$apply(function () {
                                    if ($scope.totalQueueList == null) {
                                        $scope.nullData = true
                                    } else {
                                        $scope.nullData = false;
                                        $scope.$watch(function () {
                                            return $scope.updatedQueueList;
                                        }, function (newVal, oldVal) {
                                            var newValIndex = 0;
                                            for (var key in newVal) {
                                                if (newVal[key] === true) 
                                                    newValIndex = parseInt(key);
                                                }
                                            for (i = 0; i < $scope.totalQueueList.length; i++) {
                                                if ($scope.totalQueueList[i].ID == newValIndex) {

                                                    $rootScope.disable[$scope.totalQueueList[i].ID] = sessionStorage.checkStatus
                                                        ? false
                                                        : true;

                                                    if ($scope.totalQueueList[i].IS_LOCK_STATUS == false) {
                                                        // enable rows
                                                        $rootScope.disable[$scope.totalQueueList[i].ID] = false;

                                                    } else if ($scope.totalQueueList[i].IS_LOCK_STATUS) {
                                                        // disable rows
                                                        $rootScope.disable[$scope.totalQueueList[i].ID] = true;

                                                    } else {
                                                        $rootScope.disable[$scope.totalQueueList[i].ID] = false;
                                                    }

                                                } else if ($scope.totalQueueList[i].IS_LOCK_STATUS == false) {
                                                    $rootScope.disable[$scope.totalQueueList[i].ID] = false;
                                                } else {

                                                    $rootScope.disable[$scope.totalQueueList[i].ID] = sessionStorage.checkStatus
                                                        ? true
                                                        : false;
                                                }

                                            }
                                        }, true);
                                    }
                                })
                            })
                    }),
                function (error) {
                    $rootScope.isProcessShow(false);
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    $scope.dataLoading = false;
                    $scope.APIISINProgress = true;
                    deferred.resolve({success: false});
                }
            }
        }

        if ($rootScope.logoutExecute == false) {
            $rootScope.onLoadHE();
        }

        $interval(function () {

            if ($scope.queueList != undefined && !$scope.APIISINProgress && $scope.queueList != 'UnAuthorize' && $rootScope.logoutExecute == false) {
                $rootScope.onLoadHE();
            }
        }, $rootScope.toastrTimeThreeSec);

        $scope.lockRowAPICall = function (data, header, checkStatus, item) {

            globalService
                .globalServiceAPI("POST", "humanexpert/lockrow", data, header)
                .then(function (response) {
                    if (response.data <= 0) { // other HE already working on it
                        $rootScope.disable[item.ID] = true;
                        $scope.updatedQueueList[item.ID] = false
                        delete sessionStorage.currentWorkingRow;
                        $scope.setDisabled(item.ID, item);
                        toastr.error(CONSTANTS.HEPhotoPicked, {
                            timeOut: $rootScope.toastrErrorFiveSec,
                            closeButton: true
                        });
                    } else {
                        if (!checkStatus) {
                            delete sessionStorage.currentWorkingRow;
                        }
                        $scope.setDisabled(item.ID, item);
                        $rootScope.disable[item.ID] = false;
                    }

                }),
            function (error) {
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                deferred.resolve({success: false});
            }

        }

        $scope.selectedCheckboxStatus = function (item, checkStatus) {
            sessionStorage.currentWorkingRow = item.ID;
            sessionStorage.checkStatus = checkStatus;

            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            };

            var data = {
                HE_ID: sessionStorage.HE_USERID,
                IS_LOCK_STATUS: checkStatus,
                ID: item.ID
            }

            if (!checkStatus) {
                delete sessionStorage.currentWorkingRow;
                delete sessionStorage.checkStatus;
                $scope.lockRowAPICall(data, header, checkStatus, item);
            } else {
                sessionStorage.currentWorkingRow = item.ID;
                $scope.lockRowAPICall(data, header, checkStatus, item);
            }
        }

        $scope.viewBtn = function (item) {
            sessionStorage.ID = item.ID;
            sessionStorage.HE_PHOTO_ID = item.HE_PHOTO_ID;
            $scope.viewBtnEventStatus = true;

            $rootScope.photoType = item
                .PhotoReviewMessage
                .trim();

            // if ($rootScope.photoType.toUpperCase() == 'EPASTICKER') {
            // $rootScope.photoType = 'EPA STICKER'; }
        }

        $scope.setDisabled = function (ID, item, checkStatus) {
            if (sessionStorage.currentWorkingRow !== null && sessionStorage.currentWorkingRow !== undefined) {

                if (sessionStorage.currentWorkingRow == ID) {

                    return false;

                } else {
                    return true;
                }

            } else {
                return true;
            }
        }

        $scope.$on('checkBoxModel', function (event, result) {
            $scope.onLoadBool = result;

            if ($scope.onLoadBool === true) {
                $rootScope.disable[sessionStorage.currentWorkingRow] = false;
                delete sessionStorage.currentWorkingRow;
            }

        });

        $scope.multiLogUser = function () {

            if (sessionStorage.userDispalyName) {

                $scope.userNameL = sessionStorage.userDispalyName;
                $scope.lowerCaseUserName = $scope
                    .userNameL
                    .toLowerCase();
                var header = {
                    "Content-Type": "application/json"
                };

                var data = {
                    username: $scope.lowerCaseUserName,
                    token: sessionStorage.HE_TOKEN,
                    humag_expert_flag: 'HE',
                    siteid: 0
                };

                globalService
                    .globalSessionCheck("POST", "token_verification", data, header)
                    .then(function (response) {
                        if (response.data.Result == "unauthorised") {
                            $uibModalStack.dismissAll();
                            if (!$rootScope.refAPIFaild) {
                                $rootScope.logoutExecute = true;
                                $uibModal.open({
                                    backdrop: 'static',
                                    backdropClick: false,
                                    dialogFade: false,
                                    keyboard: false,
                                    templateUrl: 'rest/app/client/human-expert-components/HE-formProcessing-model/HE-formProcessin' +
                                            'g-model.html',
                                    controller: 'HE-formProcessingController',
                                    resolve: {
                                        items: function () {
                                            return 'You are Already Logged in';
                                        }
                                    }
                                    })
                                    .result
                                    .then(function () {}, function () {});
                            }
                        } else if (response.data.Result == "fail") {

                            if (!$rootScope.refAPIFaild) {
                                $rootScope.logoutExecute = true;
                                $rootScope.refAPIFaild = true;
                                $rootScope.ServerErrorModel();
                            }

                        }
                    }, function () {
                        toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});

                        if (!$rootScope.refAPIFaild) {
                            $rootScope.logoutExecute = true;
                            $rootScope.refAPIFaild = true;
                            $rootScope.ServerErrorModel();
                        }
                    });
            }

        }

        $interval(function () {

            if ($rootScope.logoutExecute == false) {
                if ($rootScope.tokenSaveSucess) {
                    $scope.multiLogUser();
                }

            }
        }, $rootScope.toastrTimeTwentySec);

        /* Disable the Browser Back Button */
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    }
]);