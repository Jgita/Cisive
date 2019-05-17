app.directive('odometerReadingForm', [
    '$css',
    'WizardHandler',
    '$anchorScroll',
    '$q',
    '$http',
    '$rootScope',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    '$timeout',
    function ($css, WizardHandler, $anchorScroll, $q, $http, $rootScope, toastr, globalService, WizardService, CONSTANTS, $timeout) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/odometerReading-form/odometerReading-form.view.html',
            link: function ($scope, $elem, $attr) {

                $scope.removeDone;

                $scope.odometerSubmit = function () {
                    angular
                        .forEach($scope.odometerForm.$error.required, function (field) {
                            if ($rootScope.formStateValidation.pageTwo == true) {
                                toastr.error(CONSTANTS.requiredFields, {timeOut: $rootScope.toastrTimeThreeSec});
                                field.$setDirty();
                            }
                        });

                };

                $scope.showMessage = function (input) {

                    if (input !== undefined && input.$error !== undefined) {
                        var show = $scope.odometerForm.$submitted && input.$error.required;
                        return show;
                    }

                };

                $css.bind({
                    href: 'rest/app/client/components/odometerReading-form/odometerReading-form.css'
                }, $scope);

                $scope.plateNAStatusForState = function (item) {

                    $scope.statusOfPlateNumber = item;
                    $scope.getStates();

                    if (item == true) {
                        $scope.odometerInfo.LICENSE_PLATE = '';
                    }

                };

                $scope.getBool = function (val) {
                    return !!JSON.parse(String(val).toLowerCase());
                };

                $scope.getCurrentYear = function () {
                    var date = new Date();
                    return currentYear = date.getFullYear();
                };

                $scope.currentYear = $scope.getCurrentYear() + 2;

                $scope.getStates = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {
                            $rootScope.isProcessShow(false);
                            $scope.states = response.data;
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.getStatesProvince = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {
                            $rootScope.isProcessShow(false);
                            $scope.statesProvince = response.data;
                            $scope.statesProvince = $scope
                                .statesProvince
                                .filter(function (item) {
                                    return item.name !== 'N/A';
                                });

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.getSeatMaterial = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/SEATMATERIAL", header)
                        .then(function onSuccess(response) {
                            $scope.seatMaterials = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.getStyle = function () {
                    var defer = $q.defer();
                    $rootScope.isProcessShow(true);

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/GetVehicleStyle", header)
                        .then(function onSuccess(response) {
                            $scope.styles = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };
                $scope.getTransmission = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/getTransmission", header)
                        .then(function onSuccess(response) {
                            $scope.transmissions = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };
                $scope.getYear = function () {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/LISTOFYEARS", header)
                        .then(function onSuccess(response) {
                            $scope.years = response.data;
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                };
                $scope.updateDropD = function (id) {
                    if ($scope.odometerInfo.TRANSMISSION == 1 || id == "1") {
                        $scope.showAutoCbox = true;
                        $scope.showManualCbox = false;
                    }
                    if ($scope.odometerInfo.TRANSMISSION == 2 || id == "2") {
                        $scope.showManualCbox = true;
                        $scope.showAutoCbox = false;
                    }

                };
                $scope.getMake = function () {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofMake", header)
                        .then(function onSuccess(response) {
                            $scope.makes = response.data;
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                };

                $scope.makeSelected = function (id) {
                    $scope.getModel(id);

                };

                $scope.getModel = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("POST", "InsuredSummary/ListofModels/" + id, header)
                        .then(function onSuccess(response) {
                            $scope.models = response.data;
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                };

                $scope.getMajorColor = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofColors", header)
                        .then(function onSuccess(response) {
                            $scope.majorColor = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.getMinorColor = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofColors", header)
                        .then(function onSuccess(response) {
                            $scope.minorColor = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.handleRadioClick = function (item) {
                    $scope.dashflag = item === 'otherText'
                        ? true
                        : false;
                };

                $scope.handleLocation = function (item) {
                    $scope.otherFlag = item === 'Other - Please Specify'
                        ? true
                        : false;
                };

                $scope.manualRadioHandle = function (item) {

                    $scope.odometerInfo.MANUAL_3SPEED = item == 'MANUAL_3SPEED'
                        ? true
                        : false;
                    $scope.odometerInfo.MANUAL_4SPEED = item == 'MANUAL_4SPEED'
                        ? true
                        : false;
                    $scope.odometerInfo.MANUAL_5SPEED = item == 'MANUAL_5SPEED'
                        ? true
                        : false;
                    $scope.odometerInfo.MAUAL_6SPEED = item == 'MAUAL_6SPEED'
                        ? true
                        : false;
                };

                $scope.autoRadioHandle = function (item) {

                    $scope.odometerInfo.AUTOMATIC_OVERDRIVE = item == 'AUTOMATIC_OVERDRIVE'
                        ? true
                        : false;
                    $scope.odometerInfo.AUTOMATIC_AWD = item == 'AUTOMATIC_AWD'
                        ? true
                        : false;
                    $scope.odometerInfo.AUTOMATIC_4WD = item == 'AUTOMATIC_4WD'
                        ? true
                        : false;
                };

                $scope.EPAStickers = [
                    {
                        name: 'EPA Sticker Missing',
                        checked: false,
                        value: 'y'
                    }
                ];

                $scope.bitTobool = function (value) {
                    if (value == true) {
                        return 'Y';
                    } else if (value == false) {
                        return 'N';
                    } else {
                        return '';
                    }
                };

                $scope.boolTobit = function (value) {

                    if (value != null && value != undefined) {
                        if (value == true) {

                            return 1;
                        } else if (value == false) {
                            return 0;
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }

                };

                $scope.ModelUpdate = function (model) {
                    if (model != 'OTHER') {
                        $scope.odometerInfo.MODEL_OTHER = '';
                    }
                }

                $scope.majorColorUpdate = function (majorColor) {
                    if (majorColor != 'OTHER') {
                        $scope.odometerInfo.COLOR_MAJOR_OTHER = '';
                    }
                }

                $scope.minorColorUpdate = function (minorColor) {
                    if (minorColor != 'OTHER') {
                        $scope.odometerInfo.COLOR_MINOR_OTHER = '';
                    }
                }

                $scope.styleUpdate = function (style) {
                    if (style != 'OTHER') {
                        $scope.odometerInfo.STYLE_OTHER = '';
                    }
                }

                $scope.goNext = function (odometerInfo) {
                    gPageNumber = 0;
                    odometerInfo.LICENSE_PLATE = odometerInfo
                        .LICENSE_PLATE
                        .toUpperCase();

                    $rootScope.sessionLogout();
                    $anchorScroll();
                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {
                        if ($rootScope.formStateValidation.pageTwo != true) {
                            toastr.error(CONSTANTS.VINRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                            WizardHandler
                                .wizard()
                                .goTo(1);

                            $timeout(function () {
                                var i = 2;
                                angular.element($('li.f1-step:eq(' + i + ')').removeClass('done'));
                            }, 50)

                            return;
                        }
                    }

                    if ($scope.odometerForm.$invalid) {
                        $scope.odometerForm.$submitted = true;
                    } else {
                        $scope.odometerForm.$submitted = false;
                    }
                    if ($scope.odometerForm.$submitted == false) {
                        $rootScope.isProcessShow(true);
                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                            $scope.odometerInfoData = {

                                YEAR: odometerInfo.YEAR,
                                MAKE: odometerInfo.MAKE,
                                MODEL: odometerInfo.MODEL,
                                COLOR_MAJOR: odometerInfo.COLOR_MAJOR,
                                COLOR_MINOR: odometerInfo.COLOR_MINOR,
                                STYLE: odometerInfo.STYLE,
                                TRANSMISSION: odometerInfo.TRANSMISSION,
                                SEAT_MATERIAL: odometerInfo.SEAT_MATERIAL,
                                FRONT_SEAT_COLOR: odometerInfo.FRONT_SEAT_COLOR,
                                VEHICLE_IDENTIFICATION_NUMBER: odometerInfo.VEHICLE_IDENTIFICATION_NUMBER,
                                LICENSE_PLATE: odometerInfo.LICENSE_PLATE,
                                STATE: odometerInfo.STATE,
                                ODOMETER: odometerInfo.ODOMETER,
                                VIN_LOCATION_ON_VEHICLE: odometerInfo.VIN_LOCATION_ON_VEHICLE,
                                VIN_LOCATION_ON_VEHICLE_DESCRIBE: odometerInfo.VIN_LOCATION_ON_VEHICLE_DESCRIBE, // for other input
                                IS_EPA_STICKER_MISSING: $scope.bitTobool(odometerInfo.IS_EPA_STICKER_MISSING),
                                LICENSE_PLATE_NA: odometerInfo.LICENSE_PLATE_NA,
                                GARAGE_SAME_AS_INSURED_ADDRESSS: odometerInfo.GARAGE_SAME_AS_INSURED_ADDRESSS,
                                GARAGE_CITY: odometerInfo.GARAGE_CITY,
                                GARAGE_STATE: odometerInfo.GARAGE_STATE,
                                MODEL_OTHER: odometerInfo.MODEL_OTHER,
                                COLOR_MAJOR_OTHER: odometerInfo.COLOR_MAJOR_OTHER,
                                COLOR_MINOR_OTHER: odometerInfo.COLOR_MINOR_OTHER,
                                STYLE_OTHER: odometerInfo.STYLE_OTHER,
                                PAGE: 3,
                                INSURED_APPLICATION_ID: sessionStorage.inspectorClientID,
                                UPDATE: true,
                                SITE_ID: sessionStorage.siteId
                            };
                            if (sessionStorage.clientID != null) {
                                $scope.odometerInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID;
                            }
                            if ($scope.odometerInfoData.TRANSMISSION == "1") {
                                $scope.odometerInfoData.AUTOMATIC_OVERDRIVE = odometerInfo.AUTOMATIC_OVERDRIVE;
                                $scope.odometerInfoData.AUTOMATIC_AWD = odometerInfo.AUTOMATIC_AWD;
                                $scope.odometerInfoData.AUTOMATIC_4WD = odometerInfo.AUTOMATIC_4WD;

                            } else {
                                $scope.odometerInfoData.MANUAL_3SPEED = odometerInfo.MANUAL_3SPEED;
                                $scope.odometerInfoData.MANUAL_4SPEED = odometerInfo.MANUAL_4SPEED;
                                $scope.odometerInfoData.MANUAL_5SPEED = odometerInfo.MANUAL_5SPEED;
                                $scope.odometerInfoData.MAUAL_6SPEED = odometerInfo.MAUAL_6SPEED;
                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.odometerInfoData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);
                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(7, true);
                                    $rootScope.formStateValidation.pageThree = true;
                                    if (sessionStorage.status === 'pending') {
                                        $rootScope.$broadcast('callInspectSummary', true);
                                    }

                                    deferred.resolve({success: true});
                                }, function () {
                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $rootScope.isProcessShow(false);
                                    deferred.resolve({success: false});
                                });
                        } else {

                            $scope.odometerInfoData = {
                                YEAR: odometerInfo.YEAR,
                                MAKE: odometerInfo.MAKE,
                                MODEL: odometerInfo.MODEL,
                                COLOR_MAJOR: odometerInfo.COLOR_MAJOR,
                                COLOR_MINOR: odometerInfo.COLOR_MINOR,
                                STYLE: odometerInfo.STYLE,
                                TRANSMISSION: odometerInfo.TRANSMISSION,
                                SEAT_MATERIAL: odometerInfo.SEAT_MATERIAL,
                                FRONT_SEAT_COLOR: odometerInfo.FRONT_SEAT_COLOR,
                                VEHICLE_IDENTIFICATION_NUMBER: odometerInfo.VEHICLE_IDENTIFICATION_NUMBER,
                                LICENSE_PLATE: odometerInfo.LICENSE_PLATE,
                                STATE: odometerInfo.STATE,
                                ODOMETER: odometerInfo.ODOMETER,
                                VIN_LOCATION_ON_VEHICLE: odometerInfo.VIN_LOCATION_ON_VEHICLE,
                                VIN_LOCATION_ON_VEHICLE_DESCRIBE: odometerInfo.VIN_LOCATION_ON_VEHICLE_DESCRIBE, // for other input
                                IS_EPA_STICKER_MISSING: $scope.bitTobool(odometerInfo.IS_EPA_STICKER_MISSING),
                                LICENSE_PLATE_NA: odometerInfo.LICENSE_PLATE_NA,
                                GARAGE_SAME_AS_INSURED_ADDRESSS: odometerInfo.GARAGE_SAME_AS_INSURED_ADDRESSS,
                                GARAGE_CITY: odometerInfo.GARAGE_CITY,
                                GARAGE_STATE: odometerInfo.GARAGE_STATE,
                                MODEL_OTHER: odometerInfo.MODEL_OTHER,
                                COLOR_MAJOR_OTHER: odometerInfo.COLOR_MAJOR_OTHER,
                                COLOR_MINOR_OTHER: odometerInfo.COLOR_MINOR_OTHER,
                                STYLE_OTHER: odometerInfo.STYLE_OTHER,
                                PAGE: 3,
                                INSURED_APPLICATION_ID: sessionStorage.clientID,
                                UPDATE: true
                            };

                            if (sessionStorage.formId != null) {
                                $scope.odometerInfoData.INSURED_APPLICATION_ID = sessionStorage.formId;
                            }

                            if ($scope.odometerInfoData.TRANSMISSION == "1") {
                                $scope.odometerInfoData.AUTOMATIC_OVERDRIVE = odometerInfo.AUTOMATIC_OVERDRIVE;
                                $scope.odometerInfoData.AUTOMATIC_AWD = odometerInfo.AUTOMATIC_AWD;
                                $scope.odometerInfoData.AUTOMATIC_4WD = odometerInfo.AUTOMATIC_4WD;
                            } else {
                                $scope.odometerInfoData.MANUAL_3SPEED = odometerInfo.MANUAL_3SPEED;
                                $scope.odometerInfoData.MANUAL_4SPEED = odometerInfo.MANUAL_4SPEED;
                                $scope.odometerInfoData.MANUAL_5SPEED = odometerInfo.MANUAL_5SPEED;
                                $scope.odometerInfoData.MAUAL_6SPEED = odometerInfo.MAUAL_6SPEED;
                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.odometerInfoData, header)
                                .then(function (response) {
                                    $rootScope.isProcessShow(false);
                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(7, true);
                                    $rootScope.formStateValidation.pageThree = true;
                                    if (sessionStorage.status === 'pending') {
                                        $rootScope.$broadcast('callInspectSummary', true);
                                    }
                                    deferred.resolve({success: true});
                                }, function () {
                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $rootScope.isProcessShow(false);
                                    deferred.resolve({success: false});
                                });
                        }

                        deferred.resolve({success: true});
                    }

                };

                $scope.DATA = {
                    PAGE: 3,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0,
                    USER_NAME: sessionStorage.userDispalyName
                };

                $scope.onLoad = function () {
                    gPageNumber = 0;
                    $scope.getYear();
                    $scope.getTransmission();
                    $scope.getStates();
                    $scope.getStatesProvince();
                    $scope.getStyle();
                    $scope.getSeatMaterial();
                    $scope.getMake();
                    $scope.getMajorColor();
                    $scope.getMinorColor();

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };
                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {
                            var statusOfPlateNumber = response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA;
                            var getPlateStatePromise = new Promise(function (resolve, reject) {
                                var defer = $q.defer();
                                $http
                                    .get($rootScope.baseUrl + 'user/getState')
                                    .then(function onSuccess(response) {
                                        if (statusOfPlateNumber) {
                                            $scope.states = response.data;
                                            resolve(true);
                                        } else {
                                            $scope.states = response.data;
                                            // $scope.states = $scope     .states     .filter(function (item) { return
                                            // item.name !== 'N/A';     });
                                            resolve(true);
                                        }
                                        defer.resolve({success: true});
                                    })
                                    .catch(function onError(response) {
                                        resolve(false);
                                        defer.resolve({success: false});
                                    });
                            });

                            if (response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING != null) {
                                if (response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING == 'Y') {
                                    response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING = true;
                                } else if (response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING == 'N') {
                                    response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING = false;
                                }
                            }
                            if (response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA != null) {
                                if (response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA == 'Y') {
                                    response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA = true;

                                } else if (response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA == 'N') {
                                    response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA = false;
                                }

                            }

                            if (response.data.VEHICLE_ODOMETER_RESULT.STATE == null) {
                                response.data.VEHICLE_ODOMETER_RESULT.STATE = null;
                            } else {
                                response.data.VEHICLE_ODOMETER_RESULT.STATE = response.data.VEHICLE_ODOMETER_RESULT.STATE;
                            }

                            if (response.data.VEHICLE_ODOMETER_RESULT.VEHICLE_IDENTIFICATION_NUMBER == null || response.data.VEHICLE_ODOMETER_RESULT.VEHICLE_IDENTIFICATION_NUMBER == '') {

                                $rootScope.formStateValidation.pageTwo = false;
                                WizardService.setProgressLine(3, forward = false);
                                WizardHandler
                                    .wizard()
                                    .goTo(1);

                                $timeout(function () {
                                    var i = 2;
                                    angular.element($('li.f1-step:eq(' + i + ')').removeClass('done'));
                                }, 100)
                            }

                            $scope.odometerInfo = {

                                VEHICLE_IDENTIFICATION_NUMBER: response.data.VEHICLE_ODOMETER_RESULT.VEHICLE_IDENTIFICATION_NUMBER,
                                YEAR: response.data.VEHICLE_ODOMETER_RESULT.YEAR || response.data.VIN_RESULT.YEAR || "",
                                MAKE: response.data.VEHICLE_ODOMETER_RESULT.MAKE || response.data.VIN_RESULT.MAKE || "",
                                MODEL: response.data.VEHICLE_ODOMETER_RESULT.MODEL || response.data.VIN_RESULT.MODEL || "",
                                COLOR_MAJOR: response.data.VEHICLE_ODOMETER_RESULT.COLOR_MAJOR,
                                COLOR_MINOR: response.data.VEHICLE_ODOMETER_RESULT.COLOR_MINOR,
                                STYLE: response.data.VEHICLE_ODOMETER_RESULT.STYLE,
                                TRANSMISSION: response.data.VEHICLE_ODOMETER_RESULT.TRANSMISSION,
                                SEAT_MATERIAL: response.data.VEHICLE_ODOMETER_RESULT.SEAT_MATERIAL,
                                FRONT_SEAT_COLOR: response.data.VEHICLE_ODOMETER_RESULT.FRONT_SEAT_COLOR,
                                LICENSE_PLATE: response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE,
                                //   STATE: response.data.VEHICLE_ODOMETER_RESULT.STATE,
                                ODOMETER: response.data.VEHICLE_ODOMETER_RESULT.ODOMETER,
                                VIN_LOCATION_ON_VEHICLE: response.data.VEHICLE_ODOMETER_RESULT.VIN_LOCATION_ON_VEHICLE,
                                VIN_LOCATION_ON_VEHICLE_DESCRIBE: response.data.VEHICLE_ODOMETER_RESULT.VIN_LOCATION_ON_VEHICLE_DESCRIBE, // for other input
                                IS_EPA_STICKER_MISSING: response.data.VEHICLE_ODOMETER_RESULT.IS_EPA_STICKER_MISSING,
                                LICENSE_PLATE_NA: response.data.VEHICLE_ODOMETER_RESULT.LICENSE_PLATE_NA,
                                GARAGE_SAME_AS_INSURED_ADDRESSS: response.data.VEHICLE_ODOMETER_RESULT.GARAGE_SAME_AS_INSURED_ADDRESSS,
                                GARAGE_CITY: response.data.VEHICLE_ODOMETER_RESULT.GARAGE_CITY,
                                GARAGE_STATE: response.data.VEHICLE_ODOMETER_RESULT.GARAGE_STATE,
                                MODEL_OTHER: response.data.VEHICLE_ODOMETER_RESULT.MODEL_OTHER,
                                COLOR_MAJOR_OTHER: response.data.VEHICLE_ODOMETER_RESULT.COLOR_MAJOR_OTHER,
                                COLOR_MINOR_OTHER: response.data.VEHICLE_ODOMETER_RESULT.COLOR_MINOR_OTHER,
                                STYLE_OTHER: response.data.VEHICLE_ODOMETER_RESULT.STYLE_OTHER
                            };

                            if ($scope.odometerInfo.MAKE != null && $scope.odometerInfo.MAKE != '') {
                                $scope.getModel($scope.odometerInfo.MAKE);
                            }

                            getPlateStatePromise
                                .then(function (resp) {
                                    $scope.odometerInfo.STATE = response.data.VEHICLE_ODOMETER_RESULT.STATE;
                                })

                            $scope.odometerInfo.YEAR = response.data.VEHICLE_ODOMETER_RESULT.YEAR || response.data.VIN_RESULT.YEAR || "";
                            $scope.odometerInfo.GARAGE_STATE = response.data.VEHICLE_ODOMETER_RESULT.GARAGE_STATE;
                            $scope.odometerInfo.TRANSMISSION = response.data.VEHICLE_ODOMETER_RESULT.TRANSMISSION;
                            $scope.odometerInfo.SEAT_MATERIAL = response.data.VEHICLE_ODOMETER_RESULT.SEAT_MATERIAL;
                            $scope.odometerInfo.STYLE = response.data.VEHICLE_ODOMETER_RESULT.STYLE;

                            $scope.odometerInfo.VIN_LOCATION_ON_VEHICLE = response.data.VEHICLE_ODOMETER_RESULT.VIN_LOCATION_ON_VEHICLE;
                            $scope.odometerInfo.MAKE = response.data.VEHICLE_ODOMETER_RESULT.MAKE || response.data.VIN_RESULT.MAKE || "";
                            $scope.odometerInfo.MODEL = response.data.VEHICLE_ODOMETER_RESULT.MODEL || response.data.VIN_RESULT.MODEL || "";
                            $scope.odometerInfo.COLOR_MAJOR = response.data.VEHICLE_ODOMETER_RESULT.COLOR_MAJOR;
                            $scope.odometerInfo.COLOR_MINOR = response.data.VEHICLE_ODOMETER_RESULT.COLOR_MINOR;

                            $scope.updateDropD($scope.odometerInfo.TRANSMISSION);

                            if ($scope.odometerInfo.TRANSMISSION == "1") {
                                $scope.odometerInfo.AUTOMATIC_OVERDRIVE = response.data.VEHICLE_ODOMETER_RESULT.AUTOMATIC_OVERDRIVE;
                                $scope.odometerInfo.AUTOMATIC_AWD = response.data.VEHICLE_ODOMETER_RESULT.AUTOMATIC_AWD;
                                $scope.odometerInfo.AUTOMATIC_4WD = response.data.VEHICLE_ODOMETER_RESULT.AUTOMATIC_4WD;

                            } else {
                                $scope.odometerInfo.MANUAL_3SPEED = response.data.VEHICLE_ODOMETER_RESULT.MANUAL_3SPEED;
                                $scope.odometerInfo.MANUAL_4SPEED = response.data.VEHICLE_ODOMETER_RESULT.MANUAL_4SPEED;
                                $scope.odometerInfo.MANUAL_5SPEED = response.data.VEHICLE_ODOMETER_RESULT.MANUAL_5SPEED;
                                $scope.odometerInfo.MAUAL_6SPEED = response.data.VEHICLE_ODOMETER_RESULT.MAUAL_6SPEED;
                            }

                            if (response.data.VEHICLE_ODOMETER_RESULT.VIN_LOCATION_ON_VEHICLE == 'otherVal') {
                                $scope.dashflag = true;
                            }

                            if (response.data.VEHICLE_ODOMETER_RESULT.GARAGE_SAME_AS_INSURED_ADDRESSS == 'N') {
                                $scope.otherFlag = true;
                            }

                            deferred.resolve({success: true});
                            return true,
                            response;

                        }, function (response) {
                            deferred.resolve({success: false});
                            return false;
                        });
                    deferred.resolve({success: true});
                };

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.formId != null && sessionStorage.formId != undefined) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.formId;
                    $scope.onLoad();
                }
                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID;
                    $scope.onLoad();
                }

                $scope
                    .$on('callOdometer', function (event, result) {
                        $scope.onLoadBool = result;
                        if ($scope.onLoadBool === true) {
                            if (sessionStorage.clientID != null || sessionStorage.clientID != undefined) {
                                $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID;
                            } else if (sessionStorage.formId != null || sessionStorage.formId != undefined) {
                                $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.formId;
                            }
                            $scope.onLoad();
                        }
                    });
            }
        };
    }
]);