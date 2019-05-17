app.controller('inspectorSignModalController', [
    '$scope',
    '$uibModal',
    '$css',
    '$uibModalInstance',
    '$rootScope',
    '$q',
    'globalService',
    'toastr',
    'CONSTANTS',
    function ($scope, $uibModal, $css, $uibModalInstance, $rootScope, $q, globalService, toastr, CONSTANTS) {

        $rootScope.ok = function () {
            $uibModalInstance.close();
            $rootScope.isInsuredSing = false;
        };

        $css.bind({
            href: 'rest/app/client/components/insuredSignature-modal/insuredSignature-modal.css'
        }, $scope);

        $scope.boundingBox = {
            width: 700,
            height: 300
        };

        if (sessionStorage.formId) {
            $rootScope.InsurdIDForEmail = sessionStorage.formId;
        } else {
            $rootScope.InsurdIDForEmail = sessionStorage.clientID;
        }

        $scope.inspectionSummary = function () {
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
        };

        $scope.done = function () {
            $rootScope.sessionLogout();
            $rootScope.isProcessShow(true);
            var EmptyCanvasBase64 = 'data:image/png;base64,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';
            var signature = $scope.accept();
            if (signature.isEmpty || signature.dataUrl == undefined || signature.dataUrl == EmptyCanvasBase64) {
                $rootScope.isProcessShow(false);
                $rootScope.isInsuredSing = false;
                toastr.error(CONSTANTS.inspectorSigRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                $uibModalInstance.dismiss();
            } else {
                toastr.warning('Please wait...', {timeOut: 0});
                $uibModalInstance.close(signature.dataUrl);
                $rootScope.$broadcast('inspectorOriginalSignature', signature.dataUrl);
                var array = signature
                    .dataUrl
                    .split(',');
                var insuredSignature;
                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                    if (sessionStorage.clientID != null) {
                        insuredSignature = {
                            PAGE: 6,
                            INSURED_APPLICATION_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            INSURED_SIGNATURE: $rootScope.insuredSingatureSave,
                            INSPECTOR_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        };

                    } else if (sessionStorage.formId != null) {
                        insuredSignature = {
                            PAGE: 6,
                            INSURED_APPLICATION_ID: sessionStorage.formId,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            INSURED_SIGNATURE: $rootScope.insuredSingatureSave,
                            INSPECTOR_SIGNATURE: array[1],
                            SITE_ID: sessionStorage.siteId
                        };

                    }
                    insuredSignature.SITE_NAME = sessionStorage.siteName || "";
                    insuredSignature.SITE_LOCATION = sessionStorage.siteLocation || "";

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };
                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", insuredSignature, header)
                        .then(function (response) {
                            toastr.clear();
                            if (response.data != undefined && response.data != null) {

                                $scope.inspectionSummary();
                            }
                            sessionStorage.reportNumber = response.data;
                            $rootScope.isInsuredSing = false;
                            $scope.dataLoading = false;
                            $rootScope.singStatus = true;
                            $rootScope.$broadcast('visibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            toastr.success(CONSTANTS.inspectorSigSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            deferred.resolve({success: true});
                        }, function () {
                            toastr.clear();
                            $rootScope.singStatus = false;
                            $scope.dataLoading = true;
                            $rootScope.$broadcast('visibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isInsuredSing = false;
                            toastr.error(CONSTANTS.inspectorSigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            deferred.resolve({success: false});

                        });

                } else {

                    if (sessionStorage.clientID != null) {
                        insuredSignature = {
                            PAGE: 6,
                            INSURED_APPLICATION_ID: sessionStorage.clientID,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            INSURED_SIGNATURE: array[1]

                        };

                    } else if (sessionStorage.formId != null) {
                        insuredSignature = {
                            PAGE: 6,
                            INSURED_APPLICATION_ID: sessionStorage.formId,
                            UPDATE: true,
                            USER_NAME: sessionStorage.userDispalyName,
                            INSURED_SIGNATURE: array[1]
                        };

                    }

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", insuredSignature, header)
                        .then(function (response) {
                            toastr.clear();
                            if (response.data != undefined && response.data != null) {
                                $scope.inspectionSummary();
                            }

                            sessionStorage.reportNumber = response.data;
                            $rootScope.isProcessShow(false);
                            $scope.dataLoading = false;
                            $rootScope.singStatus = true;
                            $rootScope.isInsuredSing = false;
                            $rootScope.$broadcast('visibilitySing', $scope.dataLoading);
                            toastr.success(CONSTANTS.sigSaved);
                            deferred.resolve({success: true});
                        }, function () {
                            toastr.clear();
                            $scope.dataLoading = true;
                            $rootScope.singStatus = false;
                            $rootScope.$broadcast('visibilitySing', $scope.dataLoading);
                            $rootScope.isProcessShow(false);
                            $rootScope.isInsuredSing = false;
                            toastr.error(CONSTANTS.sigNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            deferred.resolve({success: false});
                        });
                }
            }
        };
    }
]);