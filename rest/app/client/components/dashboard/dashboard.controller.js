app.controller('DashboardController', [
    '$scope',
    '$base64',
    '$rootScope',
    '$q',
    '$state',
    '$css',
    'globalService',
    'toastr',
    '_',
    'CONSTANTS',
    '$uibModal',
    function ($scope, $base64, $rootScope, $q, $state, $css, globalService, toastr, _, CONSTANTS, $uibModal) {
        $rootScope.isProcessShow(true);
        $scope.users = []
        $scope.Win_Users = [];
        $scope.totalUsers = [];
        $scope.totalUsersWithStatus = [];
        $scope.pendingInspectionList = [];
        $scope.completedInspectionList = [];
        $scope.completedInspection = 0;
        $scope.pendingInspection = 0;
        $scope.availableUserStatus = false;
        $scope.numberToDisplay = 5;
        $rootScope.QRReTakeVisibility = false;
        var count = 0;
        $scope.damage = 0;
        $scope.EPA = 0;
        $scope.rear = 0;
        $scope.front = 0;
        $scope.winDamage = 0;
        var winCount = 0;
     // delete sessionStorage.stateCode;
        $rootScope.isProced = false;
        $rootScope.chkboxDisable = false;

        $rootScope.photosUploadedByUser = {
            rear: null,
            front: null,
            damage: [],
            EPA: null
        }

        $css.bind({
            href: 'rest/app/client/components/dashboard/dashboard.css'
        }, $scope);

        var dashboardData = {
            SITE_ID: sessionStorage.siteId
        }

        var header = {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.accessToken
        };

        $scope.onLoad = function () {

            delete sessionStorage.wizardStepNo;
            delete sessionStorage.clientID;
            delete sessionStorage.clientIdForUploadPhoto;
            delete sessionStorage.InspectionType;
            delete sessionStorage.WinshieldID;
            delete sessionStorage.QR_Retake;
            delete ReportNumber;
            delete sessionStorage.PDFID;
            delete sessionStorage.photos;
            delete sessionStorage.windshieldPhotos;
            delete sessionStorage.status;
            delete sessionStorage.randomNumber;
            delete sessionStorage.winReportNumber;
            delete sessionStorage.reportNumber;

            var deferred = $q.defer();

            globalService
                .globalServiceAPI("GET", "InsuredSummary/Dashboard/" + dashboardData.SITE_ID, null, header)
                .then(function (response) {
                    $rootScope.isProcessShow(false);
                    count = 0;
                    winCount = 0;

                    if (response.data.query_result.length != 0 || response.data.query_result_winshield.length != 0) {

                        $scope.availableUserStatus = true;
                        $rootScope.QRReTakeVisibility = $scope.availableUserStatus;
                        $scope.users = response.data.query_result;
                        $scope.Win_Users = response.data.query_result_winshield;

                        var counterForPendingInspection = 0;
                        var counterForCompletedInspection = 0;

                        for (var i = 0; i < response.data.query_result.length; i++) {
                            $scope
                                .totalUsers
                                .push($scope.users[i]);
                            response.data.query_result
                            [i].photoCount = 0;

                            response.data.query_result[i].damageCount = 0;
                            response.data.query_result[i].rearCount = 0;
                            response.data.query_result[i].frontCount = 0;
                            response.data.query_result[i].EPACount = 0;

                            for (var j = 0; j < response.data.queryResultcount.length; j++) {
                                if (response.data.queryResultcount[j].INSURED_APPLICATION_ID == response.data.query_result[i].INSURED_APPLICATION_ID) {
                                    count++;
                                    if (response.data.queryResultcount[j].Photo_PHOTO_TYPE == 'DAMAGE') {
                                        $scope.damage++;
                                        response.data.query_result[i].damageCount = $scope.damage;
                                    }
                                    if (response.data.queryResultcount[j].Photo_PHOTO_TYPE == 'REAR') {
                                        $scope.rear++;
                                        response.data.query_result[i].rearCount = $scope.rear;
                                    }
                                    if (response.data.queryResultcount[j].Photo_PHOTO_TYPE == 'FRONT') {
                                        $scope.front++;
                                        response.data.query_result[i].frontCount = $scope.front;
                                    }
                                    if (response.data.queryResultcount[j].EPA_STICKER_ID != null) {
                                        response.data.query_result[i].EPACount = 1;
                                    }
                                    response.data.query_result
                                    [i].photoCount = count;
                                }
                            }
                            count = 0
                            userId = response.data.query_result[i].USERID;
                            response.data.query_result[i].customDate = response
                                .data
                                .query_result[i]
                                .INSPECTION_DATE
                                .slice(0, 11) + 'T' + response.data.query_result[i].INSPECTION_TIME;

                            if (response.data.query_result[i].PAGE < 6) {
                                $scope.pendingInspection = ++counterForPendingInspection;
                            } else {
                                $scope.completedInspection = ++counterForCompletedInspection;
                            }
                        }
                        $scope.total = new Promise(function (resolve, reject) {
                            for (var k = 0; k < response.data.query_result_winshield.length; k++) {
                                $scope
                                    .totalUsers
                                    .push($scope.Win_Users[k]);
                                response.data.query_result_winshield
                                [k].winPhotoCount = 0;
                                response.data.query_result_winshield[k].winDamageCount = 0;

                                for (var l = 0; l < response.data.query_winshield_count.length; l++) {
                                    if (response.data.query_winshield_count[l].WINSHIELD_ID == response.data.query_result_winshield[k].WinshieldID) {
                                        winCount++;
                                        $scope.winDamage++;
                                        response.data.query_result_winshield[k].winDamageCount = $scope.winDamage;
                                        response.data.query_result_winshield
                                        [k].winPhotoCount = winCount;
                                    }
                                }
                                winCount = 0
                                response.data.query_result_winshield[k].winCustomDate = response
                                    .data
                                    .query_result_winshield[k]
                                    .WIN_INSPECTION_DATE
                                    .slice(0, 11) + 'T' + response.data.query_result_winshield[k].WIN_INSPECTION_TIME;

                                if (response.data.query_result_winshield[k].PAGE < 3) {
                                    $scope.pendingInspection = ++counterForPendingInspection;
                                } else {
                                    $scope.completedInspection = ++counterForCompletedInspection;
                                }
                            }
                            resolve($scope.totalUsers)
                        });

                        $scope
                            .total
                            .then(function (response) {
                                for (var index = 0; index < response.length; index++) {
                                    if (response[index].customDate !== undefined) {
                                        response[index].date = new Date(response[index].customDate);
                                    } else if (response[index].winCustomDate) {
                                        response[index].date = new Date(response[index].winCustomDate);
                                    }
                                }
                                $scope
                                    .$apply(function () {
                                        $scope.totalUsers = _.sortBy(response, function (o) {
                                            return o.date;
                                        });
                                        $scope
                                            .totalUsers
                                            .reverse();

                                        $scope.totalUsersWithStatus = $scope.totalUsers;
                                        $scope.findPendingInspectionLength($scope.totalUsersWithStatus);
                                        $scope.findCompletedInspectionLength($scope.totalUsersWithStatus);
                                        $scope.showPending();
                                    })
                            })
                    }
                    deferred.resolve({success: true});
                }, function (error) {
                    $rootScope.isProcessShow(false);
                    if(error.status === 401) {
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
                                    return 'It seems server is not responding. Please log in again.';
                                }
                            }
                            })
                            .result
                            .then(function (response) {}, function () {});
                    } else {
                         toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    }
                   
                    $scope.dataLoading = false;
                    deferred.resolve({success: false});
                });
        }
        $scope.onLoad();

        $scope.errorOcc = function () {
            toastr.error(CONSTANTS.tryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
        }

        $scope.winErrorOcc = function () {
            toastr.error(CONSTANTS.tryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
        }

        $scope.sort = {
            sortingOrder: 'name',
            reverse: false
        };

        $scope.gotoWizardStep = function (stepNo, clientID, inspectionType) {
            if (stepNo == 1) {
                $rootScope.formStateValidation = {
                    pageOne: true,
                    pageTwo: false,
                    pageThree: false,
                    pageFour: false,
                    pageFive: false
                }
            } else if (stepNo == 2) {
                $rootScope.formStateValidation = {
                    pageOne: true,
                    pageTwo: true,
                    pageThree: false,
                    pageFour: false,
                    pageFive: false
                }

            } else if (stepNo == 3) {
                $rootScope.formStateValidation = {
                    pageOne: true,
                    pageTwo: true,
                    pageThree: true,
                    pageFour: false,
                    pageFive: false
                }

            } else if (stepNo == 4) {
                $rootScope.formStateValidation = {
                    pageOne: true,
                    pageTwo: true,
                    pageThree: true,
                    pageFour: true,
                    pageFive: false
                }

            } else if (stepNo == 5) {
                $rootScope.formStateValidation = {
                    pageOne: true,
                    pageTwo: true,
                    pageThree: true,
                    pageFour: true,
                    pageFive: true
                }

            }

            if (stepNo == 6) {
                stepNo = 5;
            }

            if (clientID != null && clientID != undefined) {
                sessionStorage.clientID = clientID;
            }

            sessionStorage.InspectionType = inspectionType;
            sessionStorage.status = 'pending';

            if (stepNo != null && stepNo > 0) {
                sessionStorage.wizardStepNo = stepNo;
                $state.transitionTo('home', {
                    'clientId': 'clientId',
                    'accessToken': 'accessToken',
                    'userType': 'userType',
                    'page': 'page',
                    'userName': 'userName',
                    'siteID': 'siteID',
                    'InspectionType': 'InspectionType',
                    'randomNumber': 'randomNumber',
                    'userId': 'userId',
                    'refreshToken': 'refreshToken',
                    'siteLocation': 'siteLocation',
                    'siteName': 'siteName',
                    'IsDevice':'IsDevice'
                });

            } else {}
        }

        $scope.gotoWindshieldWizardStep = function (stepNo, WinshieldID, inspectionType) {
            if (stepNo == 3) {
                stepNo = 2;
            }
            sessionStorage.WinshieldID = WinshieldID;
            sessionStorage.InspectionType = inspectionType;
            if (stepNo != null && stepNo > 0) {
                sessionStorage.wizardStepNo = stepNo;
                $state.transitionTo('windshield', {
                    'clientId': 'clientId',
                    'accessToken': 'accessToken',
                    'userType': 'userType',
                    'page': 'page',
                    'userName': 'userName',
                    'siteID': 'siteID',
                    'InspectionType': 'InspectionType',
                    'randomNumber': 'randomNumber',
                    'userId': 'userId',
                    'refreshToken': 'refreshToken',
                    'siteLocation': 'siteLocation',
                    'siteName': 'siteName',
                    'IsDevice':'IsDevice'
                });

            } else {}
        }

        $scope.windshieldInspectionStatus = function (PAGE) {

            if (PAGE != 3) {
                return true;
            } else {
                return false;
            }
        }

        $scope.inspectionStatus = function (PAGE) {
            if (PAGE != 6) {
                return true;
            } else {
                return false;
            }

        }

        $scope.showCompleted = function () {
            $rootScope.sessionLogout();
            $scope.actionType = 'View / Email Report';
            $scope.activeClassShowCompleted = true;
            $scope.activeClassShowPending = false;
            $scope.viewReortText = true;
            $scope.completedInspectionList = [];
            $scope.totalUsersWithStatus = $scope.totalUsers;

            let newArray = new Promise(function (resolve, reject) {
                for (var i = 0; i < $scope.totalUsersWithStatus.length; i++) {
                    if ($scope.totalUsersWithStatus[i].PDF_PATH !== null && $scope.totalUsersWithStatus[i].PDF_PATH !== undefined && $scope.totalUsersWithStatus[i].PAGE == 6) {
                        $scope
                            .completedInspectionList
                            .push($scope.totalUsersWithStatus[i]);
                    }

                    if ($scope.totalUsersWithStatus[i].WIN_PDF_PATH !== null && $scope.totalUsersWithStatus[i].WIN_PDF_PATH !== undefined && $scope.totalUsersWithStatus[i].PAGE == 3) {
                        $scope
                            .completedInspectionList
                            .push($scope.totalUsersWithStatus[i]);
                    }
                }
                return resolve($scope.completedInspectionList);
            });

            newArray.then(function (response) {
                $scope.completedInspectionListCount = response.length;
                $scope.$apply(function () {
                    $scope.totalUsersWithStatus = response;
                    $scope.availableUserStatus = $scope.totalUsersWithStatus.length == 0
                        ? false
                        : true
                })
            })
        }

        $scope.showPending = function () {
            $rootScope.sessionLogout();
            $scope.actionType = 'Click Icon to Proceed with Inspection';
            $scope.activeClassShowCompleted = false;
            $scope.activeClassShowPending = true;
            $scope.viewReortText = false;
            $scope.pendingInspectionList = [];
            $scope.totalUsersWithStatus = $scope.totalUsers;

            let newArray = new Promise(function (resolve, reject) {
                for (var i = 0; i < $scope.totalUsersWithStatus.length; i++) {
                    if ($scope.totalUsersWithStatus[i].PDF_PATH == null && $scope.totalUsersWithStatus[i].PDF_PATH !== undefined && $scope.totalUsersWithStatus[i].PAGE < 6) {
                        $scope
                            .pendingInspectionList
                            .push($scope.totalUsersWithStatus[i]);
                    }

                    if ($scope.totalUsersWithStatus[i].WIN_PDF_PATH == null && $scope.totalUsersWithStatus[i].WIN_PDF_PATH !== undefined && $scope.totalUsersWithStatus[i].PAGE < 3) {
                        $scope
                            .pendingInspectionList
                            .push($scope.totalUsersWithStatus[i]);
                    }
                }
                return resolve($scope.pendingInspectionList);
            });

            newArray.then(function (response) {
                $scope
                    .$apply(function () {
                        $scope.totalUsersWithStatus = response;
                        $scope.availableUserStatus = $scope.totalUsersWithStatus.length == 0
                            ? false
                            : true
                    })

            })

        }

        $scope.findPendingInspectionLength = function (totalInspection) {
            let newArray = new Promise(function (resolve, reject) {
                for (var i = 0; i < totalInspection.length; i++) {
                    if (totalInspection[i].PDF_PATH == null && totalInspection[i].PDF_PATH !== undefined && totalInspection[i].PAGE < 6) {
                        $scope
                            .pendingInspectionList
                            .push(totalInspection[i]);
                    }

                    if (totalInspection[i].WIN_PDF_PATH == null && totalInspection[i].WIN_PDF_PATH !== undefined && totalInspection[i].PAGE < 3) {
                        $scope
                            .pendingInspectionList
                            .push(totalInspection[i]);
                    }
                }
                return resolve($scope.pendingInspectionList);
            });

            newArray.then(function (response) {
                $scope
                    .$apply(function () {
                        $scope.pendingInspectionListCount = response.length;
                    })
            })
        }

        $scope.findCompletedInspectionLength = function (totalInspection) {
            let newArray = new Promise(function (resolve, reject) {
                for (var i = 0; i < totalInspection.length; i++) {
                    if (totalInspection[i].PDF_PATH !== null && totalInspection[i].PDF_PATH !== undefined && totalInspection[i].PAGE == 6) {
                        $scope
                            .completedInspectionList
                            .push(totalInspection[i]);
                    }

                    if (totalInspection[i].WIN_PDF_PATH !== null && totalInspection[i].WIN_PDF_PATH !== undefined && totalInspection[i].PAGE == 3) {
                        $scope
                            .completedInspectionList
                            .push(totalInspection[i]);
                    }
                }
                return resolve($scope.completedInspectionList);
            });

            newArray.then(function (response) {
                $scope
                    .$apply(function () {
                        $scope.completedInspectionListCount = response.length;
                    })
            })
        }
        //  $rootScope.sessionLogout();
        sessionStorage.emailFromDashboard = false;
        $scope.sendEmailInspector = function(type, id) {
            //$uibModalInstance.close();
            sessionStorage.emailFromDashboard = true;
            if(type && type.toLowerCase() == "windshield") {
                sessionStorage.WINSHIELD_ID = id;
                $uibModal
                    .open({
                        backdrop: 'static',
                        backdropClick: false,
                        dialogFade: false,
                        keyboard: false,
                        templateUrl: 'rest/app/client/components/windshieldEmail-model/windshieldEmail-model.html',
                        controller: 'winEmailController'
                    })
                    .result
                    .then(function () {}, function () {});
            } else if(type && type.toLowerCase() == "pre-inspection") {
                sessionStorage.INSURED_APPLICATION_ID = id;
                $uibModal
                    .open({
                        backdrop: 'static',
                        backdropClick: false,
                        dialogFade: false,
                        keyboard: false,
                        templateUrl: 'rest/app/client/components/inspectorEmail-model/inspectorEmail-model.html',
                        controller: 'inspectionEmailController'
                    })
                    .result
                    .then(function () {}, function () {});     
            }
       
        }
    }
])