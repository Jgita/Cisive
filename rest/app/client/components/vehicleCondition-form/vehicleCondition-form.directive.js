app.directive('vehicleConditionForm', [
    '$state',
    '$css',
    'WizardHandler',
    '$q',
    '$http',
    '$anchorScroll',
    '$rootScope',
    '$timeout',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($state, $css, WizardHandler, $q, $http, $anchorScroll, $rootScope, $timeout, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/vehicleCondition-form/vehicleCondition-form.view.html',
            link: function ($scope, $elem, $attr) {
                var vm = this;

                $css.bind({
                    href: 'rest/app/client/components/vehicleCondition-form/vehicleCondition-form.css'
                }, $scope);

                $scope.vehicleCondSubmit = function () {

                    if ($scope.maxLengnthValidation) {
                        angular
                            .forEach($scope.vehicleCondForm.$error.maxlength, function (field) {

                                toastr.error(CONSTANTS.maxLimitExceeded, {timeOut: $rootScope.toastrTimeThreeSec});
                                field.$setDirty();

                            });
                    }
                    if ($scope.maxLengnthValidation != true) {
                        angular
                            .forEach($scope.vehicleCondForm.$error.required, function (field) {
                                toastr.error(CONSTANTS.requiredFields, {timeOut: $rootScope.toastrTimeThreeSec});

                                field.$setDirty();
                            });
                    }

                };

                $scope.showMessage = function (input) {

                    var show = $scope.vehicleCondForm.$submitted && input.$error.required;
                    return show;
                };

                $scope.showMessageMaxLen = function (input) {

                    if (input !== undefined && input.$error !== undefined) {

                        var showMax = input.$dirty && input.$error.maxlength;
                        $scope.maxLengnthValidation = showMax;
                        return showMax;
                    }

                };

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

                $scope.goNext = function (vehicleCondInfo, stateCode) {
                    gPageNumber = 0;
                    $rootScope.sessionLogout();
                    //Scroll to top
                    $anchorScroll();

                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {
                        if ($rootScope.formStateValidation.pageFour != true) {
                            toastr.error(CONSTANTS.vehicleOptionsFormRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                            WizardHandler
                                .wizard()
                                .goTo(3);
                            return;
                        }
                    }

                    if (vehicleCondInfo == undefined) {
                        vehicleCondInfo = '';
                    }

                    if ($scope.vehicleCondForm.$invalid && $scope.maxLengnthValidation != true) {
                        $scope.vehicleCondForm.$submitted = true;
                    } else {
                        $scope.vehicleCondForm.$submitted = false;
                    }

                    if (stateCode != 'NJ' && $scope.maxLengnthValidation != true) {

                        if ($scope.vehicleCondForm.$invalid || !vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART && !vehicleCondInfo.FRONT_BUMPER_DAMAGE && !vehicleCondInfo.REAR_BUMPER_DAMAGE && !vehicleCondInfo.FENDER_LEFT_FRONT_DAMAGE && !vehicleCondInfo.FENDER_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_LEFT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_LEFT_REAR_DAMAGE && !vehicleCondInfo.DOOR_RIGHT_REAR_DAMAGE && !vehicleCondInfo.FRONT_BUMPER_RUST && !vehicleCondInfo.REAR_BUMPER_RUST && !vehicleCondInfo.FENDER_LEFT_FRONT_RUST && !vehicleCondInfo.FENDER_RIGHT_FRONT_RUST && !vehicleCondInfo.DOOR_LEFT_FRONT_RUST && !vehicleCondInfo.DOOR_RIGHT_FRONT_RUST && !vehicleCondInfo.DOOR_LEFT_REAR_RUST && !vehicleCondInfo.DOOR_RIGHT_REAR_RUST && !vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_DAMAGE && !vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_DAMAGE && !vehicleCondInfo.HOOD_PANEL_DAMAGE && !vehicleCondInfo.ROOF_PANEL_DAMAGE && !vehicleCondInfo.TRUNK_LID_DAMAGE && !vehicleCondInfo.GRILL_DAMAGE && !vehicleCondInfo.WHELL_COVERS_DAMAGE && !vehicleCondInfo.WINDSHIELD_DAMAGE && !vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_RUST && !vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_RUST && !vehicleCondInfo.HOOD_PANEL_RUST && !vehicleCondInfo.ROOF_PANEL_RUST && !vehicleCondInfo.TRUNK_LID_RUST && !vehicleCondInfo.GRILL_RUST && !vehicleCondInfo.WHELL_COVERS_RUST && !vehicleCondInfo.SIDE_GLASS_LEFT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_LEFT_REAR_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_REAR_DAMAGE && !vehicleCondInfo.REAR_WINDSHIELD_DAMAGE && !vehicleCondInfo.WORN_TORN_INTERIOR_SEAT_DAMAGE && !vehicleCondInfo.DASHBOARD_SOUNDSYSTEM_DAMAGE && !vehicleCondInfo.CENTER_CONSOLE_DAMAGE && !vehicleCondInfo.STORM_DAMAGE && !vehicleCondInfo.OTHER) {
                            $scope.vehicleCondForm.$submitted = true;
                            toastr.error(CONSTANTS.selectOneCheckboxFromPhysicalDamage, {timeOut: $rootScope.toastrErrorFiveSec});
                        } else {
                            $scope.vehicleCondForm.$submitted = false;
                        }
                    } else if (stateCode == 'NJ' && $scope.maxLengnthValidation != true) {
                        if ($scope.vehicleCondForm.$invalid || !vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART && !vehicleCondInfo.FRONT_BUMPER_DAMAGE && !vehicleCondInfo.REAR_BUMPER_DAMAGE && !vehicleCondInfo.FENDER_LEFT_FRONT_DAMAGE && !vehicleCondInfo.FENDER_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_LEFT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.DOOR_LEFT_REAR_DAMAGE && !vehicleCondInfo.DOOR_RIGHT_REAR_DAMAGE && !vehicleCondInfo.FRONT_BUMPER_RUST && !vehicleCondInfo.REAR_BUMPER_RUST && !vehicleCondInfo.FENDER_LEFT_FRONT_RUST && !vehicleCondInfo.FENDER_RIGHT_FRONT_RUST && !vehicleCondInfo.DOOR_LEFT_FRONT_RUST && !vehicleCondInfo.DOOR_RIGHT_FRONT_RUST && !vehicleCondInfo.DOOR_LEFT_REAR_RUST && !vehicleCondInfo.DOOR_RIGHT_REAR_RUST && !vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_DAMAGE && !vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_DAMAGE && !vehicleCondInfo.HOOD_PANEL_DAMAGE && !vehicleCondInfo.ROOF_PANEL_DAMAGE && !vehicleCondInfo.TRUNK_LID_DAMAGE && !vehicleCondInfo.GRILL_DAMAGE && !vehicleCondInfo.WHELL_COVERS_DAMAGE && !vehicleCondInfo.WINDSHIELD_DAMAGE && !vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_RUST && !vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_RUST && !vehicleCondInfo.HOOD_PANEL_RUST && !vehicleCondInfo.ROOF_PANEL_RUST && !vehicleCondInfo.TRUNK_LID_RUST && !vehicleCondInfo.GRILL_RUST && !vehicleCondInfo.WHELL_COVERS_RUST && !vehicleCondInfo.SIDE_GLASS_LEFT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE && !vehicleCondInfo.SIDE_GLASS_LEFT_REAR_DAMAGE && !vehicleCondInfo.SIDE_GLASS_RIGHT_REAR_DAMAGE && !vehicleCondInfo.REAR_WINDSHIELD_DAMAGE && !vehicleCondInfo.WORN_TORN_INTERIOR_SEAT_DAMAGE && !vehicleCondInfo.DASHBOARD_SOUNDSYSTEM_DAMAGE && !vehicleCondInfo.UNDERCARRIAGE_DAMAGE && !vehicleCondInfo.REAR_VIEW_MIRROR_DAMAGE && !vehicleCondInfo.STORM_DAMAGE && !vehicleCondInfo.OTHER) {
                            $scope.vehicleCondForm.$submitted = true;
                            toastr.error(CONSTANTS.selectOneCheckboxFromPhysicalDamage, {timeOut: $rootScope.toastrErrorFiveSec});
                        } else {
                            $scope.vehicleCondForm.$submitted = false;
                        }
                    }

                    if ($scope.vehicleCondForm.$submitted == false && $scope.maxLengnthValidation != true) {

                        if (vehicleCondInfo == undefined) {
                            vehicleCondInfo = '';
                        }

                        if (vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART == undefined) {
                            vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART = false;
                        }

                        $rootScope.isProcessShow(true);

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                            $scope.vehicleCondInfoData = {

                                NO_EXISTING_DAMAGE_RUST_MISSING_PART: $scope.boolTobit(vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART),

                                FRONT_BUMPER_DAMAGE: $scope.boolTobit(vehicleCondInfo.FRONT_BUMPER_DAMAGE),
                                FRONT_BUMPER_RUST: $scope.boolTobit(vehicleCondInfo.FRONT_BUMPER_RUST),

                                REAR_BUMPER_DAMAGE: $scope.boolTobit(vehicleCondInfo.REAR_BUMPER_DAMAGE),
                                REAR_BUMPER_RUST: $scope.boolTobit(vehicleCondInfo.REAR_BUMPER_RUST),

                                FENDER_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.FENDER_LEFT_FRONT_DAMAGE),
                                FENDER_LEFT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.FENDER_LEFT_FRONT_RUST),

                                FENDER_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.FENDER_RIGHT_FRONT_DAMAGE),
                                FENDER_RIGHT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.FENDER_RIGHT_FRONT_RUST),

                                DOOR_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_FRONT_DAMAGE),
                                DOOR_LEFT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_FRONT_RUST),

                                DOOR_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_FRONT_DAMAGE),
                                DOOR_RIGHT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_FRONT_RUST),

                                DOOR_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_REAR_DAMAGE),
                                DOOR_LEFT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_REAR_RUST),

                                DOOR_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_REAR_DAMAGE),
                                DOOR_RIGHT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_REAR_RUST),

                                QUARTER_PANEL_LEFT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_RUST),
                                QUARTER_PANEL_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_DAMAGE),

                                QUARTER_PANEL_RIGHT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_RUST),
                                QUARTER_PANEL_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_DAMAGE),

                                HOOD_PANEL_RUST: $scope.boolTobit(vehicleCondInfo.HOOD_PANEL_RUST),
                                HOOD_PANEL_DAMAGE: $scope.boolTobit(vehicleCondInfo.HOOD_PANEL_DAMAGE),

                                ROOF_PANEL_RUST: $scope.boolTobit(vehicleCondInfo.ROOF_PANEL_RUST),
                                ROOF_PANEL_DAMAGE: $scope.boolTobit(vehicleCondInfo.ROOF_PANEL_DAMAGE),

                                TRUNK_LID_RUST: $scope.boolTobit(vehicleCondInfo.TRUNK_LID_RUST),
                                TRUNK_LID_DAMAGE: $scope.boolTobit(vehicleCondInfo.TRUNK_LID_DAMAGE),

                                GRILL_RUST: $scope.boolTobit(vehicleCondInfo.GRILL_RUST),
                                GRILL_DAMAGE: $scope.boolTobit(vehicleCondInfo.GRILL_DAMAGE),

                                WHELL_COVERS_RUST: $scope.boolTobit(vehicleCondInfo.WHELL_COVERS_RUST),
                                WHELL_COVERS_DAMAGE: $scope.boolTobit(vehicleCondInfo.WHELL_COVERS_DAMAGE),

                                WINDSHIELD_RUST: $scope.boolTobit(vehicleCondInfo.WINDSHIELD_RUST),
                                WINDSHIELD_DAMAGE: $scope.boolTobit(vehicleCondInfo.WINDSHIELD_DAMAGE),

                                SIDE_GLASS_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_LEFT_FRONT_DAMAGE),
                                SIDE_GLASS_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE),
                                SIDE_GLASS_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_LEFT_REAR_DAMAGE),
                                SIDE_GLASS_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_RIGHT_REAR_DAMAGE),
                                REAR_WINDSHIELD_DAMAGE: $scope.boolTobit(vehicleCondInfo.REAR_WINDSHIELD_DAMAGE),
                                WORN_TORN_INTERIOR_SEAT_DAMAGE: $scope.boolTobit(vehicleCondInfo.WORN_TORN_INTERIOR_SEAT_DAMAGE),
                                DASHBOARD_SOUNDSYSTEM_DAMAGE: $scope.boolTobit(vehicleCondInfo.DASHBOARD_SOUNDSYSTEM_DAMAGE),
                                CENTER_CONSOLE_DAMAGE: $scope.boolTobit(vehicleCondInfo.CENTER_CONSOLE_DAMAGE),

                                // UNDERCARRIAGE_DAMAGE: $scope.boolTobit(vehicleCondInfo.UNDERCARRIAGE_DAMAGE),
                                // REAR_VIEW_MIRROR_DAMAGE:
                                // $scope.boolTobit(vehicleCondInfo.REAR_VIEW_MIRROR_DAMAGE),

                                UNDERCARRIAGE_DAMAGE: vehicleCondInfo.UNDERCARRIAGE_DAMAGE,
                                REAR_VIEW_MIRROR_DAMAGE: vehicleCondInfo.REAR_VIEW_MIRROR_DAMAGE,

                                OTHER: $scope.boolTobit(vehicleCondInfo.OTHER),
                                OTHER_DESCRIPTION: vehicleCondInfo.OTHER_DESCRIPTION,
                                STORM_DAMAGE: $scope.boolTobit(vehicleCondInfo.STORM_DAMAGE),
                                STORM_DAMAGE_DESCRIPTION: vehicleCondInfo.STORM_DAMAGE_DESCRIPTION,
                                DESCRIPTION: vehicleCondInfo.DESCRIPTION,
                                PAGE: 5,
                                SITE_ID: sessionStorage.siteId,

                                UPDATE: true

                            };
                            if (sessionStorage.clientID != null) {
                                $scope.vehicleCondInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID;
                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleCondInfoData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(11, forward = false);
                                    $rootScope.formStateValidation.pageFive = true;
                                    $rootScope.$broadcast('callInspectSummary', true);

                                    deferred.resolve({success: true});
                                }, function () {

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $rootScope.isProcessShow(false);

                                    deferred.resolve({success: false});
                                });
                        } else {

                            $scope.vehicleCondInfoData = {

                                NO_EXISTING_DAMAGE_RUST_MISSING_PART: $scope.boolTobit(vehicleCondInfo.NO_EXISTING_DAMAGE_RUST_MISSING_PART),

                                FRONT_BUMPER_DAMAGE: $scope.boolTobit(vehicleCondInfo.FRONT_BUMPER_DAMAGE),
                                FRONT_BUMPER_RUST: $scope.boolTobit(vehicleCondInfo.FRONT_BUMPER_RUST),

                                REAR_BUMPER_DAMAGE: $scope.boolTobit(vehicleCondInfo.REAR_BUMPER_DAMAGE),
                                REAR_BUMPER_RUST: $scope.boolTobit(vehicleCondInfo.REAR_BUMPER_RUST),

                                FENDER_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.FENDER_LEFT_FRONT_DAMAGE),
                                FENDER_LEFT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.FENDER_LEFT_FRONT_RUST),

                                FENDER_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.FENDER_RIGHT_FRONT_DAMAGE),
                                FENDER_RIGHT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.FENDER_RIGHT_FRONT_RUST),

                                DOOR_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_FRONT_DAMAGE),
                                DOOR_LEFT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_FRONT_RUST),

                                DOOR_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_FRONT_DAMAGE),
                                DOOR_RIGHT_FRONT_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_FRONT_RUST),

                                DOOR_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_REAR_DAMAGE),
                                DOOR_LEFT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_LEFT_REAR_RUST),

                                DOOR_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_REAR_DAMAGE),
                                DOOR_RIGHT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.DOOR_RIGHT_REAR_RUST),

                                QUARTER_PANEL_LEFT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_RUST),
                                QUARTER_PANEL_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_DAMAGE),

                                QUARTER_PANEL_RIGHT_REAR_RUST: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_RUST),
                                QUARTER_PANEL_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_DAMAGE),

                                HOOD_PANEL_RUST: $scope.boolTobit(vehicleCondInfo.HOOD_PANEL_RUST),
                                HOOD_PANEL_DAMAGE: $scope.boolTobit(vehicleCondInfo.HOOD_PANEL_DAMAGE),

                                ROOF_PANEL_RUST: $scope.boolTobit(vehicleCondInfo.ROOF_PANEL_RUST),
                                ROOF_PANEL_DAMAGE: $scope.boolTobit(vehicleCondInfo.ROOF_PANEL_DAMAGE),

                                TRUNK_LID_RUST: $scope.boolTobit(vehicleCondInfo.TRUNK_LID_RUST),
                                TRUNK_LID_DAMAGE: $scope.boolTobit(vehicleCondInfo.TRUNK_LID_DAMAGE),

                                GRILL_RUST: $scope.boolTobit(vehicleCondInfo.GRILL_RUST),
                                GRILL_DAMAGE: $scope.boolTobit(vehicleCondInfo.GRILL_DAMAGE),

                                WHELL_COVERS_RUST: $scope.boolTobit(vehicleCondInfo.WHELL_COVERS_RUST),
                                WHELL_COVERS_DAMAGE: $scope.boolTobit(vehicleCondInfo.WHELL_COVERS_DAMAGE),

                                WINDSHIELD_RUST: $scope.boolTobit(vehicleCondInfo.WINDSHIELD_RUST),
                                WINDSHIELD_DAMAGE: $scope.boolTobit(vehicleCondInfo.WINDSHIELD_DAMAGE),

                                SIDE_GLASS_LEFT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_LEFT_FRONT_DAMAGE),
                                SIDE_GLASS_RIGHT_FRONT_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE),
                                SIDE_GLASS_LEFT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_LEFT_REAR_DAMAGE),
                                SIDE_GLASS_RIGHT_REAR_DAMAGE: $scope.boolTobit(vehicleCondInfo.SIDE_GLASS_RIGHT_REAR_DAMAGE),
                                REAR_WINDSHIELD_DAMAGE: $scope.boolTobit(vehicleCondInfo.REAR_WINDSHIELD_DAMAGE),
                                WORN_TORN_INTERIOR_SEAT_DAMAGE: $scope.boolTobit(vehicleCondInfo.WORN_TORN_INTERIOR_SEAT_DAMAGE),
                                DASHBOARD_SOUNDSYSTEM_DAMAGE: $scope.boolTobit(vehicleCondInfo.DASHBOARD_SOUNDSYSTEM_DAMAGE),
                                CENTER_CONSOLE_DAMAGE: $scope.boolTobit(vehicleCondInfo.CENTER_CONSOLE_DAMAGE),

                                UNDERCARRIAGE_DAMAGE: vehicleCondInfo.UNDERCARRIAGE_DAMAGE,
                                REAR_VIEW_MIRROR_DAMAGE: vehicleCondInfo.REAR_VIEW_MIRROR_DAMAGE,

                                OTHER: $scope.boolTobit(vehicleCondInfo.OTHER),
                                OTHER_DESCRIPTION: vehicleCondInfo.OTHER_DESCRIPTION,
                                DESCRIPTION: vehicleCondInfo.DESCRIPTION,
                                STORM_DAMAGE: $scope.boolTobit(vehicleCondInfo.STORM_DAMAGE),
                                STORM_DAMAGE_DESCRIPTION: vehicleCondInfo.STORM_DAMAGE_DESCRIPTION,
                                PAGE: 5,
                                INSURED_APPLICATION_ID: sessionStorage.clientID,
                                UPDATE: true

                            };

                            if (sessionStorage.formId != null) {
                                $scope.vehicleCondInfoData.INSURED_APPLICATION_ID = sessionStorage.formId;
                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleCondInfoData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(11, forward = false);
                                    $rootScope.formStateValidation.pageFive = true;
                                    $rootScope.$broadcast('callInspectSummary', true);
                                    $timeout(function () {
                                        $rootScope.$broadcast('callOnLoadInspectionSum', true);
                                    }, 200);

                                    deferred.resolve({success: true});
                                }, function () {

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $rootScope.isProcessShow(false);

                                    deferred.resolve({success: false});
                                });
                        }

                        var deferred = $q.defer();

                        var header = {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        };

                        deferred.resolve({success: true});

                    }

                };

                $scope.uncheckAll = function () {

                    $scope.vehicleCondInfo.FRONT_BUMPER_DAMAGE = false;
                    $scope.vehicleCondInfo.FRONT_BUMPER_RUST = false;

                    $scope.vehicleCondInfo.REAR_BUMPER_DAMAGE = false;
                    $scope.vehicleCondInfo.REAR_BUMPER_RUST = false;

                    $scope.vehicleCondInfo.FENDER_LEFT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.FENDER_LEFT_FRONT_RUST = false;

                    $scope.vehicleCondInfo.FENDER_RIGHT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.FENDER_RIGHT_FRONT_RUST = false;

                    $scope.vehicleCondInfo.DOOR_LEFT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.DOOR_LEFT_FRONT_RUST = false;

                    $scope.vehicleCondInfo.DOOR_RIGHT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.DOOR_RIGHT_FRONT_RUST = false;

                    $scope.vehicleCondInfo.DOOR_LEFT_REAR_DAMAGE = false;
                    $scope.vehicleCondInfo.DOOR_LEFT_REAR_RUST = false;

                    $scope.vehicleCondInfo.DOOR_RIGHT_REAR_DAMAGE = false;
                    $scope.vehicleCondInfo.DOOR_RIGHT_REAR_RUST = false;

                    $scope.vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_RUST = false;
                    $scope.vehicleCondInfo.QUARTER_PANEL_LEFT_REAR_DAMAGE = false;

                    $scope.vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_RUST = false;
                    $scope.vehicleCondInfo.QUARTER_PANEL_RIGHT_REAR_DAMAGE = false;

                    $scope.vehicleCondInfo.HOOD_PANEL_RUST = false;
                    $scope.vehicleCondInfo.HOOD_PANEL_DAMAGE = false;

                    $scope.vehicleCondInfo.ROOF_PANEL_RUST = false;
                    $scope.vehicleCondInfo.ROOF_PANEL_DAMAGE = false;

                    $scope.vehicleCondInfo.TRUNK_LID_RUST = false;
                    $scope.vehicleCondInfo.TRUNK_LID_DAMAGE = false;

                    $scope.vehicleCondInfo.GRILL_RUST = false;
                    $scope.vehicleCondInfo.GRILL_DAMAGE = false;

                    $scope.vehicleCondInfo.WHELL_COVERS_RUST = false;
                    $scope.vehicleCondInfo.WHELL_COVERS_DAMAGE = false;

                    $scope.vehicleCondInfo.WINDSHIELD_RUST = false;
                    $scope.vehicleCondInfo.WINDSHIELD_DAMAGE = false;

                    $scope.vehicleCondInfo.SIDE_GLASS_LEFT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.SIDE_GLASS_RIGHT_FRONT_DAMAGE = false;
                    $scope.vehicleCondInfo.SIDE_GLASS_LEFT_REAR_DAMAGE = false;
                    $scope.vehicleCondInfo.SIDE_GLASS_RIGHT_REAR_DAMAGE = false;
                    $scope.vehicleCondInfo.REAR_WINDSHIELD_DAMAGE = false;
                    $scope.vehicleCondInfo.WORN_TORN_INTERIOR_SEAT_DAMAGE = false;
                    $scope.vehicleCondInfo.DASHBOARD_SOUNDSYSTEM_DAMAGE = false;
                    $scope.vehicleCondInfo.CENTER_CONSOLE_DAMAGE = false;
                    $scope.vehicleCondInfo.UNDERCARRIAGE_DAMAGE = false;
                    $scope.vehicleCondInfo.REAR_VIEW_MIRROR_DAMAGE = false;

                    $scope.vehicleCondInfo.OTHER = false;
                    $scope.vehicleCondInfo.OTHER_DESCRIPTION = '';
                    $scope.vehicleCondInfo.STORM_DAMAGE = false;
                    $scope.vehicleCondInfo.STORM_DAMAGE_DESCRIPTION = '';

                };
                $scope.DATA = {
                    PAGE: 5,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0

                };

                $scope.onLoad = function () {
                    gPageNumber = 0;
                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };
                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {

                            if (response.data != null) {
                                $scope.vehicleCondInfo = {

                                    NO_EXISTING_DAMAGE_RUST_MISSING_PART: response.data.NO_EXISTING_DAMAGE_RUST_MISSING_PART,
                                    FRONT_BUMPER_DAMAGE: response.data.FRONT_BUMPER_DAMAGE,
                                    FRONT_BUMPER_RUST: response.data.FRONT_BUMPER_RUST,

                                    REAR_BUMPER_DAMAGE: response.data.REAR_BUMPER_DAMAGE,
                                    REAR_BUMPER_RUST: response.data.REAR_BUMPER_RUST,

                                    FENDER_LEFT_FRONT_DAMAGE: response.data.FENDER_LEFT_FRONT_DAMAGE,
                                    FENDER_LEFT_FRONT_RUST: response.data.FENDER_LEFT_FRONT_RUST,

                                    FENDER_RIGHT_FRONT_DAMAGE: response.data.FENDER_RIGHT_FRONT_DAMAGE,
                                    FENDER_RIGHT_FRONT_RUST: response.data.FENDER_RIGHT_FRONT_RUST,

                                    DOOR_LEFT_FRONT_DAMAGE: response.data.DOOR_LEFT_FRONT_DAMAGE,
                                    DOOR_LEFT_FRONT_RUST: response.data.DOOR_LEFT_FRONT_RUST,

                                    DOOR_RIGHT_FRONT_DAMAGE: response.data.DOOR_RIGHT_FRONT_DAMAGE,
                                    DOOR_RIGHT_FRONT_RUST: response.data.DOOR_RIGHT_FRONT_RUST,

                                    DOOR_LEFT_REAR_DAMAGE: response.data.DOOR_LEFT_REAR_DAMAGE,
                                    DOOR_LEFT_REAR_RUST: response.data.DOOR_LEFT_REAR_RUST,

                                    DOOR_RIGHT_REAR_DAMAGE: response.data.DOOR_RIGHT_REAR_DAMAGE,
                                    DOOR_RIGHT_REAR_RUST: response.data.DOOR_RIGHT_REAR_RUST,

                                    QUARTER_PANEL_LEFT_REAR_RUST: response.data.QUARTER_PANEL_LEFT_REAR_RUST,
                                    QUARTER_PANEL_LEFT_REAR_DAMAGE: response.data.QUARTER_PANEL_LEFT_REAR_DAMAGE,

                                    QUARTER_PANEL_RIGHT_REAR_RUST: response.data.QUARTER_PANEL_RIGHT_REAR_RUST,
                                    QUARTER_PANEL_RIGHT_REAR_DAMAGE: response.data.QUARTER_PANEL_RIGHT_REAR_DAMAGE,

                                    HOOD_PANEL_RUST: response.data.HOOD_PANEL_RUST,
                                    HOOD_PANEL_DAMAGE: response.data.HOOD_PANEL_DAMAGE,

                                    ROOF_PANEL_RUST: response.data.ROOF_PANEL_RUST,
                                    ROOF_PANEL_DAMAGE: response.data.ROOF_PANEL_DAMAGE,

                                    TRUNK_LID_RUST: response.data.TRUNK_LID_RUST,
                                    TRUNK_LID_DAMAGE: response.data.TRUNK_LID_DAMAGE,

                                    GRILL_RUST: response.data.GRILL_RUST,
                                    GRILL_DAMAGE: response.data.GRILL_DAMAGE,

                                    WHELL_COVERS_RUST: response.data.WHELL_COVERS_RUST,
                                    WHELL_COVERS_DAMAGE: response.data.WHELL_COVERS_DAMAGE,

                                    WINDSHIELD_RUST: response.data.WINDSHIELD_RUST,
                                    WINDSHIELD_DAMAGE: response.data.WINDSHIELD_DAMAGE,

                                    SIDE_GLASS_LEFT_FRONT_DAMAGE: response.data.SIDE_GLASS_LEFT_FRONT_DAMAGE,
                                    SIDE_GLASS_RIGHT_FRONT_DAMAGE: response.data.SIDE_GLASS_RIGHT_FRONT_DAMAGE,
                                    SIDE_GLASS_LEFT_REAR_DAMAGE: response.data.SIDE_GLASS_LEFT_REAR_DAMAGE,
                                    SIDE_GLASS_RIGHT_REAR_DAMAGE: response.data.SIDE_GLASS_RIGHT_REAR_DAMAGE,
                                    REAR_WINDSHIELD_DAMAGE: response.data.REAR_WINDSHIELD_DAMAGE,
                                    WORN_TORN_INTERIOR_SEAT_DAMAGE: response.data.WORN_TORN_INTERIOR_SEAT_DAMAGE,
                                    DASHBOARD_SOUNDSYSTEM_DAMAGE: response.data.DASHBOARD_SOUNDSYSTEM_DAMAGE,
                                    CENTER_CONSOLE_DAMAGE: response.data.CENTER_CONSOLE_DAMAGE,

                                    UNDERCARRIAGE_DAMAGE: response.data.UNDERCARRIAGE_DAMAGE,
                                    REAR_VIEW_MIRROR_DAMAGE: response.data.REAR_VIEW_MIRROR_DAMAGE,
                                    OTHER: response.data.OTHER,
                                    OTHER_DESCRIPTION: response.data.OTHER_DESCRIPTION,
                                    STORM_DAMAGE: response.data.STORM_DAMAGE,
                                    STORM_DAMAGE_DESCRIPTION: response.data.STORM_DAMAGE_DESCRIPTION,
                                    DESCRIPTION: response.data.DESCRIPTION

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
                };

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.formId != null && sessionStorage.formId != undefined) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.formId;
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID;
                    $scope.onLoad();
                }

            }
        };
    }
]);