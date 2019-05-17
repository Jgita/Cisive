app
    .controller('inspectionEmailController', ['$scope', '$base64', '$uibModal', 'toastr', '$state', '$uibModalInstance', '$http', '$rootScope', 'CONSTANTS', function ($scope, $base64, $uibModal, toastr, $state, $uibModalInstance, $http, $rootScope, CONSTANTS) {
        $scope.cancelVisibility = false;
        if (sessionStorage.formId) {
            $scope.INSURED_APPLICATION_ID = sessionStorage.formId || $rootScope.InsurdIDForEmail;
        } else {
            $scope.INSURED_APPLICATION_ID = sessionStorage.clientID || $rootScope.InsurdIDForEmail;
        }

        if (sessionStorage.PDFID != null) {
            $scope.encodeGenerateEmailPdf = $base64.encode('INSURED_APPLICATION_ID=' + $scope.INSURED_APPLICATION_ID + '&USERID=' + sessionStorage.PDFID + '&EMAIL=' + $scope.EMAIL);

        } else if (sessionStorage.userId != null) {
            $scope.encodeGenerateEmailPdf = $base64.encode('INSURED_APPLICATION_ID=' + $scope.INSURED_APPLICATION_ID + '&USERID=' + sessionStorage.userId + '&EMAIL=' + $scope.EMAIL);
        }

        $rootScope.closeModalOnBack = function() {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
            if(sessionStorage.emailFromDashboard == 'false') {
                $uibModal
                    .open({
                        backdrop: 'static',
                        backdropClick: false,
                        dialogFade: false,
                        keyboard: false,
                        templateUrl: 'rest/app/client/components/inspectionSummary-modal/inspectionSummary-modal.html',
                        controller: 'inspectionSummaryController'
                    })
                    .result
                    .then(function () {}, function () {});
            }
        };

        $scope.sendInspectorEmail = function () {
            $scope.dataLoading = true;
            $scope.cancelVisibility = true;

            if(sessionStorage.emailFromDashboard == 'true') {
                $scope.emailData = {
                    INSURED_EMAIL: $scope.EMAIL,
                    INSURED_APPLICATION_ID: sessionStorage.INSURED_APPLICATION_ID
                }
            } else if(sessionStorage.emailFromDashboard == 'false') {
                $scope.emailData = {
                    INSURED_EMAIL: $scope.EMAIL,
                    INSURED_APPLICATION_ID: $scope.INSURED_APPLICATION_ID
                }
            }

            $http({
                url: $rootScope.baseUrl + 'InsuredSummary/PdfEmaill',
                method: 'POST',
                data: JSON.stringify($scope.emailData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }
                })
                .then(function (response) {

                    if (response.status == 200) {
                        $uibModalInstance.close();
                        toastr.success(CONSTANTS.inspectionReportSent, {timeOut: $rootScope.toastrTimeThreeSec});
                        $scope.dataLoading = false;
                        $scope.cancelVisibility = false;

                        if(sessionStorage.emailFromDashboard == 'true') {
                            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                                $state.transitionTo('insuredPage.dashboardInsured');
                            } else {
                                $state.transitionTo('inspectionPage.dashboard');
                            }
                        } else if(sessionStorage.emailFromDashboard == 'false'){
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
                        }

                    } else {
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                        $scope.dataLoading = false;
                        $scope.cancelVisibility = false;
                    }

                }, function (error) {
                    $scope.dataLoading = false;
                    $scope.cancelVisibility = false;
                    if (error.status == 501) {
                        toastr.error(CONSTANTS.invalidEmailId, {timeOut: $rootScope.toastrTimeThreeSec});
                    } else {

                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    }

                });
        };
    }]);