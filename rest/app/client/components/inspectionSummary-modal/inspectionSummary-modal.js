app.controller('inspectionSummaryController', [
    '$scope',
    '$uibModal',
    '$q',
    'toastr',
    '$window',
    '$state',
    '$css',
    '$uibModalInstance',
    '$http',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $uibModal, $q, toastr, $window, $state, $css, $uibModalInstance, $http, $rootScope, CONSTANTS) {

        $css.bind({
            href: 'rest/app/client/components/inspectionSummary-modal/inspectionSummary-modal.css'
        }, $scope);

        $scope.emailToModel = sessionStorage.userDispalyName;
        $scope.viewPDFFromPath = $rootScope.PDFpath;
        $scope.token = sessionStorage.accessToken;
        $scope.refreshToken = sessionStorage.refreshToken;
        $scope.IsMobileView = false;
        $scope.IsWEBView = true;

        $scope.emailModel = function () {
            sessionStorage.emailFromDashboard = false;
            $uibModalInstance.close();
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

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.IsEmailPopup = false;
        } else {
            $scope.IsEmailPopup = true;
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

        if (sessionStorage.formId) {
            $scope.INSURED_APPLICATION_ID = sessionStorage.formId || $rootScope.InsurdIDForEmail;
        } else {
            $scope.INSURED_APPLICATION_ID = sessionStorage.clientID || $rootScope.InsurdIDForEmail;
        }

        if (typeof window.orientation != 'undefined') {
            if (sessionStorage.reportNumber != null) {
                $scope.IsMobileView = true;
                $scope.IsWEBView = false;
                $scope.mobileViewReportNumber = sessionStorage.reportNumber
            } else {
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                $scope.disableValue = true;
                $scope.downloadPdfLoader = false;
            }
        }

        $scope.downloadPdf = function () {
            $scope.downloadPdfLoader = true;

            if (sessionStorage.reportNumber != null) {

                $scope.disableValue = false;
                var defer = $q.defer();

                var header = {
                    'Content-Type': 'application/pdf',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }

                var siteId = "0";
                if(sessionStorage.siteId)
                   siteId = sessionStorage.siteId;

                $http({
                        method: 'GET',
                        url: $rootScope.baseUrl + "InsuredSummary/GetPdf/" + sessionStorage.reportNumber + '/' + siteId,
                        responseType: 'blob',
                        headers: header
                    }).then(function onSuccess(response, data, status, headers) {

                    if (response.status == 200) {
                        $scope.downloadPdfLoader = false;

                        // Only works for IE10 and up, including Edge
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {

                            let blob = new Blob([response.data]);
                            navigator.msSaveBlob(blob, 'CARCO PRE-INSURANCE INSPECTION.PDF');
                        } else {
                            const url = window
                                .URL
                                .createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'CARCO PRE-INSURANCE INSPECTION.PDF');
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
                $scope.disableValue = true;
            }

        }

        $scope.viewPDF = function () {
            $scope.viewPDFLoader = true;
            if (typeof window.orientation != 'undefined') {
                if (sessionStorage.reportNumber != null) {
                    $scope.viewPDFLoader = false;

                    $state.transitionTo('viewMobilePdf', {
                        'reportNumber': sessionStorage.reportNumber,
                        'accessToken': sessionStorage.accessToken,
                        'refreshToken': sessionStorage.refreshToken
                    });
                } else {
                    $scope.viewPDFLoader = false;
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    $scope.disableValue = true;
                }

            } else {
                if (sessionStorage.reportNumber != null) {
                    $scope.disableValue = false;
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/pdf',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    var siteId = "0"
                if(sessionStorage.siteId)
                   siteId =  sessionStorage.siteId;

                    $http({
                            method: 'GET',
                            url: $rootScope.baseUrl + "InsuredSummary/GetPdf/" + sessionStorage.reportNumber + '/' +  siteId,
                            responseType: 'arraybuffer',
                            headers: header
                        }).then(function onSuccess(response, data, status, headers) {

                        if (response.status == 200) {
                            $scope.viewPDFLoader = false;

                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                                let blob = new Blob([response.data]);
                                window
                                    .navigator
                                    .msSaveOrOpenBlob(blob, 'CARCO PRE-INSURANCE INSPECTION.PDF');
                            } else {

                                var file = new Blob([response.data], {type: 'application/pdf'});
                                var fileURL = URL.createObjectURL(file);
                                window.open(fileURL);
                            }
                        } else if (response.status == 501) {
                            $scope.viewPDFLoader = false;
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
                    $scope.viewPDFLoader = false;
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    $scope.disableValue = true;
                }
            }
        }

        $scope.sendEmail = function () {
            $scope.dataLoading = true;

            var emailData = {
                INSURED_EMAIL: sessionStorage.userDispalyName,
                INSURED_APPLICATION_ID: $scope.INSURED_APPLICATION_ID
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
                    $scope.dataLoading = false;
                    if (response.status == 200) {
                        toastr.success(CONSTANTS.inspectionReportSent, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else {
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    }
                }, function (error) {
                    $scope.dataLoading = false;
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                });
        }

    }
])
