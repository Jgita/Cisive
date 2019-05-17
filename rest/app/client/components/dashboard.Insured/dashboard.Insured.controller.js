app.controller('DashboardInsuredController', [
    'toastr',
    '$q',
    'globalService',
    '$scope',
    '$state',
    '$css',
    '$rootScope',
    '_',
    'CONSTANTS',
    '$http',
    '$uibModal',
    function (toastr, $q, globalService, $scope, $state, $css, $rootScope, _, CONSTANTS, $http, $uibModal) {

        $rootScope.isProcessShow(true);
        $scope.pendingInspction = 0;
        $scope.completedInspection = 0;
        $scope.availableUserStatus = false;
        $scope.users = [];
        $scope.Win_Users = [];
        $scope.totalUsers = [];
        $scope.totalUsersWithStatus = [];
        $scope.pendingInspectionList = [];
        $scope.completedInspectionList = [];
        $rootScope.isProced = false;

        var dashboardData = {
            SITE_ID: 0
        }

        var count = 0;
        $scope.damage = 0;
        $scope.EPA = 0;
        $scope.rear = 0;
        $scope.front = 0;
        $scope.winDamage = 0;
        $scope.winCount = 0;

        $css.bind({
            href: 'rest/app/client/components/dashboard.Insured/dashboard.Insured.css'
        }, $scope);

        var header = {
            // 'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.accessToken
        };

        $scope.onLoad = function () {

            delete sessionStorage.wizardStepNo;
            delete sessionStorage.formId;
            delete sessionStorage.clientID;
            delete sessionStorage.clientIdForUploadPhoto;
            delete sessionStorage.InspectionType;
            delete sessionStorage.WinshieldID;
            delete sessionStorage.PDFID;
            delete sessionStorage.photos;
            delete sessionStorage.windshieldPhotos;
            delete sessionStorage.status;
            delete sessionStorage.randomNumber;
            delete sessionStorage.winReportNumber;
           // delete sessionStorage.stateCode;

            var deferred = $q.defer();
            globalService
                .globalServiceAPI("GET", "InsuredSummary/Dashboard/" + dashboardData.SITE_ID, null, header)
                .then(function (response) {
                    count = 0;
                    $scope.winCount = 0;
                    $rootScope.isProcessShow(false);
                    if (response.data.queryResult.length != 0 || response.data.query_result_winshield.length != 0) {
                        $scope.availableUserStatus = true;
                        $scope.users = response.data.queryResult;
                        $scope.Win_Users = response.data.query_result_winshield;

                        var counterForPendingInspection = 0;
                        var counterForCompletedInspection = 0;
                        var userId = 0;

                        for (var i = 0; i < response.data.queryResult.length; i++) {
                            $scope
                                .totalUsers
                                .push($scope.users[i]);
                            response.data.queryResult[i].photoCount = 0;
                            response.data.queryResult[i].damageCount = 0;
                            response.data.queryResult[i].rearCount = 0;
                            response.data.queryResult[i].frontCount = 0;
                            response.data.queryResult[i].EPACount = 0;

                            for (var j = 0; j < response.data.queryResultcount.length; j++) {
                                if (response.data.queryResultcount[j].INSURED_APPLICATION_ID == response.data.queryResult[i].INSURED_APPLICATION_ID) {
                                    count++;
                                    if (response.data.queryResultcount[j].PHOTO_TYPE == 'DAMAGE') {
                                        $scope.damage++;
                                        response.data.queryResult[i].damageCount = $scope.damage

                                    }
                                    if (response.data.queryResultcount[j].PHOTO_TYPE == 'REAR') {
                                        $scope.rear++;
                                        response.data.queryResult[i].rearCount = $scope.rear
                                    }
                                    if (response.data.queryResultcount[j].PHOTO_TYPE == 'FRONT') {
                                        $scope.front++;
                                        response.data.queryResult[i].frontCount = $scope.front

                                    }
                                    if (response.data.queryResultcount[j].EPA_STICKER_ID != null) {
                                        response.data.queryResult[i].EPACount = 1;
                                    }
                                    response.data.queryResult[i].photoCount = count;
                                }
                            }
                            count = 0
                            userId = response.data.queryResult[i].USERID;

                            response.data.queryResult[i].customDate = response
                                .data
                                .queryResult[i]
                                .INSPECTION_DATE
                                .slice(0, 11) + 'T' + response.data.queryResult[i].INSPECTION_TIME;

                            if (response.data.queryResult[i].PAGE < 6) {
                                $scope.pendingInspction = ++counterForPendingInspection;
                            } else {
                                $scope.completedInspection = ++counterForCompletedInspection;
                            }
                        }
                        sessionStorage.userId = userId;

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
                                        $scope.winCount++;

                                        $scope.winDamage++;
                                        response.data.query_result_winshield[k].winDamageCount = $scope.winDamage;

                                        response.data.query_result_winshield
                                        [k].winPhotoCount = $scope.winCount;

                                    }

                                }
                                $scope.winCount = 0

                                response.data.query_result_winshield[k].winCustomDate = response
                                    .data
                                    .query_result_winshield[k]
                                    .WIN_INSPECTION_DATE
                                    .slice(0, 11) + 'T' + response.data.query_result_winshield[k].WIN_INSPECTION_TIME;

                                if (response.data.query_result_winshield[k].PAGE < 3) {
                                    $scope.pendingInspction = ++counterForPendingInspection;
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

                                    delete response[index].INSURED_EMAIL;
                                    delete response[index].USER_NAME;
                                    delete response[index].WIN_INSURED_EMAIL;

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
                                        $scope.findPendingInspectionLength($scope.totalUsersWithStatus)
                                        $scope.findCompletedInspectionLength($scope.totalUsersWithStatus)
                                        $scope.showPending();
                                    })
                                if ($scope.totalUsers.YEAR != null) {
                                    $scope.year = $scope.totalUsers.YEAR;
                                } else {
                                    $scope.year = '';
                                }

                                if ($scope.totalUsers.MAKE != null) {
                                    $scope.make = $scope.totalUsers.MAKE;
                                } else {
                                    $scope.make = '';
                                }

                                if ($scope.totalUsers.MODEL != 'OTHER') {
                                    $scope.model = $scope.totalUsers.MODEL;
                                } else if ($scope.totalUsers.MODEL == 'OTHER') {
                                    $scope.model = $scope.totalUsers.MODEL_OTHER;
                                } else {
                                    $scope.model = '';
                                }

                                if ($scope.year == '' && $scope.make == '' && $scope.model == '') {
                                    $scope.model = '-';
                                }

                                if ($scope.totalUsers.WIN_YEAR != null) {
                                    $scope.winYear = $scope.totalUsers.WIN_YEAR;
                                } else {
                                    $scope.winYear = '';
                                }

                                if ($scope.totalUsers.WIN_MAKE != null) {
                                    $scope.winMake = $scope.totalUsers.WIN_MAKE;
                                } else {
                                    $scope.winMake = '';
                                }

                                if ($scope.totalUsers.WIN_MODEL != 'OTHER') {
                                    $scope.winModel = $scope.totalUsers.WIN_MODEL;
                                } else if ($scope.totalUsers.WIN_MODEL == 'OTHER') {
                                    $scope.winModel = $scope.totalUsers.WIN_MODEL_OTHER;
                                } else {
                                    $scope.winModel = '';
                                }

                                if ($scope.winYear == '' && $scope.winMake == '' && $scope.winModel == '') {
                                    $scope.winModel = '-';
                                }

                            })
                    }
                    deferred.resolve({success: true});
                }, function (error) {
                    $rootScope.isProcessShow(false);
                    if(error.status === 401){
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
                    // toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
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

        $scope.gotoWizardStep = function (stepNo, formId, inspectionType) {

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

            sessionStorage.formId = formId;
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
            if (stepNo == 1) {
                $rootScope.winFormStateValidation = {
                    pageOne: true,
                    pageTwo: false

                }
            } else if (stepNo == 2) {
                $rootScope.winFormStateValidation = {
                    pageOne: true,
                    pageTwo: true

                }
            }

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
            $scope.totalUsersWithStatus = $scope.totalUsers;
            $scope.completedInspectionList = [];
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
                $scope
                    .$apply(function () {
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
            $scope.totalUsersWithStatus = $scope.totalUsers;
            $scope.pendingInspectionList = [];
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

        $scope.sendEmail = function (type, id) {

            $rootScope.isProcessShow(true);
            var header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'bearer ' + sessionStorage.accessToken
            }
            if(type && type.toLowerCase() == "windshield") {
                var emailData = {
                    WIN_INSURED_EMAIL: sessionStorage.email,
                    WINSHIELD_ID: id
                }

                $http({
                    url: $rootScope.baseUrl + 'windShied/PdfEmail',
                    method: 'POST',
                    data: JSON.stringify(emailData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        }
                })
                .then(function (response) {
                    $rootScope.isProcessShow(false);
                    if (response.status == 200) {
                        toastr.success(CONSTANTS.inspectionReportSent, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else {
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    }
                }, function (error) {
                    $rootScope.isProcessShow(false);
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                });
            } else if(type && type.toLowerCase() == "pre-inspection"){
                var emailData = {
                    INSURED_EMAIL: sessionStorage.userDispalyName,
                    INSURED_APPLICATION_ID: id
                }

                $http({
                    url: $rootScope.baseUrl + 'InsuredSummary/PdfEmaill',
                    method: 'POST',
                    data: JSON.stringify(emailData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        }
                    })
                    .then(function (response) {
                        $rootScope.isProcessShow(false);
                        if (response.status == 200) {
                            toastr.success(CONSTANTS.inspectionReportSent, {timeOut: $rootScope.toastrTimeThreeSec})
                        } else {
                            toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                        }
                    }, function (error) {
                        $rootScope.isProcessShow(false);
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    });
            }
            
        }
    }
])