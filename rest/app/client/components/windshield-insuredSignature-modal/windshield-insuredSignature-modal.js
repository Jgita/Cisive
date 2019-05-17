app.controller('winshieldInsuredSignModalController', [
    '$scope',
    '$state',
    '$uibModal',
    '$css',
    '$uibModalInstance',
    '$rootScope',
    '$q',
    'globalService',
    'toastr',
    'CONSTANTS',
    function ($scope, $state, $uibModal, $css, $uibModalInstance, $rootScope, $q, globalService, toastr, CONSTANTS) {

        $rootScope.ok = function () {
            $uibModalInstance.close();
            $rootScope.isDisabledWinInsuredSignOnce = false;
        };

        $css.bind({
            href: 'rest/app/client/components/windshield-insuredSignature-modal/windshield-insuredS' +
                    'ignature-modal.css'
        }, $scope);

        $scope.boundingBox = {
            width: 700,
            height: 300
        };

        if (sessionStorage.WinshieldID) {
            $rootScope.windIDForEmail = sessionStorage.WinshieldID;
        } else {
            $rootScope.windIDForEmail = sessionStorage.clientID;
        }

        $scope.windshieldInspectionSummary = function () {
            $uibModal
                .open({
                    backdrop: 'static',
                    backdropClick: false,
                    dialogFade: false,
                    keyboard: false,
                    templateUrl: 'rest/app/client/components/windshield-inspectionSummary-modal/windshield-inspect' +
                            'ionSummary-modal.html',
                    controller: 'windshieldInspectionSummaryController'
                })
                .result
                .then(function () {}, function () {});
        }

        $scope.done = function () {
            $rootScope.sessionLogout();
            var signature = $scope.accept();
            var EmptyCanvasBase64 = 'data:image/png;base64,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';
            if (signature.isEmpty || signature.dataUrl == undefined || signature.dataUrl == EmptyCanvasBase64) {
                $rootScope.isProcessShow(false);
                toastr.error(CONSTANTS.sigRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                $rootScope.isDisabledWinInsuredSignOnce = false;
                $uibModalInstance.dismiss();
            } else {
                toastr.warning('Please wait...', {timeOut: 0});
                $rootScope.$broadcast('winOriginalSignature', signature.dataUrl);
                $uibModalInstance.close(signature.dataUrl);

                var array = signature
                    .dataUrl
                    .split(',');
                $rootScope.winInsuredSingatureSave = array[1];
                $rootScope.$broadcast('signatureBase64', array[1]);

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                    if (sessionStorage.clientID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        }
                    } else if (sessionStorage.WinshieldID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.WinshieldID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        }
                    }
                    var deferred = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };
                    globalService
                        .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.insuredSignature, header)
                        .then(function (response) {
                            toastr.clear();
                            sessionStorage.winReportNumber = response.data;
                            $rootScope.winSingStatus = true;
                            $rootScope.isProcessShow(false);
                            $scope.dataLoading = false;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            toastr.success(CONSTANTS.sigSaved);
                            $rootScope.isDisabledWinInsuredSignOnce = false;
                            deferred.resolve({success: true});
                        }, function (response) {
                            toastr.clear();
                            $rootScope.winSingStatus = false;
                            $scope.dataLoading = true;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isDisabledWinInsuredSignOnce = false;
                            toastr.error(CONSTANTS.sigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec})
                            deferred.resolve({success: false});
                        });

                } else {

                    $rootScope.isProcessShow(true);

                    if (sessionStorage.clientID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1]

                        }

                    } else if (sessionStorage.WinshieldID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.WinshieldID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1]
                        }

                    }

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.insuredSignature, header)
                        .then(function (response) {
                            toastr.clear();
                            if (response.data != undefined && response.data != null) {

                                $scope.windshieldInspectionSummary();
                            }

                            sessionStorage.winReportNumber = response.data;

                            $rootScope.winSingStatus = true;
                            $scope.dataLoading = false;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            toastr.success(CONSTANTS.insuredSigSaved);
                            $rootScope.isDisabledWinInsuredSignOnce = false;
                            deferred.resolve({success: true});
                        }, function () {
                            toastr.clear();
                            $rootScope.winSingStatus = false;
                            $scope.dataLoading = true;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isDisabledWinInsuredSignOnce = false;
                            toastr.error(CONSTANTS.insuredSigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec})
                            deferred.resolve({success: false});
                        });
                }
            }
        };
    }
]);