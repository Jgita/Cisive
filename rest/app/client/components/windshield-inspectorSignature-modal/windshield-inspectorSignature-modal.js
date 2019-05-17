app.controller('winshieldInspectorSignModalController', [
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
            $rootScope.isWinInsuredSing = false;
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
        };

        $scope.done = function () {
            $rootScope.sessionLogout();
            $rootScope.isProcessShow(true);
            var EmptyCanvasBase64 = 'data:image/png;base64,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';
            var signature = $scope.accept();
            if (signature.isEmpty || signature.dataUrl == undefined || signature.dataUrl == EmptyCanvasBase64) {
                $rootScope.isProcessShow(false);
                toastr.error(CONSTANTS.inspectorSigRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                $rootScope.isWinInsuredSing = false;
                $uibModalInstance.dismiss();
            } else {
                toastr.warning('Please wait...', {timeOut: 0});
                $rootScope.$broadcast('winInspectorOriginalSignature', signature.dataUrl);
                $uibModalInstance.close(signature.dataUrl);

                var array = signature
                    .dataUrl
                    .split(',');

                $rootScope.$broadcast('signatureBase64', array[1]);

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                    if (sessionStorage.clientID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: $rootScope.winInsuredSingatureSave,
                            WIN_INSPECTOR_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        };

                    } else if (sessionStorage.WinshieldID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.WinshieldID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: $rootScope.winInsuredSingatureSave,
                            WIN_INSPECTOR_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        };

                    }
                    $scope.insuredSignature.SITE_NAME = sessionStorage.siteName || "";
                    $scope.insuredSignature.SITE_LOCATION = sessionStorage.siteLocation || "";
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
                            $rootScope.isProcessShow(false);
                            $scope.dataLoading = false;
                            $rootScope.isWinInsuredSing = false;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            toastr.success(CONSTANTS.inspectorSigSaved);
                            deferred.resolve({success: true});
                        }, function (response) {
                            toastr.clear();
                            $rootScope.winSingStatus = false;
                            $scope.dataLoading = true;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isWinInsuredSing = false;
                            toastr.error(CONSTANTS.inspectorSigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            deferred.resolve({success: false});
                        });

                } else {

                    if (sessionStorage.clientID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1]
                        };

                    } else if (sessionStorage.WinshieldID != null) {
                        $scope.insuredSignature = {
                            PAGE: 3,
                            WINSHIELD_ID: sessionStorage.WinshieldID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            WIN_INSURED_SIGNATURE: array[1]
                        };

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
                            toastr.success(CONSTANTS.inspectorSigSaved);
                            $rootScope.isWinInsuredSing = false;
                            deferred.resolve({success: true});
                        }, function () {
                            toastr.clear();
                            $rootScope.winSingStatus = false;
                            $scope.dataLoading = true;
                            $rootScope.$broadcast('winVisibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isWinInsuredSing = false;
                            toastr.error(CONSTANTS.inspectorSigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            deferred.resolve({success: false});
                        });
                }
            }
        };
    }
]);