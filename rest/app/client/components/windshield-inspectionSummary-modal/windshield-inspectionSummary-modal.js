app.controller('windshieldInspectionSummaryController', [
    '$scope',
    '$http',
    'toastr',
    'globalService',
    '$q',
    '$rootScope',
    '$state',
    '$css',
    '$uibModalInstance',
    '$uibModal',
    'CONSTANTS',
    function ($scope, $http, toastr, globalService, $q, $rootScope, $state, $css, $uibModalInstance, $uibModal, CONSTANTS) {

        $css.bind({
            href: 'rest/app/client/components/inspectionSummary-modal/inspectionSummary-modal.css'
        }, $scope);
        $scope.emailToModel = sessionStorage.userDispalyName;
        $scope.winViewPDFFromPath = $rootScope.winPDFPath;
        $scope.IsMobileView = false;
        $scope.IsWEBView = true;
        $scope.token = sessionStorage.accessToken;
        $scope.refreshToken = sessionStorage.refreshToken;

        $scope.emailModel = function () {
            sessionStorage.emailFromDashboard = false;
            $uibModalInstance.close();
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
        }

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.IsEmailPopup = false
        } else {
            $scope.IsEmailPopup = true
        }

        $rootScope.ok = function () {
            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                $uibModalInstance.close();
                if (typeof window.orientation != 'undefined') {
                    //"its mobile browser" $state.transitionTo('insuredPage.dashboardInsured');

                    $state.transitionTo('dashboardInsured', {
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });

                } else {
                    //"it is web broser"
                    $state.transitionTo('insuredPage.dashboardInsured');
                }
            } else {
                $uibModalInstance.close();
                if (typeof window.orientation != 'undefined') {
                    //"its mobile browser"  $state.transitionTo('inspectionPage.dashboard');

                    $state.transitionTo('dashboard', {
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });

                } else {
                    //"it is web broser"
                    $state.transitionTo('inspectionPage.dashboard');
                }

            }

        };

        if (sessionStorage.WinshieldID) {
            $scope.WINSHIELD_ID = sessionStorage.WinshieldID || $rootScope.windIDForEmail;
        } else {
            $scope.WINSHIELD_ID = sessionStorage.clientID || $rootScope.windIDForEmail;
        }

        if (typeof window.orientation != 'undefined') {
            if (sessionStorage.winReportNumber != null) {
                $scope.IsMobileView = true;
                $scope.IsWEBView = false;
                $scope.mobileViewReportNumber = sessionStorage.winReportNumber
            } else {
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                $scope.downloadPdfLoader = false;
            }
        }

        $scope.downLoadPDF = function () {
            $scope.downloadPdfLoader = true;
            if (sessionStorage.winReportNumber != null) {
                var defer = $q.defer();
                var header = {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }

                var siteId = "0";
                if(sessionStorage.siteId)
                    siteId=  sessionStorage.siteId;

                $http({
                        method: 'GET',
                        url: $rootScope.baseUrl + "windShied/GetPdf/" + sessionStorage.winReportNumber + '/' + siteId,
                        responseType: 'blob',
                        headers: header
                    }).then(function onSuccess(response) {
                    if (response.status == 200) {
                        $scope.downloadPdfLoader = false;
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            let blob = new Blob([response.data]);
                            navigator.msSaveBlob(blob, 'CARCO WINDSHIELD INSPECTION.PDF');
                        } else {
                            const url = window
                                .URL
                                .createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'CARCO WINDSHIELD INSPECTION.PDF');
                            document
                                .body
                                .appendChild(link);
                            link.click();
                            document
                                .body
                                .removeChild(link);
                        }

                    } else if (response.status == 501) {
                        $scope.downloadPdfLoader = false;
                        toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                    }
                    defer.resolve({success: true});
                })
                    .catch(function onError(response) {
                        $scope.downloadPdfLoader = false;
                        toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                        defer.resolve({success: false});
                    });

            } else {
                $scope.downloadPdfLoader = false;
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
            }

        }

        $scope.viewPDF = function () {
            $scope.viewPDFLoader = true;
            if (typeof window.orientation != 'undefined') {
                if (sessionStorage.winReportNumber != null) {
                    $scope.viewPDFLoader = false;

                    $state.transitionTo('viewMobilePdf', {
                        'reportNumber': sessionStorage.winReportNumber,
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });
                } else {
                    $scope.viewPDFLoader = false;
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                }

            } else {
                if (sessionStorage.winReportNumber != null) {
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/pdf',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    var siteId = "0";
                    if(sessionStorage.siteId)
                        siteId=  sessionStorage.siteId;

                    $http({
                            method: 'GET',
                            url: $rootScope.baseUrl + "windShied/GetPdf/" + sessionStorage.winReportNumber + '/' + siteId,
                            responseType: 'arraybuffer',
                            headers: header
                        }).then(function onSuccess(response, data, status, headers) {

                        if (response.status == 200) {
                            $scope.viewPDFLoader = false;
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                                let blob = new Blob([response.data]);
                                window
                                    .navigator
                                    .msSaveOrOpenBlob(blob, 'CARCO WINDSHIELD INSPECTION.PDF');
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
                        .catch(function onError(response) {
                            $scope.viewPDFLoader = false;
                            toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                            defer.resolve({success: false});
                        });
                } else {
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    $scope.viewPDFLoader = false;
                }
            }

        }

        $scope.sendEmail = function () {
            $scope.dataLoading = true;

            var emailData = {
                WIN_INSURED_EMAIL: sessionStorage.userDispalyName,
                WINSHIELD_ID: $scope.WINSHIELD_ID
            }

            var header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'bearer ' + sessionStorage.accessToken
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

                    $scope.dataLoading = false;
                    if (response.status == 200) {
                        toastr.success(CONSTANTS.inspectionReportSent, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else {
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    }
                }, function (error) {
                    $scope.dataLoading = false;

                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});

                });
        }

    }
]);