app.directive('vehicleOptionForm', [
    '$state',
    'WizardHandler',
    '$window',
    '$anchorScroll',
    '$q',
    '$http',
    '$timeout',
    '$rootScope',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($state, WizardHandler, $window, $anchorScroll, $q, $http, $timeout, $rootScope, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/vehicleOption-form/vehicleOption-form.view.html',
            link: function ($scope, $elem, $attr) {
                var vm = this;

                $scope.vehicleOption = function () {
                    angular
                        .forEach($scope.vehicleInfOption.$error.maxlength, function (field) {

                            toastr.error(CONSTANTS.maxLimitExceeded, {timeOut: $rootScope.toastrTimeThreeSec});
                            field.$setDirty();

                        });

                    angular.forEach($scope.vehicleInfOption.$error.max, function (field) {

                        toastr.error(CONSTANTS.maxLimitExceeded, {timeOut: $rootScope.toastrTimeThreeSec});
                        field.$setDirty();

                    });

                };

                $scope.showMessage = function (input) {
                    var show = $scope.vehicleInfOption.$submitted && input.$error.required;
                    return show;
                };

                $scope.showMessageMaxLen = function (input) {
                    if (input !== undefined && input.$error !== undefined) {
                        if (input.$name == 'capQant') {
                            var showMax1 = input.$dirty && input.$error.max;
                            $scope.maxLengnthValidationQunt = showMax1;

                            return showMax1;
                        } else {

                            var showMax = input.$dirty && input.$error.maxlength;
                            $scope.maxLengnthValidation = showMax;
                            return showMax;
                        }
                    }

                };

                $scope.uncheckAll = function () {

                    $scope.vehicleOptionModel.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_G_WINDOW_GLASS_ETCHING = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE = false;

                    $scope.vehicleOptionModel.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE = false;

                    $scope.vehicleOptionModel.ANTITHEFT_INOPERATIVE = false;
                    $scope.vehicleOptionModel.ANTITHEFT_AUTO_RECOVERY_SYSTEM = false;
                    $scope.vehicleOptionModel.ANTITHEFT_PASSIVE_DISABLE = false;
                    $scope.vehicleOptionModel.ANTITHEFT_ACTIVE_DISABLE = false;
                    $scope.vehicleOptionModel.ANTITHEFT_AUDIBLE_ALARM_ONLY = false;
                    $scope.vehicleOptionModel.ANTITHEFT_COMBAT_AUTO_THEFT = false;
                    $scope.vehicleOptionModel.ANTITHEFT_ETCHED_GLASS_CODING = false;
                };

                $scope.frontAirBags = [
                    {
                        id: 'front-1',
                        name: '1',
                        checked: 1
                    }, {
                        id: 'front-2',
                        name: '2',
                        checked: 2
                    }
                ];

                $scope.sideAirBags = [
                    {
                        id: 'side-1',
                        name: '1',
                        checked: 1
                    }, {
                        id: 'side-2',
                        name: '2',
                        checked: 2
                    }
                ];

                $scope.rearAirBags = [
                    {
                        id: 'rear-1',
                        name: '1',
                        checked: 1
                    }, {
                        id: 'rear-2',
                        name: '2',
                        checked: 2
                    }
                ];

                $scope.boolTobit = function (value) {
                    if (value != null && value != undefined) {
                        if (value === true) {
                            return 1;
                        } else if (value === false) {
                            return 0;
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }

                };

                $scope.vanLimoOnChange = function () {
                    if ($scope.vehicleOptionModel.IS_VAN_OR_LIMO == false) {
                        $scope.vehicleOptionModel.INTERIROR_PANELING = false;
                        $scope.vehicleOptionModel.REAR_PASSENGER_SEATING = false;
                        $scope.vehicleOptionModel.EXTERIOR_DECORATIVE_PAINT = false;
                        $scope.vehicleOptionModel.NON_FACTORY_INSTALLED_AC = false;
                        $scope.vehicleOptionModel.CUSTOMIZED_WINDOWS = false;
                        $scope.vehicleOptionModel.STEREO = false;
                        $scope.vehicleOptionModel.REFRIGERATOR = false;
                        $scope.vehicleOptionModel.TELEVISION_VCR_DVD = false;
                        $scope.vehicleOptionModel.TELEVISION_VCR_DVD_PERMANENT = '';
                        $scope.vehicleOptionModel.OTHER = false;
                        $scope.vehicleOptionModel.OTHER_DESCRIPTION = '';
                    }
                };

                vehicleOptionModel = {
                    ANTITHEFT_NONE: false
                };

                $scope.goNext = function (vehicleOptionModel, stateCode) {
                    gPageNumber = 0;
                    $rootScope.sessionLogout();
                    //Scroll to top
                    $anchorScroll();

                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {

                        if ($rootScope.formStateValidation.pageThree != true) {
                            toastr.error(CONSTANTS.vehicleOptionFormRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                            WizardHandler
                                .wizard()
                                .goTo(2);
                            return;
                        }
                    }

                    if (vehicleOptionModel == undefined) {
                        vehicleOptionModel = '';
                    }

                    if (stateCode != 'NJ') {
                        if (vehicleOptionModel.ANTITHEFT_NONE == null) {
                            $scope.vehicleInfOption.$submitted = true;
                            toastr.error(CONSTANTS.checkAntiTheft, {timeOut: $rootScope.toastrErrorFiveSec});
                        } else if (vehicleOptionModel.ANTITHEFT_NONE == false) {
                            $scope.vehicleInfOption.$submitted = false;
                        } else if (vehicleOptionModel.ANTITHEFT_NONE == true) {
                            if (vehicleInfOption.$invalid || !vehicleOptionModel.ANTITHEFT_INOPERATIVE && !vehicleOptionModel.ANTITHEFT_AUTO_RECOVERY_SYSTEM && !vehicleOptionModel.ANTITHEFT_PASSIVE_DISABLE && !vehicleOptionModel.ANTITHEFT_ACTIVE_DISABLE && !vehicleOptionModel.ANTITHEFT_AUDIBLE_ALARM_ONLY && !vehicleOptionModel.ANTITHEFT_COMBAT_AUTO_THEFT && !vehicleOptionModel.ANTITHEFT_ETCHED_GLASS_CODING) {
                                $scope.vehicleInfOption.$submitted = true;
                                toastr.error(CONSTANTS.selectOneCheckboxFromAntiTheft, {timeOut: $rootScope.toastrErrorFiveSec});
                            } else {
                                $scope.vehicleInfOption.$submitted = false;
                            }
                        }

                    } else if (stateCode == 'NJ') {

                        if (vehicleOptionModel.ANTI_THEFT_NONE_NEW_JERCY == null) {
                            $scope.vehicleInfOption.$submitted = true;
                            toastr.error(CONSTANTS.checkAntiTheft, {timeOut: $rootScope.toastrErrorFiveSec});
                        } else if (vehicleOptionModel.ANTI_THEFT_NONE_NEW_JERCY == false) {
                            $scope.vehicleInfOption.$submitted = false;
                        } else if (vehicleOptionModel.ANTI_THEFT_NONE_NEW_JERCY == true) {
                            if (vehicleInfOption.$invalid || !vehicleOptionModel.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE && !vehicleOptionModel.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR && !vehicleOptionModel.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL && !vehicleOptionModel.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL && !vehicleOptionModel.ANTI_THEFT_G_WINDOW_GLASS_ETCHING && !vehicleOptionModel.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL && !vehicleOptionModel.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH && !vehicleOptionModel.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK && !vehicleOptionModel.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC && !vehicleOptionModel.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM && !vehicleOptionModel.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE && !vehicleOptionModel.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH && !vehicleOptionModel.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC && !vehicleOptionModel.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC && !vehicleOptionModel.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT && !vehicleOptionModel.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC && !vehicleOptionModel.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC && !vehicleOptionModel.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE && !vehicleOptionModel.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE) {
                                $scope.vehicleInfOption.$submitted = true;
                                toastr.error(CONSTANTS.selectOneCheckboxFromAntiTheft, {timeOut: $rootScope.toastrErrorFiveSec});
                            } else {
                                $scope.vehicleInfOption.$submitted = false;
                            }
                        }

                    }

                    if ($scope.vehicleInfOption.$submitted == false && $scope.maxLengnthValidation != true && $scope.maxLengnthValidationQunt != true) {

                        $rootScope.isProcessShow(true);

                        if (vehicleOptionModel == undefined) {
                            vehicleOptionModel = '';
                        }

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {

                            $scope.vehicleOptionModelData = {
                                // radio
                                RADIO_AFTER_BRAND: vehicleOptionModel.RADIO_AFTER_BRAND,
                                RADIO_EQUIOMENT: vehicleOptionModel.RADIO_EQUIOMENT,
                                GPS_NAVIGATION_SYSTEM_INSTALLED: vehicleOptionModel.GPS_NAVIGATION_SYSTEM_INSTALLED,
                                GPS_NAVIGATION_INSTALLED_PERMANENTLY: vehicleOptionModel.GPS_NAVIGATION_INSTALLED_PERMANENTLY,
                                RADIO_EQUIPMENT_DASHBOARD: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_DASHBOARD),
                                RADIO_FACTORY_INSTALLED: $scope.boolTobit(vehicleOptionModel.RADIO_FACTORY_INSTALLED),
                                //Antitheft

                                ANTITHEFT_NONE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_NONE),
                                ANTITHEFT_MODEL: vehicleOptionModel.ANTITHEFT_MODEL,
                                ANTITHEFT_BRAND: vehicleOptionModel.ANTITHEFT_BRAND,
                                ANTITHEFT_INOPERATIVE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_INOPERATIVE),
                                ANTITHEFT_AUTO_RECOVERY_SYSTEM: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_AUTO_RECOVERY_SYSTEM),
                                ANTITHEFT_PASSIVE_DISABLE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_PASSIVE_DISABLE),
                                ANTITHEFT_ACTIVE_DISABLE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_ACTIVE_DISABLE),
                                ANTITHEFT_AUDIBLE_ALARM_ONLY: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_AUDIBLE_ALARM_ONLY),
                                ANTITHEFT_COMBAT_AUTO_THEFT: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_COMBAT_AUTO_THEFT),
                                ANTITHEFT_ETCHED_GLASS_CODING: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_ETCHED_GLASS_CODING),

                                MANUFACTURER: $scope.boolTobit(vehicleOptionModel.MANUFACTURER),
                                AFTER_MARKET: $scope.boolTobit(vehicleOptionModel.AFTER_MARKET),

                                CUSTOM_MAG_WHEELS: $scope.boolTobit(vehicleOptionModel.CUSTOM_MAG_WHEELS),
                                SPECIAL_HUB_CAPS: $scope.boolTobit(vehicleOptionModel.SPECIAL_HUB_CAPS),
                                SPECIAL_HUB_CAP_QUANTITY: vehicleOptionModel.SPECIAL_HUB_CAP_QUANTITY, //need here string beacuse this is text field
                                SPECIAL_TIRES: $scope.boolTobit(vehicleOptionModel.SPECIAL_TIRES),
                                SPECIAL_TIRES_TYPE: vehicleOptionModel.SPECIAL_TIRES_TYPE,
                                SPOILER: $scope.boolTobit(vehicleOptionModel.SPOILER),
                                SUNROOF: $scope.boolTobit(vehicleOptionModel.SUNROOF),
                                SUNROOF_MOTORIZED: $scope.boolTobit(vehicleOptionModel.SUNROOF_MOTORIZED),
                                REAR_WINDOW_WIPER: $scope.boolTobit(vehicleOptionModel.REAR_WINDOW_WIPER),
                                DAYTIME_RUNNING_LIGHTS: $scope.boolTobit(vehicleOptionModel.DAYTIME_RUNNING_LIGHTS),
                                BLIND_SPOT_DETECTION_SYSTEM: $scope.boolTobit(vehicleOptionModel.BLIND_SPOT_DETECTION_SYSTEM),
                                BACKUP_CAMERA: $scope.boolTobit(vehicleOptionModel.BACKUP_CAMERA),
                                COLLISION_AVOIDANCE_SYSTEM: $scope.boolTobit(vehicleOptionModel.COLLISION_AVOIDANCE_SYSTEM),
                                BACKUP_SENSOR: $scope.boolTobit(vehicleOptionModel.BACKUP_SENSOR),
                                SEATS_AUTOMATIC_BELT: $scope.boolTobit(vehicleOptionModel.SEATS_AUTOMATIC_BELT),
                                SEATS_POWER: $scope.boolTobit(vehicleOptionModel.SEATS_POWER),
                                SEATS_HEATED: $scope.boolTobit(vehicleOptionModel.SEATS_HEATED),
                                SEATS_LUMBAR: $scope.boolTobit(vehicleOptionModel.SEATS_LUMBAR),
                                INSTRU_AIRCONDITIONER: $scope.boolTobit(vehicleOptionModel.INSTRU_AIRCONDITIONER),
                                INSTRU_DIGITAL: $scope.boolTobit(vehicleOptionModel.INSTRU_DIGITAL),
                                INSTRU_CRUISECONTROL: $scope.boolTobit(vehicleOptionModel.INSTRU_CRUISECONTROL),
                                INSTRU_TILTWHEEL: $scope.boolTobit(vehicleOptionModel.INSTRU_TILTWHEEL),
                                INSTRU_POWERWINDOWS: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERWINDOWS),
                                INSTRU_POWERLOCKDOORS: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERLOCKDOORS),
                                INSTRU_POWERSTEERING: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERSTEERING),
                                INSTRU_POWERANTENNA: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERANTENNA),
                                INSTRU_POWERTRUNK: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERTRUNK),
                                INSTRU_POWERMIROR: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERMIROR),

                                SAFTY_ANTILOCK_BRAKES: $scope.boolTobit(vehicleOptionModel.SAFTY_ANTILOCK_BRAKES),
                                SAFTY_FRONT_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_FRONT_AIRBAG),
                                SAFTY_FRONT_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_FRONT_AIRBAG_NUMBER,
                                SAFTY_SIDE_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_SIDE_AIRBAG),
                                SAFTY_SIDE_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_SIDE_AIRBAG_NUMBER,
                                SAFTY_REAR_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_REAR_AIRBAG),
                                SAFTY_REAR_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_REAR_AIRBAG_NUMBER,
                                VINValue: $scope.boolTobit(vehicleOptionModel.VINValue),
                                IS_VAN_OR_LIMO: $scope.boolTobit(vehicleOptionModel.IS_VAN_OR_LIMO),
                                IS_OTHER_EQUIPMENT: $scope.boolTobit(vehicleOptionModel.IS_OTHER_EQUIPMENT),

                                RADIO_EQUIPMENT_AM_FM: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_AM_FM),
                                RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER),
                                RADIO_EQUIPMENT_FM_CD_PLAYER: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_FM_CD_PLAYER),
                                RADIO_EQUIPMENT_SATELLITE_RADIO: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_SATELLITE_RADIO),

                                //newjercy ANTI_THEFT
                                ANTI_THEFT_NONE_NEW_JERCY: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_NONE_NEW_JERCY),

                                ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE),

                                ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR),

                                ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL),

                                ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL),

                                ANTI_THEFT_G_WINDOW_GLASS_ETCHING: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_G_WINDOW_GLASS_ETCHING),

                                ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL),

                                ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH),

                                ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK),

                                ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC),

                                ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM),

                                ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE),

                                ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH),

                                ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC),

                                ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT),

                                ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE),

                                ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE),

                                OTHER_OPTIONAL_EQUIPMENT: vehicleOptionModel.OTHER_OPTIONAL_EQUIPMENT,
                                PAGE: 4,
                                INSURED_APPLICATION_ID: sessionStorage.clientID,
                                UPDATE: true,
                                SITE_ID: sessionStorage.siteId
                            };

                            if (sessionStorage.clientID != null) {

                                $scope.vehicleOptionModelData.INSURED_APPLICATION_ID = sessionStorage.clientID;

                            }

                            if (vehicleOptionModel.IS_VAN_OR_LIMO == true) {
                                $scope.vehicleOptionModelData.INTERIROR_PANELING = $scope.boolTobit(vehicleOptionModel.INTERIROR_PANELING);
                                $scope.vehicleOptionModelData.REAR_PASSENGER_SEATING = $scope.boolTobit(vehicleOptionModel.REAR_PASSENGER_SEATING);
                                $scope.vehicleOptionModelData.EXTERIOR_DECORATIVE_PAINT = $scope.boolTobit(vehicleOptionModel.EXTERIOR_DECORATIVE_PAINT);
                                $scope.vehicleOptionModelData.NON_FACTORY_INSTALLED_AC = $scope.boolTobit(vehicleOptionModel.NON_FACTORY_INSTALLED_AC);
                                $scope.vehicleOptionModelData.CUSTOMIZED_WINDOWS = $scope.boolTobit(vehicleOptionModel.CUSTOMIZED_WINDOWS);
                                $scope.vehicleOptionModelData.STEREO = $scope.boolTobit(vehicleOptionModel.STEREO);
                                $scope.vehicleOptionModelData.REFRIGERATOR = $scope.boolTobit(vehicleOptionModel.REFRIGERATOR);
                                $scope.vehicleOptionModelData.TELEVISION_VCR_DVD = $scope.boolTobit(vehicleOptionModel.TELEVISION_VCR_DVD);
                                $scope.vehicleOptionModelData.TELEVISION_VCR_DVD_PERMANENT = $scope.boolTobit(vehicleOptionModel.TELEVISION_VCR_DVD_PERMANENT);
                                $scope.vehicleOptionModelData.OTHER = $scope.boolTobit(vehicleOptionModel.OTHER);
                                $scope.vehicleOptionModelData.OTHER_DESCRIPTION = vehicleOptionModel.OTHER_DESCRIPTION;
                            }

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleOptionModelData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(9, forward = false);
                                    $rootScope.formStateValidation.pageFour = true;
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

                            $scope.vehicleOptionModelData = {
                                // radio
                                RADIO_AFTER_BRAND: vehicleOptionModel.RADIO_AFTER_BRAND,
                                RADIO_EQUIOMENT: vehicleOptionModel.RADIO_EQUIOMENT,
                                GPS_NAVIGATION_SYSTEM_INSTALLED: vehicleOptionModel.GPS_NAVIGATION_SYSTEM_INSTALLED,
                                GPS_NAVIGATION_INSTALLED_PERMANENTLY: vehicleOptionModel.GPS_NAVIGATION_INSTALLED_PERMANENTLY,
                                RADIO_EQUIPMENT_DASHBOARD: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_DASHBOARD),
                                RADIO_FACTORY_INSTALLED: $scope.boolTobit(vehicleOptionModel.RADIO_FACTORY_INSTALLED),
                                //Antitheft

                                ANTITHEFT_NONE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_NONE),
                                ANTITHEFT_MODEL: vehicleOptionModel.ANTITHEFT_MODEL,
                                ANTITHEFT_BRAND: vehicleOptionModel.ANTITHEFT_BRAND,
                                ANTITHEFT_INOPERATIVE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_INOPERATIVE),
                                ANTITHEFT_AUTO_RECOVERY_SYSTEM: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_AUTO_RECOVERY_SYSTEM),
                                ANTITHEFT_PASSIVE_DISABLE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_PASSIVE_DISABLE),
                                ANTITHEFT_ACTIVE_DISABLE: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_ACTIVE_DISABLE),
                                ANTITHEFT_AUDIBLE_ALARM_ONLY: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_AUDIBLE_ALARM_ONLY),
                                ANTITHEFT_COMBAT_AUTO_THEFT: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_COMBAT_AUTO_THEFT),
                                ANTITHEFT_ETCHED_GLASS_CODING: $scope.boolTobit(vehicleOptionModel.ANTITHEFT_ETCHED_GLASS_CODING),

                                MANUFACTURER: $scope.boolTobit(vehicleOptionModel.MANUFACTURER),
                                AFTER_MARKET: $scope.boolTobit(vehicleOptionModel.AFTER_MARKET),

                                CUSTOM_MAG_WHEELS: $scope.boolTobit(vehicleOptionModel.CUSTOM_MAG_WHEELS),
                                SPECIAL_HUB_CAPS: $scope.boolTobit(vehicleOptionModel.SPECIAL_HUB_CAPS),
                                SPECIAL_HUB_CAP_QUANTITY: vehicleOptionModel.SPECIAL_HUB_CAP_QUANTITY, //need here string beacuse this is text field
                                SPECIAL_TIRES: $scope.boolTobit(vehicleOptionModel.SPECIAL_TIRES),
                                SPECIAL_TIRES_TYPE: vehicleOptionModel.SPECIAL_TIRES_TYPE,
                                SPOILER: $scope.boolTobit(vehicleOptionModel.SPOILER),
                                SUNROOF: $scope.boolTobit(vehicleOptionModel.SUNROOF),
                                SUNROOF_MOTORIZED: $scope.boolTobit(vehicleOptionModel.SUNROOF_MOTORIZED),
                                REAR_WINDOW_WIPER: $scope.boolTobit(vehicleOptionModel.REAR_WINDOW_WIPER),
                                DAYTIME_RUNNING_LIGHTS: $scope.boolTobit(vehicleOptionModel.DAYTIME_RUNNING_LIGHTS),
                                BLIND_SPOT_DETECTION_SYSTEM: $scope.boolTobit(vehicleOptionModel.BLIND_SPOT_DETECTION_SYSTEM),
                                BACKUP_CAMERA: $scope.boolTobit(vehicleOptionModel.BACKUP_CAMERA),
                                COLLISION_AVOIDANCE_SYSTEM: $scope.boolTobit(vehicleOptionModel.COLLISION_AVOIDANCE_SYSTEM),
                                BACKUP_SENSOR: $scope.boolTobit(vehicleOptionModel.BACKUP_SENSOR),
                                SEATS_AUTOMATIC_BELT: $scope.boolTobit(vehicleOptionModel.SEATS_AUTOMATIC_BELT),
                                SEATS_POWER: $scope.boolTobit(vehicleOptionModel.SEATS_POWER),
                                SEATS_HEATED: $scope.boolTobit(vehicleOptionModel.SEATS_HEATED),
                                SEATS_LUMBAR: $scope.boolTobit(vehicleOptionModel.SEATS_LUMBAR),
                                INSTRU_AIRCONDITIONER: $scope.boolTobit(vehicleOptionModel.INSTRU_AIRCONDITIONER),
                                INSTRU_DIGITAL: $scope.boolTobit(vehicleOptionModel.INSTRU_DIGITAL),
                                INSTRU_CRUISECONTROL: $scope.boolTobit(vehicleOptionModel.INSTRU_CRUISECONTROL),
                                INSTRU_TILTWHEEL: $scope.boolTobit(vehicleOptionModel.INSTRU_TILTWHEEL),
                                INSTRU_POWERWINDOWS: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERWINDOWS),
                                INSTRU_POWERLOCKDOORS: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERLOCKDOORS),
                                INSTRU_POWERSTEERING: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERSTEERING),
                                INSTRU_POWERANTENNA: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERANTENNA),
                                INSTRU_POWERTRUNK: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERTRUNK),
                                INSTRU_POWERMIROR: $scope.boolTobit(vehicleOptionModel.INSTRU_POWERMIROR),

                                SAFTY_ANTILOCK_BRAKES: $scope.boolTobit(vehicleOptionModel.SAFTY_ANTILOCK_BRAKES),
                                SAFTY_FRONT_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_FRONT_AIRBAG),
                                SAFTY_FRONT_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_FRONT_AIRBAG_NUMBER,
                                SAFTY_SIDE_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_SIDE_AIRBAG),
                                SAFTY_SIDE_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_SIDE_AIRBAG_NUMBER,
                                SAFTY_REAR_AIRBAG: $scope.boolTobit(vehicleOptionModel.SAFTY_REAR_AIRBAG),
                                SAFTY_REAR_AIRBAG_NUMBER: vehicleOptionModel.SAFTY_REAR_AIRBAG_NUMBER,
                                VINValue: $scope.boolTobit(vehicleOptionModel.VINValue),
                                IS_VAN_OR_LIMO: $scope.boolTobit(vehicleOptionModel.IS_VAN_OR_LIMO),
                                IS_OTHER_EQUIPMENT: $scope.boolTobit(vehicleOptionModel.IS_OTHER_EQUIPMENT),

                                RADIO_EQUIPMENT_AM_FM: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_AM_FM),
                                RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER),
                                RADIO_EQUIPMENT_FM_CD_PLAYER: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_FM_CD_PLAYER),
                                RADIO_EQUIPMENT_SATELLITE_RADIO: $scope.boolTobit(vehicleOptionModel.RADIO_EQUIPMENT_SATELLITE_RADIO),

                                //newjercy ANTI_THEFT
                                ANTI_THEFT_NONE_NEW_JERCY: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_NONE_NEW_JERCY),

                                ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE),

                                ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR),

                                ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL),

                                ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL),

                                ANTI_THEFT_G_WINDOW_GLASS_ETCHING: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_G_WINDOW_GLASS_ETCHING),

                                ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL),

                                ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH),

                                ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK),

                                ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC),

                                ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM),

                                ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE),

                                ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH),

                                ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC),

                                ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT),

                                ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC),

                                ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE),

                                ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE: $scope.boolTobit(vehicleOptionModel.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE),

                                OTHER_OPTIONAL_EQUIPMENT: vehicleOptionModel.OTHER_OPTIONAL_EQUIPMENT,
                                PAGE: 4,
                                INSURED_APPLICATION_ID: sessionStorage.clientID,
                                UPDATE: true
                            };

                            if (sessionStorage.formId != null) {

                                $scope.vehicleOptionModelData.INSURED_APPLICATION_ID = sessionStorage.formId;

                            }

                            if (vehicleOptionModel.IS_VAN_OR_LIMO == true) {
                                $scope.vehicleOptionModelData.INTERIROR_PANELING = $scope.boolTobit(vehicleOptionModel.INTERIROR_PANELING);
                                $scope.vehicleOptionModelData.REAR_PASSENGER_SEATING = $scope.boolTobit(vehicleOptionModel.REAR_PASSENGER_SEATING);
                                $scope.vehicleOptionModelData.EXTERIOR_DECORATIVE_PAINT = $scope.boolTobit(vehicleOptionModel.EXTERIOR_DECORATIVE_PAINT);
                                $scope.vehicleOptionModelData.NON_FACTORY_INSTALLED_AC = $scope.boolTobit(vehicleOptionModel.NON_FACTORY_INSTALLED_AC);
                                $scope.vehicleOptionModelData.CUSTOMIZED_WINDOWS = $scope.boolTobit(vehicleOptionModel.CUSTOMIZED_WINDOWS);
                                $scope.vehicleOptionModelData.STEREO = $scope.boolTobit(vehicleOptionModel.STEREO);
                                $scope.vehicleOptionModelData.REFRIGERATOR = $scope.boolTobit(vehicleOptionModel.REFRIGERATOR);
                                $scope.vehicleOptionModelData.TELEVISION_VCR_DVD = $scope.boolTobit(vehicleOptionModel.TELEVISION_VCR_DVD);
                                $scope.vehicleOptionModelData.TELEVISION_VCR_DVD_PERMANENT = $scope.boolTobit(vehicleOptionModel.TELEVISION_VCR_DVD_PERMANENT);
                                $scope.vehicleOptionModelData.OTHER = $scope.boolTobit(vehicleOptionModel.OTHER);
                                $scope.vehicleOptionModelData.OTHER_DESCRIPTION = vehicleOptionModel.OTHER_DESCRIPTION;
                            }

                            var deferred = $q.defer();

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.vehicleOptionModelData, header)
                                .then(function (response) {

                                    $rootScope.isProcessShow(false);

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});

                                    if (sessionStorage.status === 'pending') {
                                        $rootScope.$broadcast('callInspectSummary', true);
                                    }
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(9, forward = false);
                                    $rootScope.formStateValidation.pageFour = true;

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

                $scope.DATA = {
                    PAGE: 4,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0,
                    USER_NAME: sessionStorage.userDispalyName
                };

                $scope.onLoad = function () {
                    gPageNumber = 0;

                    // $rootScope.sessionLogout();

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };
                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {

                            $scope.vehicleOptionModel = {
                                // radio
                                RADIO_EQUIOMENT: response.data.RADIO_EQUIOMENT,
                                RADIO_AFTER_BRAND: response.data.RADIO_AFTER_BRAND,
                                GPS_NAVIGATION_SYSTEM_INSTALLED: response.data.GPS_NAVIGATION_SYSTEM_INSTALLED,
                                GPS_NAVIGATION_INSTALLED_PERMANENTLY: response.data.GPS_NAVIGATION_INSTALLED_PERMANENTLY,
                                RADIO_EQUIPMENT_DASHBOARD: response.data.RADIO_EQUIPMENT_DASHBOARD,
                                RADIO_FACTORY_INSTALLED: response.data.RADIO_FACTORY_INSTALLED,
                                //Antitheft

                                ANTITHEFT_NONE: response.data.ANTITHEFT_NONE,
                                ANTITHEFT_MODEL: response.data.ANTITHEFT_MODEL,
                                ANTITHEFT_BRAND: response.data.ANTITHEFT_BRAND,
                                ANTITHEFT_INOPERATIVE: response.data.ANTITHEFT_INOPERATIVE,
                                ANTITHEFT_AUTO_RECOVERY_SYSTEM: response.data.ANTITHEFT_AUTO_RECOVERY_SYSTEM,
                                ANTITHEFT_PASSIVE_DISABLE: response.data.ANTITHEFT_PASSIVE_DISABLE,
                                ANTITHEFT_ACTIVE_DISABLE: response.data.ANTITHEFT_ACTIVE_DISABLE,
                                ANTITHEFT_AUDIBLE_ALARM_ONLY: response.data.ANTITHEFT_AUDIBLE_ALARM_ONLY,
                                ANTITHEFT_COMBAT_AUTO_THEFT: response.data.ANTITHEFT_COMBAT_AUTO_THEFT,
                                ANTITHEFT_ETCHED_GLASS_CODING: response.data.ANTITHEFT_ETCHED_GLASS_CODING,
                                MANUFACTURER: response.data.MANUFACTURER,
                                AFTER_MARKET: response.data.AFTER_MARKET,

                                CUSTOM_MAG_WHEELS: response.data.CUSTOM_MAG_WHEELS,
                                SPECIAL_HUB_CAPS: response.data.SPECIAL_HUB_CAPS,
                                SPECIAL_HUB_CAP_QUANTITY: response.data.SPECIAL_HUB_CAP_QUANTITY,
                                SPECIAL_TIRES: response.data.SPECIAL_TIRES,
                                SPECIAL_TIRES_TYPE: response.data.SPECIAL_TIRES_TYPE,
                                SPOILER: response.data.SPOILER,
                                SUNROOF: response.data.SUNROOF,
                                SUNROOF_MOTORIZED: response.data.SUNROOF_MOTORIZED,
                                REAR_WINDOW_WIPER: response.data.REAR_WINDOW_WIPER,
                                DAYTIME_RUNNING_LIGHTS: response.data.DAYTIME_RUNNING_LIGHTS,
                                BLIND_SPOT_DETECTION_SYSTEM: response.data.BLIND_SPOT_DETECTION_SYSTEM,
                                BACKUP_CAMERA: response.data.BACKUP_CAMERA,
                                COLLISION_AVOIDANCE_SYSTEM: response.data.COLLISION_AVOIDANCE_SYSTEM,
                                BACKUP_SENSOR: response.data.BACKUP_SENSOR,
                                SEATS_AUTOMATIC_BELT: response.data.SEATS_AUTOMATIC_BELT,
                                SEATS_POWER: response.data.SEATS_POWER,
                                SEATS_HEATED: response.data.SEATS_HEATED,
                                SEATS_LUMBAR: response.data.SEATS_LUMBAR,
                                INSTRU_AIRCONDITIONER: response.data.INSTRU_AIRCONDITIONER,
                                INSTRU_DIGITAL: response.data.INSTRU_DIGITAL,
                                INSTRU_CRUISECONTROL: response.data.INSTRU_CRUISECONTROL,
                                INSTRU_TILTWHEEL: response.data.INSTRU_TILTWHEEL,
                                INSTRU_POWERWINDOWS: response.data.INSTRU_POWERWINDOWS,
                                INSTRU_POWERLOCKDOORS: response.data.INSTRU_POWERLOCKDOORS,
                                INSTRU_POWERSTEERING: response.data.INSTRU_POWERSTEERING,
                                INSTRU_POWERANTENNA: response.data.INSTRU_POWERANTENNA,
                                INSTRU_POWERTRUNK: response.data.INSTRU_POWERTRUNK,
                                INSTRU_POWERMIROR: response.data.INSTRU_POWERMIROR,

                                SAFTY_ANTILOCK_BRAKES: response.data.SAFTY_ANTILOCK_BRAKES,
                                SAFTY_FRONT_AIRBAG: response.data.SAFTY_FRONT_AIRBAG,
                                SAFTY_FRONT_AIRBAG_NUMBER: response.data.SAFTY_FRONT_AIRBAG_NUMBER,
                                SAFTY_SIDE_AIRBAG: response.data.SAFTY_SIDE_AIRBAG,
                                SAFTY_REAR_AIRBAG: response.data.SAFTY_REAR_AIRBAG,
                                SAFTY_SIDE_AIRBAG_NUMBER: response.data.SAFTY_SIDE_AIRBAG_NUMBER,
                                SAFTY_REAR_AIRBAG_NUMBER: response.data.SAFTY_REAR_AIRBAG_NUMBER,
                                VINValue: response.data.VINValue,

                                IS_VAN_OR_LIMO: response.data.IS_VAN_OR_LIMO,
                                IS_OTHER_EQUIPMENT: response.data.IS_OTHER_EQUIPMENT,

                                RADIO_EQUIPMENT_AM_FM: response.data.RADIO_EQUIPMENT_AM_FM,
                                RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER: response.data.RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER,
                                RADIO_EQUIPMENT_FM_CD_PLAYER: response.data.RADIO_EQUIPMENT_FM_CD_PLAYER,
                                RADIO_EQUIPMENT_SATELLITE_RADIO: response.data.RADIO_EQUIPMENT_SATELLITE_RADIO,

                                //newjercy ANTI_THEFT
                                ANTI_THEFT_NONE_NEW_JERCY: response.data.ANTI_THEFT_NONE_NEW_JERCY,

                                ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE: response.data.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE,

                                ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR: response.data.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR,

                                ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL: response.data.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL,

                                ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL: response.data.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL,

                                ANTI_THEFT_G_WINDOW_GLASS_ETCHING: response.data.ANTI_THEFT_G_WINDOW_GLASS_ETCHING,

                                ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL: response.data.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL,

                                ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH: response.data.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH,

                                ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK: response.data.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK,

                                ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC: response.data.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC,

                                ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM: response.data.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM,

                                ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE: response.data.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE,

                                ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH: response.data.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH,

                                ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC: response.data.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC,

                                ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC: response.data.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC,

                                ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT: response.data.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT,

                                ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC: response.data.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC,

                                ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC: response.data.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC,

                                ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE: response.data.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE,

                                ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE: response.data.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE,

                                OTHER_OPTIONAL_EQUIPMENT: response.data.OTHER_OPTIONAL_EQUIPMENT
                            };

                            $scope.vehicleOptionModel.COLOR_MINOR = response.data.COLOR_MINOR;

                            //if ($scope.vehicleOptionModel.IS_VAN_OR_LIMO == true) {
                            $scope.vehicleOptionModel.INTERIROR_PANELING = response.data.INTERIROR_PANELING;
                            $scope.vehicleOptionModel.REAR_PASSENGER_SEATING = response.data.REAR_PASSENGER_SEATING;
                            $scope.vehicleOptionModel.EXTERIOR_DECORATIVE_PAINT = response.data.EXTERIOR_DECORATIVE_PAINT;
                            $scope.vehicleOptionModel.NON_FACTORY_INSTALLED_AC = response.data.NON_FACTORY_INSTALLED_AC;
                            $scope.vehicleOptionModel.CUSTOMIZED_WINDOWS = response.data.CUSTOMIZED_WINDOWS;
                            $scope.vehicleOptionModel.STEREO = response.data.STEREO;
                            $scope.vehicleOptionModel.REFRIGERATOR = response.data.REFRIGERATOR;
                            $scope.vehicleOptionModel.TELEVISION_VCR_DVD = response.data.TELEVISION_VCR_DVD;
                            $scope.vehicleOptionModel.TELEVISION_VCR_DVD_PERMANENT = response.data.TELEVISION_VCR_DVD_PERMANENT;
                            $scope.vehicleOptionModel.OTHER = response.data.OTHER;
                            $scope.vehicleOptionModel.OTHER_DESCRIPTION = response.data.OTHER_DESCRIPTION;
                            // }

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