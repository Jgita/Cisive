app.directive('vehicleInfoForm', [
    '$state',
    'WizardHandler',
    '$rootScope',
    '$http',
    '$q',
    '$timeout',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($state, WizardHandler, $rootScope, $http, $q, $timeout, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/vehicleInfo-form/vehicleInfo-form.view.html',
            link: function ($scope, $elem, $attr) {
                var vm = this;
                $scope.VIN = undefined;
                $scope.VINcount = 0;
               

                $scope.vehicleInfo = function () {

                    angular
                        .forEach($scope.vehicleInfoForm.$error.required, function (field) {

                            toastr.error(CONSTANTS.requiredFields, {timeOut: $rootScope.toastrErrorFiveSec})
                            field.$setDirty();
                        });

                };

                $scope.showMessage = function (input) {
                    return input && input.$error && input.$error.required && $scope.vehicleInfoForm.$submitted;
                };

                $scope.goNext = function (vehicleInfo, $event) {
                    gPageNumber = 0;

                    vehicleInfo.VEHICLE_IDENTIFICATION_NUMBER = vehicleInfo
                        .VEHICLE_IDENTIFICATION_NUMBER
                        .toUpperCase();

                    // angular     .element('#vin')     .trigger('focus');
                    if (angular.element('#vin').val() == 0) {
                        angular
                            .element('#vin')
                            .$setDirty();
                    }
                    $rootScope.sessionLogout();
                    if ($scope.vehicleInfoForm.$invalid) {
                        $scope.vehicleInfoForm.$submitted = true;
                    } else {
                        $scope.vehicleInfoForm.$submitted = false;
                    }
                    if ($scope.vehicleInfoForm.$submitted == false) {

                        $rootScope.isProcessShow(true);
                        $scope.vehicleInfoData = {
                            VEHICLE_IDENTIFICATION_NUMBER: vehicleInfo.VEHICLE_IDENTIFICATION_NUMBER,
                            PAGE: 2,
                            VIN_FlAG: false,
                            UPDATE: true
                        }

                        var deferred = $q.defer();

                        var header = {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        };

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                            $scope.vehicleInfoData.SITE_ID = sessionStorage.siteId

                            if (sessionStorage.clientID != null) {

                                $scope.vehicleInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID

                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            if ($scope.vehicleInfoData.VEHICLE_IDENTIFICATION_NUMBER == $scope.VIN || $scope.VINcount == 1) {
                                $scope.vehicleInfoData.VIN_FlAG = true;
                            } else {
                                $scope.vehicleInfoData.VIN_FlAG = false;
                            }

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleInfoData, header)
                                .then(function (response) {
                                    if (response.data.Response == 'VIN Not Found In CARCO') {
                                        $scope.VINcount = 1;
                                        $scope.VIN = $scope.vehicleInfoData.VEHICLE_IDENTIFICATION_NUMBER;
                                        toastr.warning(CONSTANTS.reEnterVIN, {timeOut: $rootScope.toastrTimeThreeSec});
                                        $scope.vehicleInfo.VEHICLE_IDENTIFICATION_NUMBER = '';

                                        $rootScope.isProcessShow(false);
                                    } else {
                                        $rootScope.isProcessShow(false);

                                        toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec})
                                        WizardHandler
                                            .wizard()
                                            .next();
                                        WizardService.setProgressLine(5, forward = false);
                                        $rootScope.formStateValidation.pageTwo = true;

                                        if (sessionStorage.status === 'pending') {
                                            $rootScope.$broadcast('callInspectSummary', true);
                                        }

                                        $rootScope.$broadcast('callOdometer', true);

                                        deferred.resolve({success: true});
                                    }

                                }, function () {

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec})
                                    $rootScope.isProcessShow(false);

                                    deferred.resolve({success: false});
                                });
                        } else {

                            $scope.vehicleInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID

                            if (sessionStorage.formId != null) {

                                $scope.vehicleInfoData.INSURED_APPLICATION_ID = sessionStorage.formId

                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            if ($scope.vehicleInfoData.VEHICLE_IDENTIFICATION_NUMBER == $scope.VIN || $scope.VINcount == 1) {
                                $scope.vehicleInfoData.VIN_FlAG = true;
                            } else {
                                $scope.vehicleInfoData.VIN_FlAG = false;
                            }

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleInfoData, header)
                                .then(function (response) {
                                    if (response.data.Response == 'VIN Not Found In CARCO') {
                                        $scope.VINcount = 1;
                                        $scope.VIN = $scope.vehicleInfoData.VEHICLE_IDENTIFICATION_NUMBER;
                                        toastr.warning(CONSTANTS.reEnterVIN, {timeOut: $rootScope.toastrTimeThreeSec});
                                        $scope.vehicleInfo.VEHICLE_IDENTIFICATION_NUMBER = '';
                                        $rootScope.isProcessShow(false);
                                    } else {
                                        $rootScope.isProcessShow(false);
                                        toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec})
                                        WizardHandler
                                            .wizard()
                                            .next();
                                        WizardService.setProgressLine(5, forward = false);
                                        $rootScope.formStateValidation.pageTwo = true;
                                        if (sessionStorage.status === 'pending') {
                                            $rootScope.$broadcast('callInspectSummary', true);
                                        }
                                        $rootScope.$broadcast('callOdometer', true);

                                        deferred.resolve({success: true});
                                    }

                                }, function () {

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec})
                                    $rootScope.isProcessShow(false);

                                    deferred.resolve({success: false});
                                });
                        }
                        deferred.resolve({success: true});
                    }
                };

                if (sessionStorage.wizardStepNo != null) {

                    WizardHandler
                        .wizard()
                        .goTo(parseInt(sessionStorage.wizardStepNo));

                }

                $scope.DATA = {
                    PAGE: 2,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0
                }

                $scope.onLoad = function () {
                    gPageNumber = 0;
                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {
                            if (response.data === 'Vehicle Identification not Found') {
                                $scope.vehicleInfo = {
                                    VEHICLE_IDENTIFICATION_NUMBER: ''
                                };
                            } else {
                                $scope.vehicleInfo = {
                                    VEHICLE_IDENTIFICATION_NUMBER: response.data
                                };
                            }

                            deferred.resolve({success: true});
                            return true,
                            response;
                        }, function (response) {

                            deferred.resolve({success: false});
                            return false;

                        });
                    deferred.resolve({success: true});
                }
                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID;
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.formId != null && sessionStorage.formId != undefined) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.formId;
                    $scope.onLoad();
                }

                if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined && sessionStorage.userType && sessionStorage.userType.toLowerCase() == "inspector") {

                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID
                    $scope.onLoad();
                }
            }

        }
    }
])