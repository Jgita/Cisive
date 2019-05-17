app
    .directive('windshieldDamageForm', ['$state', 'WizardHandler', '$q', '$http', '$anchorScroll', '$timeout', '$rootScope', 'toastr', 'globalService', 'WizardService', 'CONSTANTS', function ($state, WizardHandler, $q, $http, $anchorScroll, $timeout, $rootScope, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/windshield-damage-form/windshield-damage-form.html',
            link: function ($scope, $elem, $attr) {

                $scope.boolTobit = function (value) {

                    if (value != null && value != undefined) {

                        if (value === true) {
                            return 1;
                        } else if (value === false) {
                            return 0;
                        }
                    } else {

                        return '';
                    }

                };

                $scope.windshieldDamage = function () {

                    if ($scope.maxLengnthValidation || $scope.maxLengnthValidationOther) {
                        angular
                            .forEach($scope.windshieldDamageForm.$error.maxlength, function (field) {

                                toastr.error(CONSTANTS.maxLimitExceeded, {
                                    timeOut: $rootScope.toastrTimeThreeSec
                                });
                                field.$setDirty();

                            });
                    }
                    if ($scope.maxLengnthValidation != true && $scope.maxLengnthValidationOther != true) {
                        angular
                            .forEach($scope.windshieldDamageForm.$error.required, function (field) {
                                toastr.error(CONSTANTS.requiredFields, {
                                    timeOut: $rootScope.toastrTimeThreeSec
                                });

                                field.$setDirty();
                            });
                    }

                };

                $scope.showMessageMaxLen = function (input) {

                    if (input !== undefined && input.$error !== undefined) {
                        var showMax = input.$dirty && input.$error.maxlength;
                        $scope.maxLengnthValidation = showMax;
                        return showMax;
                    }

                };

                $scope.showMessageMaxLenOther = function (input) {

                    if (input !== undefined && input.$error !== undefined) {
                        var showMax = input.$dirty && input.$error.maxlength;
                        $scope.maxLengnthValidationOther = showMax;
                        return showMax;
                    }
                };

                $scope.getBool = function (value) {
                    if (value != null && value != '' && value != undefined) {
                        return !!JSON.parse(String(value).toLowerCase());
                    } else {
                        return '';
                    }
                };

                $scope.typeOfPhoneNosDamageForm = [{
                    name: 'Mobile',
                    checked: true
                }, {
                    name: 'Landline',
                    checked: false
                }];

                $scope.showMobile = true;

                $scope.handleRadioClick = function (item) {
                    $scope.phoneType = item;
                    if (item.name && item.name.toLowerCase() === 'Mobile') {
                        $scope.showMobile = true;
                        $scope.showLandline = false;
                    } else if (item.name && item.name.toLowerCase() === 'Landline') {
                        $scope.showLandline = true;
                        $scope.showMobile = false;
                    }

                };

                $scope.winUncheckAll = function () {

                    $scope.windshieldDamageInfo.PASSENGER_TOP = false;
                    $scope.windshieldDamageInfo.CENTER_TOP = false;
                    $scope.windshieldDamageInfo.DRIVER_TOP = false;
                    $scope.windshieldDamageInfo.PASSENGER_BOTTOM = false;
                    $scope.windshieldDamageInfo.CENTER_BOTTOM = false;
                    $scope.windshieldDamageInfo.DRIVER_BOTTOM = false;
                    $scope.windshieldDamageInfo.PASSENGER_CHIP = false;
                    $scope.windshieldDamageInfo.PASSENGER_STAR_CRACK = false;
                    $scope.windshieldDamageInfo.PASSENGER_CRACKED = false;
                    $scope.windshieldDamageInfo.PASSENGER_PIT = false;
                    $scope.windshieldDamageInfo.PASSENGER_SMASHED = false;
                    $scope.windshieldDamageInfo.CENTER_CHIP = false;
                    $scope.windshieldDamageInfo.CENTER_STAR_CRACK = false;
                    $scope.windshieldDamageInfo.CENTER_CRACKED = false;
                    $scope.windshieldDamageInfo.CENTER_PIT = false;
                    $scope.windshieldDamageInfo.CENTER_SMASHED = false;
                    $scope.windshieldDamageInfo.DRIVER_SIDE_CHIP = false;
                    $scope.windshieldDamageInfo.DRIVER_SIDE_STAR_CRACK = false;
                    $scope.windshieldDamageInfo.DRIVER_SIDE_CRACKED = false;
                    $scope.windshieldDamageInfo.DRIVER_SIDE_PIT = false;
                    $scope.windshieldDamageInfo.DRIVER_SIDE_SMASHED = false;
                };

                $scope.DATA = {
                    PAGE: 2,
                    UPDATE: false,
                    WINSHIELD_ID: 0,
                    USER_NAME: sessionStorage.userDispalyName
                };

                $scope.onLoad = function () {
                    gPageNumber = 0;
                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.DATA, header)
                        .then(function (response) {

                            $scope.windshieldDamageInfo = {

                                PASSENGER_CHIP: response.data.PASSENGER_CHIP,
                                PASSENGER_STAR_CRACK: response.data.PASSENGER_STAR_CRACK,
                                PASSENGER_CRACKED: response.data.PASSENGER_CRACKED,
                                PASSENGER_PIT: response.data.PASSENGER_PIT,
                                PASSENGER_SMASHED: response.data.PASSENGER_SMASHED,
                                CENTER_CHIP: response.data.CENTER_CHIP,
                                CENTER_STAR_CRACK: response.data.CENTER_STAR_CRACK,
                                CENTER_CRACKED: response.data.CENTER_CRACKED,
                                CENTER_PIT: response.data.CENTER_PIT,
                                CENTER_SMASHED: response.data.CENTER_SMASHED,
                                DRIVER_SIDE_CHIP: response.data.DRIVER_SIDE_CHIP,
                                DRIVER_SIDE_STAR_CRACK: response.data.DRIVER_SIDE_STAR_CRACK,
                                DRIVER_SIDE_CRACKED: response.data.DRIVER_SIDE_CRACKED,
                                DRIVER_SIDE_PIT: response.data.DRIVER_SIDE_PIT,
                                DRIVER_SIDE_SMASHED: response.data.DRIVER_SIDE_SMASHED,
                                PASSENGER_TOP: response.data.PASSENGER_TOP,
                                CENTER_TOP: response.data.CENTER_TOP,
                                CENTER_BOTTOM: response.data.CENTER_BOTTOM,
                                DRIVER_TOP: response.data.DRIVER_TOP,
                                PASSENGER_BOTTOM: response.data.PASSENGER_BOTTOM,
                                DRIVER_BOTTOM: response.data.DRIVER_BOTTOM,
                                WINDSHIELD_DAMAGE_DESCRIBE: response.data.WINDSHIELD_DAMAGE_DESCRIBE,

                                WIN_NO_DAMAGE: response.data.WIN_NO_DAMAGE,
                                AUTOMATIC_WIPERS: response.data.AUTOMATIC_WIPERS,

                                TINTED_WINDSHIELD: response.data.TINTED_WINDSHIELD,
                                WIN_OTHER_DESCRIPTION: response.data.WIN_OTHER_DESCRIPTION

                            };
                            deferred.resolve({
                                success: true
                            });
                            return true,
                                response;
                        }, function (response) {

                            deferred.resolve({
                                success: false
                            });
                            return false;

                        });
                    deferred.resolve({
                        success: true
                    });

                };

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.WinshieldID != null) {
                    $scope.DATA.WINSHIELD_ID = sessionStorage.WinshieldID;
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.WinshieldID != null) {

                    $scope.DATA.WINSHIELD_ID = sessionStorage.WinshieldID;
                    $scope.onLoad();
                }

                $scope.goNext = function (windshieldDamageInfo) {
                    gPageNumber = 0;
                    $rootScope.sessionLogout();

                    //Scroll to top
                    $anchorScroll();

                    if (windshieldDamageInfo == undefined) {
                        windshieldDamageInfo = '';
                    }

                    if ($scope.windshieldDamageForm.$invalid && $scope.maxLengnthValidation != true && $scope.maxLengnthValidationOther != true) {
                        $scope.windshieldDamageForm.$submitted = true;
                    } else {
                        $scope.windshieldDamageForm.$submitted = false;
                    }
                    if ($scope.maxLengnthValidation != true && $scope.maxLengnthValidationOther != true) {
                        if ($scope.windshieldDamageForm.$invalid || !windshieldDamageInfo.WIN_NO_DAMAGE && !windshieldDamageInfo.PASSENGER_CHIP && !windshieldDamageInfo.PASSENGER_STAR_CRACK && !windshieldDamageInfo.PASSENGER_CRACKED && !windshieldDamageInfo.PASSENGER_PIT && !windshieldDamageInfo.PASSENGER_SMASHED && !windshieldDamageInfo.CENTER_CHIP && !windshieldDamageInfo.CENTER_STAR_CRACK && !windshieldDamageInfo.CENTER_CRACKED && !windshieldDamageInfo.CENTER_PIT && !windshieldDamageInfo.CENTER_SMASHED && !windshieldDamageInfo.DRIVER_SIDE_CHIP && !windshieldDamageInfo.DRIVER_SIDE_STAR_CRACK && !windshieldDamageInfo.DRIVER_SIDE_CRACKED && !windshieldDamageInfo.DRIVER_SIDE_PIT && !windshieldDamageInfo.DRIVER_SIDE_SMASHED) {
                            $scope.windshieldDamageForm.$submitted = true;
                            toastr.error(CONSTANTS.winSelectOneCheckboxFromPhysicalCondition, {
                                timeOut: $rootScope.toastrErrorFiveSec
                            });
                        } else {
                            $scope.windshieldDamageForm.$submitted = false;
                        }
                    }

                    if ($scope.windshieldDamageForm.$submitted == false && $scope.maxLengnthValidation != true && $scope.maxLengnthValidationOther != true) {
                        $scope.dataLoading = true;
                        $rootScope.isProcessShow(true);

                        var header = {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        };

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                            $scope.windshieldDamagelData = {

                                PASSENGER_CHIP: $scope.boolTobit(windshieldDamageInfo.PASSENGER_CHIP),
                                PASSENGER_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.PASSENGER_STAR_CRACK),
                                PASSENGER_CRACKED: $scope.boolTobit(windshieldDamageInfo.PASSENGER_CRACKED),
                                PASSENGER_PIT: $scope.boolTobit(windshieldDamageInfo.PASSENGER_PIT),
                                PASSENGER_SMASHED: $scope.boolTobit(windshieldDamageInfo.PASSENGER_SMASHED),
                                CENTER_CHIP: $scope.boolTobit(windshieldDamageInfo.CENTER_CHIP),
                                CENTER_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.CENTER_STAR_CRACK),
                                CENTER_CRACKED: $scope.boolTobit(windshieldDamageInfo.CENTER_CRACKED),
                                CENTER_PIT: $scope.boolTobit(windshieldDamageInfo.CENTER_PIT),
                                CENTER_SMASHED: $scope.boolTobit(windshieldDamageInfo.CENTER_SMASHED),
                                DRIVER_SIDE_CHIP: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_CHIP),
                                DRIVER_SIDE_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_STAR_CRACK),
                                DRIVER_SIDE_CRACKED: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_CRACKED),
                                DRIVER_SIDE_PIT: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_PIT),
                                DRIVER_SIDE_SMASHED: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_SMASHED),
                                PASSENGER_TOP: $scope.boolTobit(windshieldDamageInfo.PASSENGER_TOP),
                                CENTER_TOP: $scope.boolTobit(windshieldDamageInfo.CENTER_TOP),
                                CENTER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.CENTER_BOTTOM),
                                DRIVER_TOP: $scope.boolTobit(windshieldDamageInfo.DRIVER_TOP),
                                PASSENGER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.PASSENGER_BOTTOM),
                                DRIVER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.DRIVER_BOTTOM),
                                WINDSHIELD_DAMAGE_DESCRIBE: windshieldDamageInfo.WINDSHIELD_DAMAGE_DESCRIBE,

                                WIN_NO_DAMAGE: $scope.boolTobit(windshieldDamageInfo.WIN_NO_DAMAGE),
                                AUTOMATIC_WIPERS: $scope.boolTobit(windshieldDamageInfo.AUTOMATIC_WIPERS),

                                TINTED_WINDSHIELD: $scope.boolTobit(windshieldDamageInfo.TINTED_WINDSHIELD),
                                WIN_OTHER_DESCRIPTION: windshieldDamageInfo.WIN_OTHER_DESCRIPTION,

                                PAGE: 2,
                                SITE_ID: sessionStorage.siteId,

                                UPDATE: true
                            };
                            if (sessionStorage.clientID != null) {
                                $scope.windshieldDamagelData.WINSHIELD_ID = sessionStorage.clientID;
                            } else if (sessionStorage.WinshieldID != null) {
                                $scope.windshieldDamagelData.WINSHIELD_ID = sessionStorage.WinshieldID;
                            }

                            globalService
                                .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.windshieldDamagelData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);

                                    $scope.dataLoading = false;

                                    toastr.success(CONSTANTS.changesSuccess, {
                                        timeOut: $rootScope.toastrTimeThreeSec
                                    });
                                    WizardHandler
                                        .wizard()
                                        .next();

                                    WizardService.setProgressLine(5, forward = false);
                                    $rootScope.winFormStateValidation.pageTwo = true;
                                    $rootScope.$broadcast('callWindInspectSummary', true);

                                }, function (error) {

                                    $rootScope.isProcessShow(false);

                                    toastr.error(CONSTANTS.somethingWentWrong, {
                                        timeOut: $rootScope.toastrTimeThreeSec
                                    });
                                    $scope.dataLoading = false;

                                });
                        } else {

                            $scope.windshieldDamagelData = {

                                PASSENGER_CHIP: $scope.boolTobit(windshieldDamageInfo.PASSENGER_CHIP),
                                PASSENGER_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.PASSENGER_STAR_CRACK),
                                PASSENGER_CRACKED: $scope.boolTobit(windshieldDamageInfo.PASSENGER_CRACKED),
                                PASSENGER_PIT: $scope.boolTobit(windshieldDamageInfo.PASSENGER_PIT),
                                PASSENGER_SMASHED: $scope.boolTobit(windshieldDamageInfo.PASSENGER_SMASHED),
                                CENTER_CHIP: $scope.boolTobit(windshieldDamageInfo.CENTER_CHIP),
                                CENTER_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.CENTER_STAR_CRACK),
                                CENTER_CRACKED: $scope.boolTobit(windshieldDamageInfo.CENTER_CRACKED),
                                CENTER_PIT: $scope.boolTobit(windshieldDamageInfo.CENTER_PIT),
                                CENTER_SMASHED: $scope.boolTobit(windshieldDamageInfo.CENTER_SMASHED),
                                DRIVER_SIDE_CHIP: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_CHIP),
                                DRIVER_SIDE_STAR_CRACK: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_STAR_CRACK),
                                DRIVER_SIDE_CRACKED: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_CRACKED),
                                DRIVER_SIDE_PIT: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_PIT),
                                DRIVER_SIDE_SMASHED: $scope.boolTobit(windshieldDamageInfo.DRIVER_SIDE_SMASHED),
                                PASSENGER_TOP: $scope.boolTobit(windshieldDamageInfo.PASSENGER_TOP),
                                CENTER_TOP: $scope.boolTobit(windshieldDamageInfo.CENTER_TOP),
                                CENTER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.CENTER_BOTTOM),
                                DRIVER_TOP: $scope.boolTobit(windshieldDamageInfo.DRIVER_TOP),
                                PASSENGER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.PASSENGER_BOTTOM),
                                DRIVER_BOTTOM: $scope.boolTobit(windshieldDamageInfo.DRIVER_BOTTOM),
                                WINDSHIELD_DAMAGE_DESCRIBE: windshieldDamageInfo.WINDSHIELD_DAMAGE_DESCRIBE,

                                WIN_NO_DAMAGE: $scope.boolTobit(windshieldDamageInfo.WIN_NO_DAMAGE),
                                AUTOMATIC_WIPERS: $scope.boolTobit(windshieldDamageInfo.AUTOMATIC_WIPERS),

                                TINTED_WINDSHIELD: $scope.boolTobit(windshieldDamageInfo.TINTED_WINDSHIELD),

                                WIN_OTHER_DESCRIPTION: windshieldDamageInfo.WIN_OTHER_DESCRIPTION,

                                PAGE: 2,
                                WINSHIELD_ID: 0,
                                UPDATE: true
                            };

                            if (sessionStorage.WinshieldID != null) {
                                $scope.windshieldDamagelData.WINSHIELD_ID = sessionStorage.WinshieldID;
                            } else if (sessionStorage.clientID != null) {
                                $scope.windshieldDamagelData.WINSHIELD_ID = sessionStorage.clientID;

                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.windshieldDamagelData, header)
                                .then(function () {

                                    $scope.dataLoading = false;
                                    $rootScope.isProcessShow(false);

                                    toastr.success(CONSTANTS.changesSuccess, {
                                        timeOut: $rootScope.toastrTimeThreeSec
                                    });
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(5, forward = false);
                                    $rootScope.winFormStateValidation.pageTwo = true;
                                    $rootScope.$broadcast('callWindInspectSummary', true);

                                }, function () {

                                    toastr.error(CONSTANTS.somethingWentWrong, {
                                        timeOut: $rootScope.toastrTimeThreeSec
                                    });
                                    $scope.dataLoading = false;
                                    $rootScope.isProcessShow(false);

                                });

                        }
                    }

                };
            }
        };
    }]);