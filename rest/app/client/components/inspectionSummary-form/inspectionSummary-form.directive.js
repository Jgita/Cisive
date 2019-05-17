app.directive('inspectionSummaryForm', [
    '$uibModal',
    '$rootScope',
    '$q',
    'WizardHandler',
    '$anchorScroll',
    '$http',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($uibModal, $rootScope, $q, WizardHandler, $anchorScroll, $http, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/inspectionSummary-form/inspectionSummary-form.view.ht' +
                    'ml',
            link: function ($scope, $elem, $attr) {
                $scope.date = moment().format("MM/DD/YYYY");
                $scope.dataLoading = true;
                $scope.dynamicBtnName = 'Submit';
                $scope.noneProvided = '<NONE PROVIDED>'
                $rootScope.isDisabledInsuredSignOnce = false;

                $rootScope.isInsuredSing = true;

                $scope.editWizardPage = function (step) {

                    WizardService.wizardContinue(step, false);
                    if (step == 0) {
                        $anchorScroll();

                        WizardService.setProgressLine(1, forward = false);
                    } else {
                        $anchorScroll();
                        WizardService.setProgressLine(step, forward = false);
                    }
                    WizardHandler
                        .wizard()
                        .goTo(step);

                }

                // modal for Insured Signature
                $scope.showModal = function () {
                    $rootScope.isProcessShow(true);
                    $rootScope.isDisabledInsuredSignOnce = true; // To disable Button
                    if (sessionStorage.accessToken) {
                        var userNameL = sessionStorage.userDispalyName;
                        var lowerCaseUserName = userNameL.toLowerCase();
                        var header = {
                            "Content-Type": "application/json"
                        };

                        if (sessionStorage.siteId) {
                            $scope.siteidAI = sessionStorage.siteId
                        } else {
                            $scope.siteidAI = '0';
                        }

                        var data = {
                            username: lowerCaseUserName,
                            token: sessionStorage.accessToken,
                            humag_expert_flag: 'Not_human_expert',
                            siteid: $scope.siteidAI
                        };

                        globalService
                            .globalSessionCheck("POST", "token_verification", data, header)
                            .then(function (response) {
                                $rootScope.isProcessShow(false);
                                if (response.data.Result == "unauthorised") {
                                    $rootScope.allReadyLogin();
                                    localStorage.clear();
                                    sessionStorage.clear();
                                } else if (response.data.Result == "fail" && $rootScope.IdleModel != true) {
                                    $uibModal.open({
                                        backdrop: 'static',
                                        backdropClick: false,
                                        dialogFade: false,
                                        keyboard: false,
                                        size: 'md',
                                        templateUrl: 'rest/app/client/components/photoMissing-model/photoMissing-model.view.html',
                                        controller: 'photoMissingModelController',
                                        resolve: {
                                            items: function () {
                                                return 'It seems server is not responding, Please try after some time.';
                                            }
                                        }
                                        })
                                        .result
                                        .then(function (response) {}, function () {});

                                } else {
                                    $rootScope.isProcessShow(false);
                                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {
                                        if ($rootScope.formStateValidation.pageFive != true) {
                                            toastr.error(CONSTANTS.fillRequiredField, {timeOut: 5000})
                                            WizardHandler
                                                .wizard()
                                                .goTo(4);
                                            return;
                                        }
                                    }
                                    $uibModal
                                        .open({
                                            backdrop: 'static',
                                            backdropClick: false,
                                            dialogFade: false,
                                            keyboard: false,
                                            templateUrl: 'rest/app/client/components/insuredSignature-modal/insuredSignature-modal.html',
                                            controller: 'insuredSignModalController'
                                        })
                                        .result
                                        .then(function () {}, function () {});
                                }
                            }, function () {
                                $rootScope.isProcessShow(false);
                                toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                            });

                    }
                }

                // modal for Inspector Signature
                $scope.showInspectorModal = function () {
                    $rootScope.isProcessShow(true);
                    if (sessionStorage.accessToken) {
                        var userNameL = sessionStorage.userDispalyName;
                        var lowerCaseUserName = userNameL.toLowerCase();

                        var header = {
                            "Content-Type": "application/json"
                        };

                        if (sessionStorage.siteId) {
                            $scope.siteidAI = sessionStorage.siteId
                        } else {
                            $scope.siteidAI = '0';
                        }
                        var data = {
                            username: lowerCaseUserName,
                            token: sessionStorage.accessToken,
                            humag_expert_flag: 'Not_human_expert',
                            siteid: $scope.siteidAI
                        };

                        globalService
                            .globalSessionCheck("POST", "token_verification", data, header)
                            .then(function (response) {
                                $rootScope.isProcessShow(false);
                                if (response.data.Result == "unauthorised") {
                                    $rootScope.allReadyLogin();
                                    localStorage.clear();
                                    sessionStorage.clear();
                                } else {
                                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {
                                        if ($rootScope.formStateValidation.pageFive != true) {
                                            toastr.error(CONSTANTS.fillRequiredField, {timeOut: 5000})
                                            WizardHandler
                                                .wizard()
                                                .goTo(4);
                                            return;
                                        }
                                    }
                                    $uibModal
                                        .open({
                                            backdrop: 'static',
                                            backdropClick: false,
                                            dialogFade: false,
                                            keyboard: false,
                                            templateUrl: 'rest/app/client/components/inspectorSignature-modal/inspectorSignature-modal.htm' +
                                                    'l',
                                            controller: 'inspectorSignModalController'
                                        })
                                        .result
                                        .then(function () {}, function () {});
                                }
                            }, function () {
                                $rootScope.isProcessShow(false);
                                toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                            });
                    }

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
                }

                $scope.DATA = {
                    PAGE: 6,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0
                }

                $scope.onLoad = function () {
                    $anchorScroll();
                    gPageNumber = 0;
                    $rootScope.isProcessShow(true);
                    var deferred = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }
                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {
                            $rootScope.isProcessShow(false);
                            $scope.licesePlate = response.data[0].LICENSE_PLATE_NA;
                            $scope.colorMinorcode = response.data[0].COLOR_MINOR_Id;
                            $scope.colorMajorcode = response.data[0].COLOR_MAJOR_Id;

                            sessionStorage.PDFID = response.data[0].USERID;

                            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                                $scope.siteID = 'N/A';
                                $scope.inspectorName = 'N/A'
                                $scope.siteName = 'N/A';
                                $scope.siteLocation = 'N/A';
                                $scope.inspectorFirstName = 'N/A';
                                $scope.userEmail = 'N/A'
                                $scope.dispalyIdInspector = false;
                                $scope.inspectorSignVisibility = false;

                            } else {
                                $scope.siteID = sessionStorage.siteId;
                                $scope.dispalyIdInspector = true;
                                $scope.inspectorSignVisibility = true;
                                $scope.userEmail = sessionStorage.userDispalyName;
                                if (sessionStorage.siteName) {

                                    $scope.siteName = sessionStorage.siteName;
                                    $scope.siteLocation = sessionStorage.siteLocation;

                                } else {

                                    $scope.siteName = 'N/A';
                                    $scope.siteLocation = 'N/A';
                                }
                            }
                            if (response.data[1]) {
                                $scope.inspectionSummaryResp = {

                                    ADVERSE_CONDITIONS: response.data[1].ADVERSE_CONDITIONS,
                                    INSPECTION_COMPANY_NAME: response.data[1].INSPECTION_COMPANY_NAME,
                                    INSURANCE_COMPANY_NAME_OTHER: response.data[1].INSURANCE_COMPANY_NAME_OTHER,
                                    POLICY_NUMBER: response.data[0].POLICY_NUMBER,
                                    IS_COMMERCIAL_VEHICLE: response.data[0].IS_COMMERCIAL_VEHICLE,
                                    INSURED_FIRST_NAME: response.data[0].INSURED_FIRST_NAME,
                                    INSURED_LAST_NAME: response.data[0].INSURED_LAST_NAME,
                                    INSURED_ADDRESS: response.data[0].INSURED_ADDRESS,
                                    INSURED_ZIPCODE: response.data[0].INSURED_ZIPCODE,
                                    INSURED_CELL_PHONE: response.data[0].INSURED_CELL_PHONE,
                                    Landline: response.data[0].Landline,
                                    INSURED_WORK_PHONE: response.data[0].INSURED_WORK_PHONE,
                                    INSURED_EMAIL: response.data[0].INSURED_EMAIL,
                                    INSURED_STATE_CODE: response.data[1].INSURED_STATE_CODE,
                                    INSPECTION_DATE: response.data[0].INSPECTION_DATE,
                                    INSURED_TOWN: response.data[0].INSURED_TOWN,
                                    IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED: response.data[0].IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED,

                                    ARE_YOU_INSURED: response.data[0].ARE_YOU_INSURED,
                                    INSURED_PRINT_LNAME: response.data[1].INSURED_PRINT_LNAME,
                                    INSURED_PRINT_FNAME: response.data[1].INSURED_PRINT_FNAME,
                                    ADDITIONAL_INFO_ADDRESS: response.data[1].ADDITIONAL_INFO_ADDRESS,
                                    ADDITIONAL_INFO_ADDRESS_TWO: response.data[1].ADDITIONAL_INFO_ADDRESS_TWO,
                                    ADDITIONAL_INFO_TOWN: response.data[1].ADDITIONAL_INFO_TOWN,
                                    ADDITIONAL_INFO_STATE: response.data[1].ADDITIONAL_INFO_STATE,
                                    ADDITIONAL_INFO_ZIPCODE: response.data[1].ADDITIONAL_INFO_ZIPCODE,
                                    RELATIONSHIP_TO_CAR_OWNER: response.data[1].RELATIONSHIP_TO_CAR_OWNER,
                                    BROKER_NAME: response.data[0].BROKER_NAME,

                                    AUTHORIZATION_FORM_NUMBER: response.data[0].AUTHORIZATION_FORM_NUMBER,
                                    YEAR: response.data[1].YEAR,
                                    MAKE: response.data[0].MAKE,
                                    ModelName: response.data[1].ModelName,
                                    MODEL_ID: response.data[0].MODEL_ID,
                                    MODEL_OTHER: response.data[0].MODEL_OTHER,
                                    TRANSMISSION: response.data[1].TRANSMISSION,
                                    VEHICLE_IDENTIFICATION_NUMBER: response.data[0].VEHICLE_IDENTIFICATION_NUMBER,
                                    LICENSE_PLATE: response.data[0].LICENSE_PLATE,
                                    LICENSE_PLATE_NA: response.data[0].LICENSE_PLATE,
                                    VIN_LOCATION_ON_VEHICLE: response.data[0].VIN_LOCATION_ON_VEHICLE,
                                    VIN_LOCATION_ON_VEHICLE_DESCRIBE: response.data[0].VIN_LOCATION_ON_VEHICLE_DESCRIBE,
                                    GARAGE_SAME_AS_INSURED_ADDRESSS: response.data[0].GARAGE_SAME_AS_INSURED_ADDRESSS,
                                    GARAGE_CITY: response.data[0].GARAGE_CITY,
                                    GARAGE_STATE_Id: response.data[0].GARAGE_STATE_Id,
                                    COLOR_MAJOR: response.data[1].COLOR_MAJOR,
                                    COLOR_MAJOR_OTHER: response.data[0].COLOR_MAJOR_OTHER,
                                    COLOR_MINOR_OTHER: response.data[0].COLOR_MINOR_OTHER,
                                    STYLE_OTHER: response.data[0].STYLE_OTHER,
                                    COLOR_MINOR: response.data[1].COLOR_MINOR,
                                    SEAT_MATERIAL: response.data[1].SEAT_MATERIAL,
                                    STATE: response.data[1].STATE,
                                    IS_EPA_STICKER_MISSING: response.data[0].IS_EPA_STICKER_MISSING,
                                    STYLE: response.data[1].STYLE,
                                    FRONT_SEAT_COLOR: response.data[0].FRONT_SEAT_COLOR,
                                    ODOMETER: response.data[0].ODOMETER,

                                    RADIO_FACTORY_INSTALLED: response.data[0].RADIO_FACTORY_INSTALLED, //brand
                                    RADIO_AFTER_BRAND: response.data[0].RADIO_AFTER_BRAND,
                                    RADIO_EQUIOMENT: response.data[0].RADIO_EQUIOMENT,
                                    GPS_NAVIGATION_SYSTEM_INSTALLED: response.data[0].GPS_NAVIGATION_SYSTEM_INSTALLED,
                                    GPS_NAVIGATION_INSTALLED_PERMANENTLY: response.data[0].GPS_NAVIGATION_INSTALLED_PERMANENTLY,

                                    RADIO_EQUIPMENT_AM_FM: response.data[1].RADIO_EQUIPMENT_AM_FM,
                                    RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER: response.data[1].RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER,
                                    RADIO_EQUIPMENT_FM_CD_PLAYER: response.data[1].RADIO_EQUIPMENT_FM_CD_PLAYER,
                                    RADIO_EQUIPMENT_DASHBOARD: response.data[0].RADIO_EQUIPMENT_DASHBOARD,
                                    RADIO_EQUIPMENT_SATELLITE_RADIO: response.data[1].RADIO_EQUIPMENT_SATELLITE_RADIO,

                                    // ANTITHEFT
                                    ANTITHEFT_NONE: response.data[0].ANTITHEFT_NONE,
                                    ANTITHEFT_MODEL: response.data[0].ANTITHEFT_MODEL,
                                    ANTITHEFT_BRAND: response.data[0].ANTITHEFT_BRAND,
                                    ANTITHEFT_INOPERATIVE: response.data[0].ANTITHEFT_INOPERATIVE,
                                    ANTITHEFT_AUTO_RECOVERY_SYSTEM: response.data[0].ANTITHEFT_AUTO_RECOVERY_SYSTEM,
                                    ANTITHEFT_PASSIVE_DISABLE: response.data[0].ANTITHEFT_PASSIVE_DISABLE,
                                    ANTITHEFT_ACTIVE_DISABLE: response.data[0].ANTITHEFT_ACTIVE_DISABLE,
                                    ANTITHEFT_AUDIBLE_ALARM_ONLY: response.data[0].ANTITHEFT_AUDIBLE_ALARM_ONLY,
                                    ANTITHEFT_COMBAT_AUTO_THEFT: response.data[0].ANTITHEFT_COMBAT_AUTO_THEFT,
                                    ANTITHEFT_ETCHED_GLASS_CODING: response.data[0].ANTITHEFT_ETCHED_GLASS_CODING,
                                    MANUFACTURER: response.data[0].MANUFACTURER,
                                    AFTER_MARKET: response.data[0].AFTER_MARKET,

                                    //   Exterior
                                    CUSTOM_MAG_WHEELS: response.data[0].CUSTOM_MAG_WHEELS,
                                    SPECIAL_HUB_CAPS: response.data[0].SPECIAL_HUB_CAPS,
                                    SPECIAL_HUB_CAP_QUANTITY: response.data[0].SPECIAL_HUB_CAP_QUANTITY,
                                    SPECIAL_TIRES: response.data[0].SPECIAL_TIRES,
                                    SPECIAL_TIRES_TYPE: response.data[0].SPECIAL_TIRES_TYPE,
                                    SPOILER: response.data[0].SPOILER,
                                    SUNROOF: response.data[0].SUNROOF,
                                    SUNROOF_MOTORIZED: response.data[0].SUNROOF_MOTORIZED,
                                    REAR_WINDOW_WIPER: response.data[0].REAR_WINDOW_WIPER,
                                    DAYTIME_RUNNING_LIGHTS: response.data[0].DAYTIME_RUNNING_LIGHTS,
                                    BLIND_SPOT_DETECTION_SYSTEM: response.data[0].BLIND_SPOT_DETECTION_SYSTEM,
                                    BACKUP_CAMERA: response.data[0].BACKUP_CAMERA,
                                    COLLISION_AVOIDANCE_SYSTEM: response.data[0].COLLISION_AVOIDANCE_SYSTEM,
                                    BACKUP_SENSOR: response.data[0].BACKUP_SENSOR,

                                    //seats

                                    SEATS_AUTOMATIC_BELT: response.data[0].SEATS_AUTOMATIC_BELT,
                                    SEATS_POWER: response.data[0].SEATS_POWER,
                                    SEATS_HEATED: response.data[0].SEATS_HEATED,
                                    SEATS_LUMBAR: response.data[0].SEATS_LUMBAR,

                                    //Instrumentation

                                    INSTRU_AIRCONDITIONER: response.data[0].INSTRU_AIRCONDITIONER,
                                    INSTRU_DIGITAL: response.data[0].INSTRU_DIGITAL,
                                    INSTRU_CRUISECONTROL: response.data[0].INSTRU_CRUISECONTROL,
                                    INSTRU_TILTWHEEL: response.data[0].INSTRU_TILTWHEEL,
                                    INSTRU_POWERWINDOWS: response.data[0].INSTRU_POWERWINDOWS,
                                    INSTRU_POWERLOCKDOORS: response.data[0].INSTRU_POWERLOCKDOORS,
                                    INSTRU_POWERSTEERING: response.data[0].INSTRU_POWERSTEERING,
                                    INSTRU_POWERANTENNA: response.data[0].INSTRU_POWERANTENNA,
                                    INSTRU_POWERTRUNK: response.data[0].INSTRU_POWERTRUNK,
                                    INSTRU_POWERMIROR: response.data[0].INSTRU_POWERMIROR,

                                    //Safty

                                    SAFTY_ANTILOCK_BRAKES: response.data[0].SAFTY_ANTILOCK_BRAKES,
                                    SAFTY_FRONT_AIRBAG: response.data[0].SAFTY_FRONT_AIRBAG,
                                    SAFTY_FRONT_AIRBAG_NUMBER: response.data[0].SAFTY_FRONT_AIRBAG_NUMBER,
                                    SAFTY_SIDE_AIRBAG: response.data[0].SAFTY_SIDE_AIRBAG,
                                    SAFTY_SIDE_AIRBAG_NUMBER: response.data[0].SAFTY_SIDE_AIRBAG_NUMBER,
                                    SAFTY_REAR_AIRBAG: response.data[0].SAFTY_REAR_AIRBAG,
                                    SAFTY_REAR_AIRBAG_NUMBER: response.data[0].SAFTY_REAR_AIRBAG_NUMBER,

                                    IS_OTHER_EQUIPMENT: response.data[0].IS_OTHER_EQUIPMENT,
                                    OTHER_OPTIONAL_EQUIPMENT: response.data[0].OTHER_OPTIONAL_EQUIPMENT,

                                    //damaged

                                    FRONT_BUMPER_DAMAGE: response.data[2].FRONT_BUMPER_DAMAGE,
                                    REAR_BUMPER_DAMAGE: response.data[2].REAR_BUMPER_DAMAGE,
                                    FENDER_LEFT_FRONT_DAMAGE: response.data[2].FENDER_LEFT_FRONT_DAMAGE,
                                    FENDER_RIGHT_FRONT_DAMAGE: response.data[2].FENDER_RIGHT_FRONT_DAMAGE,
                                    DOOR_LEFT_FRONT_DAMAGE: response.data[2].DOOR_LEFT_FRONT_DAMAGE,
                                    DOOR_RIGHT_FRONT_DAMAGE: response.data[2].DOOR_RIGHT_FRONT_DAMAGE,
                                    DOOR_LEFT_REAR_DAMAGE: response.data[2].DOOR_LEFT_REAR_DAMAGE,
                                    DOOR_RIGHT_REAR_DAMAGE: response.data[2].DOOR_RIGHT_REAR_DAMAGE,

                                    //  Rusted new
                                    FRONT_BUMPER_RUST: response.data[2].FRONT_BUMPER_RUST,
                                    REAR_BUMPER_RUST: response.data[2].REAR_BUMPER_RUST,
                                    FENDER_LEFT_FRONT_RUST: response.data[2].FENDER_LEFT_FRONT_RUST,
                                    FENDER_RIGHT_FRONT_RUST: response.data[2].FENDER_RIGHT_FRONT_RUST,
                                    DOOR_LEFT_FRONT_RUST: response.data[2].DOOR_LEFT_FRONT_RUST,
                                    DOOR_RIGHT_FRONT_RUST: response.data[2].DOOR_RIGHT_FRONT_RUST,
                                    DOOR_LEFT_REAR_RUST: response.data[2].DOOR_LEFT_REAR_RUST,
                                    DOOR_RIGHT_REAR_RUST: response.data[2].DOOR_RIGHT_REAR_RUST,

                                    //damage new
                                    QUARTER_PANEL_LEFT_REAR_DAMAGE: response.data[2].QUARTER_PANEL_LEFT_REAR_DAMAGE,
                                    QUARTER_PANEL_RIGHT_REAR_DAMAGE: response.data[2].QUARTER_PANEL_RIGHT_REAR_DAMAGE,
                                    HOOD_PANEL_DAMAGE: response.data[2].HOOD_PANEL_DAMAGE,
                                    ROOF_PANEL_DAMAGE: response.data[2].ROOF_PANEL_DAMAGE,
                                    TRUNK_LID_DAMAGE: response.data[2].TRUNK_LID_DAMAGE,
                                    GRILL_DAMAGE: response.data[2].GRILL_DAMAGE,
                                    WHELL_COVERS_DAMAGE: response.data[2].WHELL_COVERS_DAMAGE,
                                    WINDSHIELD_DAMAGE: response.data[2].WINDSHIELD_DAMAGE,

                                    //  Rusted Damaged
                                    QUARTER_PANEL_LEFT_REAR_RUST: response.data[2].QUARTER_PANEL_LEFT_REAR_RUST,
                                    QUARTER_PANEL_RIGHT_REAR_RUST: response.data[2].QUARTER_PANEL_RIGHT_REAR_RUST,
                                    HOOD_PANEL_RUST: response.data[2].HOOD_PANEL_RUST,
                                    ROOF_PANEL_RUST: response.data[2].ROOF_PANEL_RUST,
                                    TRUNK_LID_RUST: response.data[2].TRUNK_LID_RUST,
                                    GRILL_RUST: response.data[2].GRILL_RUST,
                                    WHELL_COVERS_RUST: response.data[2].WHELL_COVERS_RUST,
                                    WINDSHIELD_RUST: response.data[2].WINDSHIELD_RUST,

                                    SIDE_GLASS_LEFT_FRONT_DAMAGE: response.data[2].SIDE_GLASS_LEFT_FRONT_DAMAGE,
                                    SIDE_GLASS_RIGHT_FRONT_DAMAGE: response.data[2].SIDE_GLASS_RIGHT_FRONT_DAMAGE,
                                    SIDE_GLASS_LEFT_REAR_DAMAGE: response.data[2].SIDE_GLASS_LEFT_REAR_DAMAGE,
                                    SIDE_GLASS_RIGHT_REAR_DAMAGE: response.data[2].SIDE_GLASS_RIGHT_REAR_DAMAGE,
                                    REAR_WINDSHIELD_DAMAGE: response.data[2].REAR_WINDSHIELD_DAMAGE,
                                    WORN_TORN_INTERIOR_SEAT_DAMAGE: response.data[2].WORN_TORN_INTERIOR_SEAT_DAMAGE,
                                    DASHBOARD_SOUNDSYSTEM_DAMAGE: response.data[2].DASHBOARD_SOUNDSYSTEM_DAMAGE,
                                    CENTER_CONSOLE_DAMAGE: response.data[2].CENTER_CONSOLE_DAMAGE,
                                    //        nedd??: response.data[2].need??,
                                    UNDERCARRIAGE_DAMAGE: response.data[2].UNDERCARRIAGE_DAMAGE,
                                    REAR_VIEW_MIRROR_DAMAGE: response.data[2].REAR_VIEW_MIRROR_DAMAGE,

                                    STORM_DAMAGE: response.data[1].STORM_DAMAGE,
                                    STORM_DAMAGE_DESCRIPTION: response.data[1].STORM_DAMAGE_DESCRIPTION,

                                    //newjercy ANTI_THEFT
                                    ANTI_THEFT_NONE_NEW_JERCY: response.data[1].ANTI_THEFT_NONE_NEW_JERCY,

                                    ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE: response.data[1].ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE,

                                    ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR: response.data[1].ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR,

                                    ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL: response.data[1].ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL,

                                    ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL: response.data[1].ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL,

                                    ANTI_THEFT_G_WINDOW_GLASS_ETCHING: response.data[1].ANTI_THEFT_G_WINDOW_GLASS_ETCHING,

                                    ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL: response.data[1].ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL,

                                    ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH: response.data[1].ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH,

                                    ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK: response.data[1].ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK,

                                    ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC: response.data[1].ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC,

                                    ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM: response.data[1].ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM,

                                    ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE: response.data[1].ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE,

                                    ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH: response.data[1].ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH,

                                    ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC: response.data[1].ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC,

                                    ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC: response.data[1].ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC,

                                    ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT: response.data[1].ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT,

                                    ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC: response.data[1].ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC,

                                    ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC: response.data[1].ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC,

                                    ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE: response.data[1].ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE,

                                    ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE: response.data[1].ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE,

                                    //new code
                                    AUTOMATIC_OVERDRIVE: response.data[0].AUTOMATIC_OVERDRIVE,
                                    AUTOMATIC_AWD: response.data[0].AUTOMATIC_AWD,
                                    AUTOMATIC_4WD: response.data[0].AUTOMATIC_4WD,
                                    MANUAL_3SPEED: response.data[0].MANUAL_3SPEED,
                                    MANUAL_4SPEED: response.data[0].MANUAL_4SPEED,
                                    MANUAL_5SPEED: response.data[0].MANUAL_5SPEED,
                                    MAUAL_6SPEED: response.data[0].MAUAL_6SPEED,

                                    IS_VAN_OR_LIMO: response.data[1].IS_VAN_OR_LIMO,
                                    INTERIROR_PANELING: response.data[1].INTERIROR_PANELING,
                                    REAR_PASSENGER_SEATING: response.data[1].REAR_PASSENGER_SEATING,
                                    EXTERIOR_DECORATIVE_PAINT: response.data[1].EXTERIOR_DECORATIVE_PAINT,
                                    NON_FACTORY_INSTALLED_AC: response.data[1].NON_FACTORY_INSTALLED_AC,
                                    CUSTOMIZED_WINDOWS: response.data[1].CUSTOMIZED_WINDOWS,
                                    STEREO: response.data[1].STEREO,
                                    REFRIGERATOR: response.data[1].REFRIGERATOR,
                                    TELEVISION_VCR_DVD: response.data[1].TELEVISION_VCR_DVD,
                                    TELEVISION_VCR_DVD_PERMANENT: response.data[1].TELEVISION_VCR_DVD_PERMANENT,
                                    Additional_Customization: response.data[0].Additional_Customization,
                                    Additional_Customization_Description: response.data[0].Additional_Customization_Description,

                                    OTHER: response.data[1].OTHER,
                                    OTHER_DESCRIPTION: response.data[1].OTHER_DESCRIPTION,

                                    DESCRIPTION: response.data[1].DESCRIPTION,

                                    NO_EXISTING_DAMAGE_RUST_MISSING_PART: response.data[2].NO_EXISTING_DAMAGE_RUST_MISSING_PART,
                                    INSURED_SIGNATURE: response.data[0].INSURED_SIGNATURE
                                }

                                if ($scope.inspectionSummaryResp.INSURED_SIGNATURE != null) {
                                    $rootScope.isInsuredSing = false;
                                    $scope.Usersing = $scope.inspectionSummaryResp.INSURED_SIGNATURE;
                                }

                                if ($scope.inspectionSummaryResp.CUSTOM_MAG_WHEELS == null && $scope.inspectionSummaryResp.SPECIAL_HUB_CAPS == null && $scope.inspectionSummaryResp.SPECIAL_TIRES == null && $scope.inspectionSummaryResp.SUNROOF == null && $scope.inspectionSummaryResp.REAR_WINDOW_WIPER == null && $scope.inspectionSummaryResp.DAYTIME_RUNNING_LIGHTS == null && $scope.inspectionSummaryResp.BLIND_SPOT_DETECTION_SYSTEM == null && $scope.inspectionSummaryResp.BACKUP_CAMERA == null && $scope.inspectionSummaryResp.COLLISION_AVOIDANCE_SYSTEM == null && $scope.inspectionSummaryResp.BACKUP_SENSOR == null && $scope.inspectionSummaryResp.SPOILER == null) {
                                    $scope.noneProExterior = true;
                                } else {
                                    $scope.noneProExterior = false;
                                }

                                if ($scope.inspectionSummaryResp.SEATS_AUTOMATIC_BELT == null && $scope.inspectionSummaryResp.SEATS_POWER == null && $scope.inspectionSummaryResp.SEATS_HEATED == null && $scope.inspectionSummaryResp.SEATS_LUMBAR == null) {
                                    $scope.noneProSeats = true;
                                } else if ($scope.inspectionSummaryResp.SEATS_AUTOMATIC_BELT == false && $scope.inspectionSummaryResp.SEATS_POWER == false && $scope.inspectionSummaryResp.SEATS_HEATED == false && $scope.inspectionSummaryResp.SEATS_LUMBAR == false) {
                                    $scope.noneProSeats = true;
                                } else {
                                    $scope.noneProSeats = false;
                                }

                                if ($scope.inspectionSummaryResp.INSTRU_AIRCONDITIONER == null && $scope.inspectionSummaryResp.INSTRU_DIGITAL == null && $scope.inspectionSummaryResp.INSTRU_CRUISECONTROL == null && $scope.inspectionSummaryResp.INSTRU_TILTWHEEL == null && $scope.inspectionSummaryResp.INSTRU_POWERWINDOWS == null && $scope.inspectionSummaryResp.INSTRU_POWERLOCKDOORS == null && $scope.inspectionSummaryResp.INSTRU_POWERSTEERING == null && $scope.inspectionSummaryResp.INSTRU_POWERANTENNA == null && $scope.inspectionSummaryResp.INSTRU_POWERTRUNK == null && $scope.inspectionSummaryResp.INSTRU_POWERMIROR == null) {

                                    $scope.noneProInstrumentation = true;
                                } else {
                                    $scope.noneProInstrumentation = false;
                                }

                                if ($scope.inspectionSummaryResp.SAFTY_ANTILOCK_BRAKES == null && $scope.inspectionSummaryResp.SAFTY_FRONT_AIRBAG == null && $scope.inspectionSummaryResp.SAFTY_FRONT_AIRBAG_NUMBER == null && $scope.inspectionSummaryResp.SAFTY_SIDE_AIRBAG == null && $scope.inspectionSummaryResp.SAFTY_SIDE_AIRBAG_NUMBER == null && $scope.inspectionSummaryResp.SAFTY_REAR_AIRBAG == null && $scope.inspectionSummaryResp.SAFTY_REAR_AIRBAG_NUMBER == null) {
                                    $scope.noneProSafety = true;
                                } else {
                                    $scope.noneProSafety = false;
                                }

                                if (!$scope.inspectionSummaryResp.FRONT_BUMPER_RUST && !$scope.inspectionSummaryResp.REAR_BUMPER_RUST && !$scope.inspectionSummaryResp.FENDER_LEFT_FRONT_RUST && !$scope.inspectionSummaryResp.FENDER_RIGHT_FRONT_RUST && !$scope.inspectionSummaryResp.DOOR_LEFT_FRONT_RUST && !$scope.inspectionSummaryResp.DOOR_RIGHT_FRONT_RUST && !$scope.inspectionSummaryResp.DOOR_LEFT_REAR_RUST && !$scope.inspectionSummaryResp.DOOR_RIGHT_REAR_RUST && !$scope.inspectionSummaryResp.QUARTER_PANEL_LEFT_REAR_RUST && !$scope.inspectionSummaryResp.QUARTER_PANEL_RIGHT_REAR_RUST && !$scope.inspectionSummaryResp.HOOD_PANEL_RUST && !$scope.inspectionSummaryResp.ROOF_PANEL_RUST && !$scope.inspectionSummaryResp.TRUNK_LID_RUST && !$scope.inspectionSummaryResp.GRILL_RUST && !$scope.inspectionSummaryResp.WHELL_COVERS_RUST) {
                                    $scope.noneProRusted = true;

                                } else {
                                    $scope.noneProRusted = false;
                                }

                                if (!$scope.inspectionSummaryResp.FRONT_BUMPER_DAMAGE && !$scope.inspectionSummaryResp.REAR_BUMPER_DAMAGE && !$scope.inspectionSummaryResp.FENDER_LEFT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.FENDER_RIGHT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.DOOR_LEFT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.DOOR_RIGHT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.DOOR_LEFT_REAR_DAMAGE && !$scope.inspectionSummaryResp.DOOR_RIGHT_REAR_DAMAGE && !$scope.inspectionSummaryResp.QUARTER_PANEL_LEFT_REAR_DAMAGE && !$scope.inspectionSummaryResp.QUARTER_PANEL_RIGHT_REAR_DAMAGE && !$scope.inspectionSummaryResp.HOOD_PANEL_DAMAGE && !$scope.inspectionSummaryResp.ROOF_PANEL_DAMAGE && !$scope.inspectionSummaryResp.TRUNK_LID_DAMAGE && !$scope.inspectionSummaryResp.GRILL_DAMAGE && !$scope.inspectionSummaryResp.WHELL_COVERS_DAMAGE && !$scope.inspectionSummaryResp.WINDSHIELD_DAMAGE && !$scope.inspectionSummaryResp.SIDE_GLASS_LEFT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.SIDE_GLASS_RIGHT_FRONT_DAMAGE && !$scope.inspectionSummaryResp.SIDE_GLASS_LEFT_REAR_DAMAGE && !$scope.inspectionSummaryResp.SIDE_GLASS_RIGHT_REAR_DAMAGE && !$scope.inspectionSummaryResp.REAR_WINDSHIELD_DAMAGE && !$scope.inspectionSummaryResp.WORN_TORN_INTERIOR_SEAT_DAMAGE && !$scope.inspectionSummaryResp.DASHBOARD_SOUNDSYSTEM_DAMAGE && !$scope.inspectionSummaryResp.CENTER_CONSOLE_DAMAGE && !$scope.inspectionSummaryResp.UNDERCARRIAGE_DAMAGE && !$scope.inspectionSummaryResp.REAR_VIEW_MIRROR_DAMAGE && !$scope.inspectionSummaryResp.STORM_DAMAGE && !$scope.inspectionSummaryResp.STORM_DAMAGE_DESCRIPTION) {
                                    $scope.noneProDamaged = true;

                                } else {
                                    $scope.noneProDamaged = false;
                                }
                                $http
                                    .get($rootScope.baseUrl + 'user/getState')
                                    .then(function onSuccess(response) {
                                        $scope.states = response.data;
                                        $scope.plateState = $scope.states.name;
                                    })

                                if ($scope.inspectionSummaryResp.RADIO_FACTORY_INSTALLED == true && $scope.inspectionSummaryResp.RADIO_AFTER_BRAND != null) {
                                    $scope.radioFactoryInstalled = '(FACTORY_INSTALLED: ' + $scope.inspectionSummaryResp.RADIO_AFTER_BRAND + ')'
                                } else if ($scope.inspectionSummaryResp.RADIO_FACTORY_INSTALLED == true) {
                                    $scope.radioFactoryInstalled = 'FACTORY_INSTALLED'
                                }

                                if ($scope.inspectionSummaryResp.VIN_LOCATION_ON_VEHICLE == 'DASHBOARD') {
                                    $scope.VINLocationSummery = 'Dashboard'
                                } else if ($scope.inspectionSummaryResp.VIN_LOCATION_ON_VEHICLE == 'otherVal') {
                                    $scope.VINLocationSummery = $scope.inspectionSummaryResp.VIN_LOCATION_ON_VEHICLE_DESCRIBE;
                                }

                                if ($scope.inspectionSummaryResp.GARAGE_SAME_AS_INSURED_ADDRESSS == 'Y') {
                                    $scope.garageInsuredAddress = "Same as insured's address";

                                } else if ($scope.inspectionSummaryResp.GARAGE_SAME_AS_INSURED_ADDRESSS == 'N') {

                                    $http
                                        .get($rootScope.baseUrl + 'user/getState')
                                        .then(function onSuccess(response) {
                                            $scope.states = response.data;
                                            for (var i = 0; i < $scope.states.length; i++) {
                                                if ($scope.inspectionSummaryResp.GARAGE_STATE_Id == $scope.states[i].id) {
                                                    $scope.STATE_NAME = $scope.states[i].name;
                                                    $scope.garageInsuredAddress = $scope.inspectionSummaryResp.GARAGE_CITY + ',' + $scope.STATE_NAME;
                                                }
                                            }

                                        })

                                }

                                if ($scope.inspectionSummaryResp.ANTITHEFT_NONE == true) {
                                    $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: <NONE PROVIDED>';
                                    $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: <NONE PROVIDED>';
                                } else if ($scope.inspectionSummaryResp.ANTITHEFT_NONE == null) {
                                    if ($scope.inspectionSummaryResp.MANUFACTURER == true && $scope.inspectionSummaryResp.AFTER_MARKET == true) {
                                        $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: YES';
                                        $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: YES';
                                    } else if ($scope.inspectionSummaryResp.MANUFACTURER == true && $scope.inspectionSummaryResp.AFTER_MARKET == false) {
                                        $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: YES';
                                        $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: NO';
                                    } else if ($scope.inspectionSummaryResp.MANUFACTURER == false && $scope.inspectionSummaryResp.AFTER_MARKET == true) {
                                        $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: NO';
                                        $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: YES';
                                    } else if ($scope.inspectionSummaryResp.MANUFACTURER == false && $scope.inspectionSummaryResp.AFTER_MARKET == false) {
                                        $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: NO';
                                        $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: NO';
                                    }
                                } else if ($scope.inspectionSummaryResp.ANTITHEFT_NONE == false) {
                                    $scope.inspectionSummaryResp.MANUFACTURER = 'MANUFACTURER: <NONE PROVIDED>';
                                    $scope.inspectionSummaryResp.AFTER_MARKET = 'AFTER_MARKET: <NONE PROVIDED>';

                                }

                                if ($scope.inspectionSummaryResp.SPECIAL_HUB_CAPS == true) {
                                    if ($scope.inspectionSummaryResp.SPECIAL_HUB_CAP_QUANTITY == null) {
                                        $scope.inspectionSummaryResp.SPECIAL_HUB_CAP_QUANTITY = '<NONE PROVIDED>';
                                    }

                                }

                                if ($scope.inspectionSummaryResp.SPECIAL_TIRES == true) {
                                    if ($scope.inspectionSummaryResp.SPECIAL_TIRES_TYPE == null) {
                                        $scope.inspectionSummaryResp.SPECIAL_TIRES_TYPE = '<NONE PROVIDED>';
                                    }

                                }
                                $scope.vanLimoDevicesLables = [];
                                $scope.antitheftDevicesLables = [];
                                $scope.antitheftDevicesNewJLables = [];
                                $scope.ExteriorLables = [];
                                $scope.SeatsLables = [];
                                $scope.instrumentationLables = [];
                                $scope.SafetyLables = [];
                                $scope.DamagedLables = [];
                                $scope.rustedDamagedLables = [];
                                $scope.AutomaticLabels = [];
                                $scope.ManualLabels = [];
                                $scope.radioLables = [];

                                $scope.vanLimoDevicesDevices = [
                                    {
                                        label: 'Interior Paneling',
                                        dbKey: 'INTERIROR_PANELING',
                                        dbValue: $scope.inspectionSummaryResp.INTERIROR_PANELING
                                    }, {
                                        label: 'Rear Passenger Seating',
                                        dbKey: 'REAR_PASSENGER_SEATING',
                                        dbValue: $scope.inspectionSummaryResp.REAR_PASSENGER_SEATING
                                    }, {
                                        label: 'Exterior Decorative Paint',
                                        dbKey: 'EXTERIOR_DECORATIVE_PAINT',
                                        dbValue: $scope.inspectionSummaryResp.EXTERIOR_DECORATIVE_PAINT
                                    }, {
                                        label: 'Non-Factory Installed AC',
                                        dbKey: 'NON_FACTORY_INSTALLED_AC',
                                        dbValue: $scope.inspectionSummaryResp.NON_FACTORY_INSTALLED_AC
                                    }, {
                                        label: 'Customized Window',
                                        dbKey: 'CUSTOMIZED_WINDOWS',
                                        dbValue: $scope.inspectionSummaryResp.CUSTOMIZED_WINDOWS
                                    }, {
                                        label: 'Stereo',
                                        dbKey: 'STEREO',
                                        dbValue: $scope.inspectionSummaryResp.STEREO
                                    }, {
                                        label: 'Refrigerator',
                                        dbKey: 'REFRIGERATOR',
                                        dbValue: $scope.inspectionSummaryResp.REFRIGERATOR
                                    }, {
                                        label: 'Additional_Customization',
                                        dbKey: 'Additional_Customization',
                                        dbValue: $scope.inspectionSummaryResp.Additional_Customization
                                    }, {
                                        label: 'Additional_Customization_Description',
                                        dbKey: 'Additional_Customization_Description',
                                        dbValue: $scope.inspectionSummaryResp.Additional_Customization_Description
                                    }, {
                                        label: 'Television/VCR/DVD',
                                        dbKey: 'TELEVISION_VCR_DVD',
                                        dbValue: $scope.inspectionSummaryResp.TELEVISION_VCR_DVD
                                    }, {
                                        label: '',
                                        dbKey: 'TELEVISION_VCR_DVD_PERMANENT',
                                        dbValue: $scope.inspectionSummaryResp.TELEVISION_VCR_DVD_PERMANENT
                                    }
                                ];

                                for (var i = 0; i < $scope.vanLimoDevicesDevices.length; i++) {
                                    if ($scope.vanLimoDevicesDevices[i].dbValue == true) {
                                        if ($scope.vanLimoDevicesDevices[i].dbKey == 'TELEVISION_VCR_DVD') {
                                            if ($scope.vanLimoDevicesDevices[i + 1].dbValue) {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Television/VCR/DVD: YES');
                                            } else if (!$scope.vanLimoDevicesDevices[i + 1].dbValue && $scope.vanLimoDevicesDevices[i + 1].dbValue != null) {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Television/VCR/DVD: NO');
                                            } else if ($scope.vanLimoDevicesDevices[i + 1].dbValue == null) {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Television/VCR/DVD: <NONE PROVIDED>');
                                            } else {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Television/VCR/DVD: <NONE PROVIDED>');
                                            }

                                        } else if ($scope.vanLimoDevicesDevices[i].dbKey == 'Additional_Customization') {
                                            if ($scope.vanLimoDevicesDevices[i + 1].dbValue != null && $scope.vanLimoDevicesDevices[i + 1].dbValue != '') {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Additional Customization: ' + $scope.inspectionSummaryResp.Additional_Customization_Description);
                                            } else {
                                                $scope
                                                    .vanLimoDevicesLables
                                                    .push('Additional Customization: <NONE PROVIDED>');
                                            }

                                        } else {
                                            if ($scope.vanLimoDevicesDevices[i].dbKey !== 'TELEVISION_VCR_DVD_PERMANENT') {
                                                if ($scope.vanLimoDevicesDevices[i].label) {
                                                    $scope
                                                        .vanLimoDevicesLables
                                                        .push($scope.vanLimoDevicesDevices[i].label);
                                                }
                                            } else if ($scope.vanLimoDevicesDevices[i].dbKey !== 'Additional_Customization_Description') {
                                                if ($scope.vanLimoDevicesDevices[i].label) {
                                                    $scope
                                                        .vanLimoDevicesLables
                                                        .push($scope.vanLimoDevicesDevices[i].label);
                                                }
                                            }

                                        }

                                    }

                                    $scope.vanLimoDevicesString = $scope
                                        .vanLimoDevicesLables
                                        .join(', ')
                                }

                                if (!$scope.inspectionSummaryResp.INTERIROR_PANELING && !$scope.inspectionSummaryResp.REAR_PASSENGER_SEATING && !$scope.inspectionSummaryResp.EXTERIOR_DECORATIVE_PAINT && !$scope.inspectionSummaryResp.NON_FACTORY_INSTALLED_AC && !$scope.inspectionSummaryResp.CUSTOMIZED_WINDOWS && !$scope.inspectionSummaryResp.STEREO && !$scope.inspectionSummaryResp.REFRIGERATOR && !$scope.inspectionSummaryResp.Additional_Customization && !$scope.inspectionSummaryResp.TELEVISION_VCR_DVD) {
                                    $scope.vanLimoNoneProvided = true;
                                } else {
                                    $scope.vanLimoNoneProvided = false;
                                }

                                $scope.radioDevices = [
                                    {
                                        label: 'AM/FM',
                                        dbKey: 'RADIO_EQUIPMENT_AM_FM',
                                        dbValue: $scope.inspectionSummaryResp.RADIO_EQUIPMENT_AM_FM
                                    }, {
                                        label: 'AM/FM/Cassette',
                                        dbKey: 'RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER',
                                        dbValue: $scope.inspectionSummaryResp.RADIO_EQUIPMENT_AM_FM_CASSETTE_PLAYER
                                    }, {
                                        label: 'CD Player',
                                        dbKey: 'RADIO_EQUIPMENT_FM_CD_PLAYER',
                                        dbValue: $scope.inspectionSummaryResp.RADIO_EQUIPMENT_FM_CD_PLAYER
                                    }, {
                                        label: 'CD Changer',
                                        dbKey: 'RADIO_EQUIPMENT_DASHBOARD',
                                        dbValue: $scope.inspectionSummaryResp.RADIO_EQUIPMENT_DASHBOARD
                                    }, {
                                        label: 'Satellite Radio',
                                        dbKey: 'RADIO_EQUIPMENT_SATELLITE_RADIO',
                                        dbValue: $scope.inspectionSummaryResp.RADIO_EQUIPMENT_SATELLITE_RADIO
                                    }, {
                                        label: 'GPS Navigation System Installed',
                                        dbKey: 'GPS_NAVIGATION_SYSTEM_INSTALLED',
                                        dbValue: $scope.inspectionSummaryResp.GPS_NAVIGATION_SYSTEM_INSTALLED
                                    }, {
                                        label: 'GPS_NAVIGATION_INSTALLED_PERMANENTLY',
                                        dbKey: 'GPS_NAVIGATION_INSTALLED_PERMANENTLY',
                                        dbValue: $scope.inspectionSummaryResp.GPS_NAVIGATION_INSTALLED_PERMANENTLY
                                    }
                                ];

                                for (var i = 0; i < $scope.radioDevices.length; i++) {
                                    if ($scope.radioDevices[i].dbValue == true) {

                                        if ($scope.radioDevices[i].dbKey == 'GPS_NAVIGATION_SYSTEM_INSTALLED') {
                                            if ($scope.radioDevices[i + 1].dbValue) {
                                                $scope
                                                    .radioLables
                                                    .push('GPS Navigation System Permanently Installed: YES');

                                            } else if (!$scope.radioDevices[i + 1].dbValue) {
                                                $scope
                                                    .radioLables
                                                    .push('GPS Navigation System Permanently Installed: NO');

                                            } else {
                                                $scope
                                                    .radioLables
                                                    .push('GPS Navigation System Permanently Installed: <NONE PROVIDED>');

                                            }
                                        } else {
                                            if ($scope.radioDevices[i].dbKey !== 'GPS_NAVIGATION_INSTALLED_PERMANENTLY') {
                                                $scope
                                                    .radioLables
                                                    .push($scope.radioDevices[i].label);
                                            }

                                        }

                                    }

                                    $scope.nonePro = $scope.radioLables.length == 0
                                        ? true
                                        : false;

                                    $scope.radioDevicesString = $scope
                                        .radioLables
                                        .join(', ')
                                }

                                $scope.antitheftDevicesNewJ = [
                                    {
                                        label: 'Ingnition or starter cut-off switch device',
                                        dbKey: 'ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_B_IGNITION_OR_STARTER_CUT_OFF_SWITCH_DEVICE
                                    }, {
                                        label: 'Steering column armored collar',
                                        dbKey: 'ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_D_STEERING_COLUMN_ARMORED_COLLAR
                                    }, {
                                        label: 'Non-passive fuel cut-off device (Active/Manual)',
                                        dbKey: 'ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_E_NON_PASSIVE_FUEL_CUT_OFF_DEVICE_ACTIVE_MANUAL
                                    }, {
                                        label: 'Non-passive externally operated alarm (Active/Manual)',
                                        dbKey: 'ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_F_NON_PASSIVE_EXTERNALLY_OPERATE_ALARM_ACTIVE_MANUAL
                                    }, {
                                        label: 'Window glass etching',
                                        dbKey: 'ANTI_THEFT_G_WINDOW_GLASS_ETCHING',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_G_WINDOW_GLASS_ETCHING
                                    }, {
                                        label: 'Non-passive steering wheel lock device (Active/Manual)',
                                        dbKey: 'ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_H_NON_PASSIVE_STEERING_WHEEL_LOCK_DEVICE__ACTIVE_MANUAL
                                    }, {
                                        label: 'Armored cable hood lock & ignition cut-off switch',
                                        dbKey: 'ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_I_ARMOURED_CABLE_HOOD_LOCK_AND_IGNITION_CUT_OFF_SWITCH
                                    }, {
                                        label: 'Emergency hand break lock',
                                        dbKey: 'ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_J_EMERGENCY_HAND_BRAKE_LOCK
                                    }, {
                                        label: 'Passive alarm system coupled with ignition or starter cut-off (Automatic)',
                                        dbKey: 'ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTO' +
                                                'MATIC',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_K_PASSIVE_ALARM_SYSTEM_COUPLED_WITH_IGINITION_OR_STARTER_CUT_OFF_AUTOMATIC
                                    }, {
                                        label: 'Anti-theft vehicle recovery system',
                                        dbKey: 'ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_L_ANTI_THEFT_VEHICLE_RECOVERY_SYSTEM
                                    }, {
                                        label: 'Fuel cut-off device',
                                        dbKey: 'ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_M_FUEL_CUT_OFF_DEVICE
                                    }, {
                                        label: 'Armored ignition cut-off switch',
                                        dbKey: 'ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_N_ARMORED_IGNITION_CUT_OFF_SWITCH
                                    }, {
                                        label: 'Passive multi component cut-off switch(Automatic)',
                                        dbKey: 'ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_R_PASSSIVE_MULTI_COMPONENTS_CUT_OFF_SWITCH_AUTOMATIC
                                    }, {
                                        label: 'Passive time delay ignition',
                                        dbKey: 'ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_T_PASSIVE_TIME_DELAY_IGNITION_SYSTEM_AUTOMATIC
                                    }, {
                                        label: 'Armored cable or electronically operated hood lock & ignition cut-off switch',
                                        dbKey: 'ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_U_CABLE_HOOD_LOCK_AND_IGNITION_LIGHT
                                    }, {
                                        label: 'Passive delayed ignition cut-off system(Automatic)',
                                        dbKey: 'ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_V_PASSIVE_DELAYED_IGNITION_CUTOFF_SYSTEM_AUTOMATIC
                                    }, {
                                        label: 'Passive ignition lock protection system(Automatic)',
                                        dbKey: 'ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_W_PASSIVE_IGNITION_LOCK_PROTECTION_SYSTEM_AUTOMATIC
                                    }, {
                                        label: 'High security replacement lock device',
                                        dbKey: 'ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_Y_HIGH_SECURITY_REPLACEMENT_LOCK_DEVICE
                                    }, {
                                        label: 'Hydraulic brake lock device',
                                        dbKey: 'ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE',
                                        dbValue: $scope.inspectionSummaryResp.ANTI_THEFT_Z_HYDRAULIC_BRAKE_LOCK_DEVICE
                                    }
                                ];

                                $scope.antitheftDevices = [
                                    {
                                        label: 'System present but inoperative',
                                        dbKey: 'ANTITHEFT_INOPERATIVE',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_INOPERATIVE
                                    }, {
                                        label: 'Auto recovery system',
                                        dbKey: 'ANTITHEFT_AUTO_RECOVERY_SYSTEM',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_AUTO_RECOVERY_SYSTEM
                                    }, {
                                        label: 'Passive disabling device',
                                        dbKey: 'ANTITHEFT_PASSIVE_DISABLE',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_PASSIVE_DISABLE
                                    }, {
                                        label: 'Active disabling device',
                                        dbKey: 'ANTITHEFT_ACTIVE_DISABLE',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_ACTIVE_DISABLE
                                    }, {
                                        label: 'Siren/Audible alarm',
                                        dbKey: 'ANTITHEFT_AUDIBLE_ALARM_ONLY',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_AUDIBLE_ALARM_ONLY
                                    }, {
                                        label: 'Combat auto theft (CAT)',
                                        dbKey: 'ANTITHEFT_COMBAT_AUTO_THEFT',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_COMBAT_AUTO_THEFT
                                    }, {
                                        label: 'Etched glass indicating VIN or coding',
                                        dbKey: 'ANTITHEFT_ETCHED_GLASS_CODING',
                                        dbValue: $scope.inspectionSummaryResp.ANTITHEFT_ETCHED_GLASS_CODING
                                    }
                                ];

                                for (var i = 0; i < $scope.antitheftDevices.length; i++) {
                                    if ($scope.antitheftDevices[i].dbValue == true) {
                                        $scope
                                            .antitheftDevicesLables
                                            .push($scope.antitheftDevices[i].label);
                                    }
                                    $scope.antitheftDevicesString = $scope
                                        .antitheftDevicesLables
                                        .join(', ')
                                }

                                for (var i = 0; i < $scope.antitheftDevicesNewJ.length; i++) {
                                    if ($scope.antitheftDevicesNewJ[i].dbValue == true) {
                                        $scope
                                            .antitheftDevicesNewJLables
                                            .push($scope.antitheftDevicesNewJ[i].label);
                                    }
                                    $scope.antitheftDevicesNewJLablessString = $scope
                                        .antitheftDevicesNewJLables
                                        .join(', ')
                                }

                                $scope.autoDevices = [
                                    {
                                        label: 'OVERDRIVE',
                                        dbKey: 'AUTOMATIC_OVERDRIVE ',
                                        dbValue: $scope.inspectionSummaryResp.AUTOMATIC_OVERDRIVE
                                    }, {
                                        label: 'AWD',
                                        dbKey: 'AUTOMATIC_AWD',
                                        dbValue: $scope.inspectionSummaryResp.AUTOMATIC_AWD
                                    }, {
                                        label: '4WD',
                                        dbKey: 'AUTOMATIC_4WD',
                                        dbValue: $scope.inspectionSummaryResp.AUTOMATIC_4WD
                                    }
                                ];

                                for (var i = 0; i < $scope.autoDevices.length; i++) {
                                    if ($scope.autoDevices[i].dbValue == true) {
                                        $scope
                                            .AutomaticLabels
                                            .push($scope.autoDevices[i].label);
                                    }
                                    $scope.AutoDevicesString = $scope
                                        .AutomaticLabels
                                        .join(', ')
                                }
                                $scope.manualDevices = [
                                    {
                                        label: '3SPEED',
                                        dbKey: 'MANUAL_3SPEED ',
                                        dbValue: $scope.inspectionSummaryResp.MANUAL_3SPEED
                                    }, {
                                        label: '4SPEED',
                                        dbKey: 'MANUAL_4SPEED',
                                        dbValue: $scope.inspectionSummaryResp.MANUAL_4SPEED
                                    }, {
                                        label: '5SPEED',
                                        dbKey: 'MANUAL_5SPEED',
                                        dbValue: $scope.inspectionSummaryResp.MANUAL_5SPEED
                                    }, {
                                        label: '6SPEED',
                                        dbKey: 'MAUAL_6SPEED',
                                        dbValue: $scope.inspectionSummaryResp.MAUAL_6SPEED
                                    }
                                ]

                                for (var i = 0; i < $scope.manualDevices.length; i++) {

                                    if ($scope.manualDevices[i].dbValue == true) {
                                        $scope
                                            .ManualLabels
                                            .push($scope.manualDevices[i].label);
                                    }
                                    $scope.ManualDevicesString = $scope
                                        .ManualLabels
                                        .join(', ')
                                }

                                $scope.ExteriorDevices = [
                                    {
                                        label: 'Custom/MAG wheels',
                                        dbKey: 'CUSTOM_MAG_WHEELS',
                                        dbValue: $scope.inspectionSummaryResp.CUSTOM_MAG_WHEELS
                                    }, {
                                        label: 'Special hub caps: Quantity On Vehicle: ' + $scope.inspectionSummaryResp.SPECIAL_HUB_CAP_QUANTITY,
                                        dbKey: 'SPECIAL_HUB_CAPS',
                                        dbValue: $scope.inspectionSummaryResp.SPECIAL_HUB_CAPS
                                    }, {
                                        label: 'Custom/MAG wheels',
                                        dbKey: 'SPECIAL_HUB_CAP_QUANTITY',
                                        dbValue: $scope.inspectionSummaryResp.SPECIAL_HUB_CAP_QUANTITY
                                    }, {
                                        label: 'Special tires: Type: ' + $scope.inspectionSummaryResp.SPECIAL_TIRES_TYPE,
                                        dbKey: 'SPECIAL_TIRES',
                                        dbValue: $scope.inspectionSummaryResp.SPECIAL_TIRES
                                    }, {
                                        label: 'Spoiler',
                                        dbKey: 'SPOILER',
                                        dbValue: $scope.inspectionSummaryResp.SPOILER
                                    }, {
                                        label: 'Sunroof/Moonroof',
                                        dbKey: 'SUNROOF',
                                        dbValue: $scope.inspectionSummaryResp.SUNROOF
                                    }, {
                                        label: 'Motorized',
                                        dbKey: 'SUNROOF_MOTORIZED',
                                        dbValue: $scope.inspectionSummaryResp.SUNROOF_MOTORIZED
                                    }, {
                                        label: 'Rear window wiper',
                                        dbKey: 'REAR_WINDOW_WIPER',
                                        dbValue: $scope.inspectionSummaryResp.REAR_WINDOW_WIPER
                                    }, {
                                        label: 'Daytime running lights',
                                        dbKey: 'DAYTIME_RUNNING_LIGHTS',
                                        dbValue: $scope.inspectionSummaryResp.DAYTIME_RUNNING_LIGHTS
                                    }, {
                                        label: 'Blind spot detection system',
                                        dbKey: 'BLIND_SPOT_DETECTION_SYSTEM ',
                                        dbValue: $scope.inspectionSummaryResp.BLIND_SPOT_DETECTION_SYSTEM
                                    }, {
                                        label: 'Backup camera',
                                        dbKey: 'BACKUP_CAMERA ',
                                        dbValue: $scope.inspectionSummaryResp.BACKUP_CAMERA
                                    }, {
                                        label: 'Collision avoidance system',
                                        dbKey: 'COLLISION_AVOIDANCE_SYSTEM',
                                        dbValue: $scope.inspectionSummaryResp.COLLISION_AVOIDANCE_SYSTEM
                                    }, {
                                        label: 'Backup sensor',
                                        dbKey: 'BACKUP_SENSOR',
                                        dbValue: $scope.inspectionSummaryResp.BACKUP_SENSOR
                                    }
                                ];

                                for (var i = 0; i < $scope.ExteriorDevices.length; i++) {
                                    if ($scope.ExteriorDevices[i].dbValue == true) {
                                        if ($scope.ExteriorDevices[i].label == 'Sunroof/Moonroof') {
                                            if ($scope.ExteriorDevices[i + 1].dbValue) {
                                                let label = 'Sunroof/Moonroof: Motorized'
                                                $scope
                                                    .ExteriorLables
                                                    .push(label);
                                            } else {
                                                $scope
                                                    .ExteriorLables
                                                    .push($scope.ExteriorDevices[i].label);
                                            }
                                        } else {
                                            if ($scope.ExteriorDevices[i].label !== 'Motorized') {
                                                $scope
                                                    .ExteriorLables
                                                    .push($scope.ExteriorDevices[i].label);
                                            }
                                        }
                                    }

                                    $scope.ExteriorDevicesString = $scope
                                        .ExteriorLables
                                        .join(', ')
                                }

                                $scope.SeatsDevices = [
                                    {
                                        label: 'Automatic seat belts',
                                        dbKey: 'SEATS_AUTOMATIC_BELT',
                                        dbValue: $scope.inspectionSummaryResp.SEATS_AUTOMATIC_BELT
                                    }, {
                                        label: 'Power seats',
                                        dbKey: 'SEATS_POWER',
                                        dbValue: $scope.inspectionSummaryResp.SEATS_POWER
                                    }, {
                                        label: 'Heated seats',
                                        dbKey: 'SEATS_HEATED',
                                        dbValue: $scope.inspectionSummaryResp.SEATS_HEATED
                                    }, {
                                        label: 'Lumbar',
                                        dbKey: 'SEATS_LUMBAR',
                                        dbValue: $scope.inspectionSummaryResp.SEATS_LUMBAR
                                    }
                                ];
                                for (var i = 0; i < $scope.SeatsDevices.length; i++) {
                                    if ($scope.SeatsDevices[i].dbValue == true) {
                                        $scope
                                            .SeatsLables
                                            .push($scope.SeatsDevices[i].label);
                                    }
                                    $scope.SeatsDevicesString = $scope
                                        .SeatsLables
                                        .join(', ')
                                }

                                $scope.InstrumentationDevices = [
                                    {
                                        label: 'Air conditioner',
                                        dbKey: 'INSTRU_AIRCONDITIONER',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_AIRCONDITIONER
                                    }, {
                                        label: 'Digital instrumentation',
                                        dbKey: 'INSTRU_DIGITAL',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_DIGITAL
                                    }, {
                                        label: 'Cruise control',
                                        dbKey: 'INSTRU_CRUISECONTROL',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_CRUISECONTROL
                                    }, {
                                        label: 'Tilt wheel',
                                        dbKey: 'INSTRU_TILTWHEEL',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_TILTWHEEL
                                    }, {
                                        label: 'Power windows',
                                        dbKey: 'INSTRU_POWERWINDOWS',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERWINDOWS
                                    }, {
                                        label: 'Power door locks',
                                        dbKey: 'INSTRU_POWERLOCKDOORS',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERLOCKDOORS
                                    }, {
                                        label: 'Power steering',
                                        dbKey: 'INSTRU_POWERSTEERING ',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERSTEERING
                                    }, {
                                        label: 'Power antenna',
                                        dbKey: 'INSTRU_POWERANTENNA',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERANTENNA
                                    }, {
                                        label: 'Power trunk',
                                        dbKey: 'INSTRU_POWERTRUNK',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERTRUNK
                                    }, {
                                        label: 'Power mirrors',
                                        dbKey: 'INSTRU_POWERMIROR',
                                        dbValue: $scope.inspectionSummaryResp.INSTRU_POWERMIROR
                                    }
                                ]

                                for (var i = 0; i < $scope.InstrumentationDevices.length; i++) {
                                    if ($scope.InstrumentationDevices[i].dbValue == true) {
                                        $scope
                                            .instrumentationLables
                                            .push($scope.InstrumentationDevices[i].label);
                                    }

                                    if ($scope.instrumentationLables.length != 0) {
                                        $scope.instrumentationDevicesString = $scope
                                            .instrumentationLables
                                            .join(', ')
                                    } else if ($scope.instrumentationLables.length == 0) {
                                        $scope
                                            .instrumentationLables
                                            .push('<NONE PROVIDED>');
                                        $scope.instrumentationLables = [];
                                    }

                                }

                                $scope.SafetyDevices = [
                                    {
                                        label: 'Anti-lock brakes',
                                        dbKey: 'SAFTY_ANTILOCK_BRAKES',
                                        dbValue: $scope.inspectionSummaryResp.SAFTY_ANTILOCK_BRAKES,
                                        radioValue: ''
                                    }, {
                                        label: 'Front Air Bags',
                                        dbKey: 'SAFTY_FRONT_AIRBAG',
                                        dbValue: $scope.inspectionSummaryResp.SAFTY_FRONT_AIRBAG,
                                        radioValue: $scope.inspectionSummaryResp.SAFTY_FRONT_AIRBAG_NUMBER
                                    }, {
                                        label: 'Side Air Bags',
                                        dbKey: 'SAFTY_SIDE_AIRBAG',
                                        dbValue: $scope.inspectionSummaryResp.SAFTY_SIDE_AIRBAG,
                                        radioValue: $scope.inspectionSummaryResp.SAFTY_SIDE_AIRBAG_NUMBER
                                    }, {
                                        label: 'Rear Air Bags',
                                        dbKey: 'SAFTY_REAR_AIRBAG',
                                        dbValue: $scope.inspectionSummaryResp.SAFTY_REAR_AIRBAG,
                                        radioValue: $scope.inspectionSummaryResp.SAFTY_REAR_AIRBAG_NUMBER
                                    }
                                ];

                                $scope.newSummaryResult = []
                                for (var i = 0; i < $scope.SafetyDevices.length; i++) {
                                    if ($scope.SafetyDevices[i].dbValue == true) {

                                        if ($scope.SafetyDevices[i].dbKey == 'SAFTY_FRONT_AIRBAG' && $scope.SafetyDevices[i].radioValue == 1) {
                                            $scope.SafetyLables[1] = 'Front Air Bags: (x1)';
                                            $scope
                                                .newSummaryResult
                                                .push('Front Air Bags: (x1)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_FRONT_AIRBAG' && $scope.SafetyDevices[i].radioValue == 2) {
                                            $scope.SafetyLables[1] = 'Front Air Bags: (x2)';
                                            $scope
                                                .newSummaryResult
                                                .push('Front Air Bags: (x2)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_FRONT_AIRBAG' && $scope.SafetyDevices[i].dbValue && $scope.SafetyDevices[i].radioValue == null) {
                                            $scope.SafetyLables[1] = 'Front Air Bags';

                                            $scope
                                                .newSummaryResult
                                                .push('Front Air Bags')
                                        }

                                        if ($scope.SafetyDevices[i].dbKey == 'SAFTY_SIDE_AIRBAG' && $scope.SafetyDevices[i].radioValue == 1) {
                                            $scope.SafetyLables[2] = 'Side Air Bags: (x1)';
                                            $scope
                                                .newSummaryResult
                                                .push('Side Air Bags: (x1)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_SIDE_AIRBAG' && $scope.SafetyDevices[i].radioValue == 2) {
                                            $scope.SafetyLables[2] = 'Side Air Bags: (x2)';
                                            $scope
                                                .newSummaryResult
                                                .push('Side Air Bags: (x2)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_SIDE_AIRBAG' && $scope.SafetyDevices[i].dbValue && $scope.SafetyDevices[i].radioValue == null) {
                                            $scope.SafetyLables[2] = 'Side Air Bags';

                                            $scope
                                                .newSummaryResult
                                                .push('Side Air Bags')
                                        }

                                        if ($scope.SafetyDevices[i].dbKey == 'SAFTY_REAR_AIRBAG' && $scope.SafetyDevices[i].radioValue == 1) {
                                            $scope.SafetyLables[3] = 'Rear Air Bags: (x1)';
                                            $scope
                                                .newSummaryResult
                                                .push('Rear Air Bags: (x1)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_REAR_AIRBAG' && $scope.SafetyDevices[i].radioValue == 2) {
                                            $scope.SafetyLables[3] = 'Rear Air Bags: (x2)';
                                            $scope
                                                .newSummaryResult
                                                .push('Rear Air Bags: (x2)')
                                        } else if ($scope.SafetyDevices[i].dbKey == 'SAFTY_REAR_AIRBAG' && $scope.SafetyDevices[i].dbValue && $scope.SafetyDevices[i].radioValue == null) {
                                            $scope.SafetyLables[3] = 'Rear Air Bags';
                                            $scope
                                                .newSummaryResult
                                                .push('Rear Air Bags')
                                        }

                                        if ($scope.SafetyDevices[i].dbKey == 'SAFTY_ANTILOCK_BRAKES' && $scope.inspectionSummaryResp.SAFTY_ANTILOCK_BRAKES) {
                                            $scope.SafetyLables[0] = 'Anti-lock brakes';
                                            $scope
                                                .newSummaryResult
                                                .push('Anti-lock brakes')
                                        } else {
                                            $scope.SafetyLables[0] = '';
                                        }
                                    }

                                    $scope.SafetyDevicesString = $scope
                                        .newSummaryResult
                                        .join(', ')
                                }

                                $scope.DamagedDevices = [
                                    {
                                        label: 'Front bumper',
                                        dbKey: 'FRONT_BUMPER_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.FRONT_BUMPER_DAMAGE
                                    }, {
                                        label: 'Rear bumper',
                                        dbKey: 'REAR_BUMPER_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.REAR_BUMPER_DAMAGE
                                    }, {
                                        label: 'Fender left front',
                                        dbKey: 'FENDER_LEFT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.FENDER_LEFT_FRONT_DAMAGE
                                    }, {
                                        label: 'Fender right front',
                                        dbKey: 'FENDER_RIGHT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.FENDER_RIGHT_FRONT_DAMAGE
                                    }, {
                                        label: 'Door left front',
                                        dbKey: 'DOOR_LEFT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_LEFT_FRONT_DAMAGE
                                    }, {
                                        label: 'Door right front',
                                        dbKey: 'DOOR_RIGHT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_RIGHT_FRONT_DAMAGE
                                    }, {
                                        label: 'Door left rear',
                                        dbKey: 'DOOR_LEFT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_LEFT_REAR_DAMAGE
                                    }, {
                                        label: 'Door right rear',
                                        dbKey: 'DOOR_RIGHT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_RIGHT_REAR_DAMAGE
                                    }, {
                                        label: 'Quarter panel left rear',
                                        dbKey: 'QUARTER_PANEL_LEFT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.QUARTER_PANEL_LEFT_REAR_DAMAGE
                                    }, {
                                        label: 'Quarter panel right rear',
                                        dbKey: 'QUARTER_PANEL_RIGHT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.QUARTER_PANEL_RIGHT_REAR_DAMAGE
                                    }, {
                                        label: 'Hood panel',
                                        dbKey: 'HOOD_PANEL_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.HOOD_PANEL_DAMAGE
                                    }, {
                                        label: 'Roof panel',
                                        dbKey: 'ROOF_PANEL_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.ROOF_PANEL_DAMAGE
                                    }, {
                                        label: 'Trunk lid/rear door',
                                        dbKey: 'TRUNK_LID_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.TRUNK_LID_DAMAGE
                                    }, {
                                        label: ' Grill',
                                        dbKey: 'GRILL_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.GRILL_DAMAGE
                                    }, {
                                        label: 'Wheel covers',
                                        dbKey: 'WHELL_COVERS_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.WHELL_COVERS_DAMAGE
                                    }, {
                                        label: 'Windshield',
                                        dbKey: 'WINDSHIELD_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.WINDSHIELD_DAMAGE
                                    },
                                    //
                                    {
                                        label: 'Side glass left front',
                                        dbKey: 'SIDE_GLASS_LEFT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.SIDE_GLASS_LEFT_FRONT_DAMAGE
                                    }, {
                                        label: 'Side glass right front',
                                        dbKey: 'SIDE_GLASS_RIGHT_FRONT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.SIDE_GLASS_RIGHT_FRONT_DAMAGE
                                    }, {
                                        label: 'Side glass left rear',
                                        dbKey: 'SIDE_GLASS_LEFT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.SIDE_GLASS_LEFT_REAR_DAMAGE
                                    }, {
                                        label: 'Side glass right rear',
                                        dbKey: 'SIDE_GLASS_RIGHT_REAR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.SIDE_GLASS_RIGHT_REAR_DAMAGE
                                    }, {
                                        label: 'Rear windshield',
                                        dbKey: 'REAR_WINDSHIELD_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.REAR_WINDSHIELD_DAMAGE
                                    }, {
                                        label: 'Worn, torn, interior/seats',
                                        dbKey: 'WORN_TORN_INTERIOR_SEAT_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.WORN_TORN_INTERIOR_SEAT_DAMAGE
                                    }, {
                                        label: 'Dashboard/ sound system',
                                        dbKey: 'DASHBOARD_SOUNDSYSTEM_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.DASHBOARD_SOUNDSYSTEM_DAMAGE
                                    }, {
                                        label: 'Undercarriage',
                                        dbKey: 'UNDERCARRIAGE_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.UNDERCARRIAGE_DAMAGE
                                    }, {
                                        label: 'Rear view mirror',
                                        dbKey: 'REAR_VIEW_MIRROR_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.REAR_VIEW_MIRROR_DAMAGE
                                    }, {
                                        label: 'Center console',
                                        dbKey: 'CENTER_CONSOLE_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.CENTER_CONSOLE_DAMAGE
                                    }, {
                                        label: 'OTHER',
                                        dbKey: 'OTHER',
                                        dbValue: $scope.inspectionSummaryResp.OTHER
                                    }, {
                                        label: 'OTHER_DESCRIPTION',
                                        dbKey: 'OTHER_DESCRIPTION',
                                        dbValue: $scope.inspectionSummaryResp.OTHER_DESCRIPTION
                                    }, {
                                        label: 'STORM_DAMAGE',
                                        dbKey: 'STORM_DAMAGE',
                                        dbValue: $scope.inspectionSummaryResp.STORM_DAMAGE
                                    }, {
                                        label: 'STORM_DAMAGE_DESCRIPTION',
                                        dbKey: 'STORM_DAMAGE_DESCRIPTION',
                                        dbValue: $scope.inspectionSummaryResp.STORM_DAMAGE_DESCRIPTION
                                    }
                                ];

                                for (var i = 0; i < $scope.DamagedDevices.length; i++) {
                                    if ($scope.DamagedDevices[i].dbValue == true) {
                                        if ($scope.DamagedDevices[i].dbKey == 'STORM_DAMAGE') {
                                            if ($scope.DamagedDevices[i + 1].dbValue != null && $scope.DamagedDevices[i + 1].dbValue != '') {

                                                $scope
                                                    .DamagedLables
                                                    .push('Storm Damage Description: ' + $scope.inspectionSummaryResp.STORM_DAMAGE_DESCRIPTION);

                                            } else {
                                                $scope
                                                    .DamagedLables
                                                    .push('Storm Damage Description: <NONE PROVIDED>');
                                            }
                                        } else if ($scope.DamagedDevices[i].dbKey == 'OTHER') {
                                            if ($scope.DamagedDevices[i + 1].dbValue != null && $scope.DamagedDevices[i + 1].dbValue != '') {

                                                $scope
                                                    .DamagedLables
                                                    .push('Other Damage Description: ' + $scope.inspectionSummaryResp.OTHER_DESCRIPTION);

                                            } else {
                                                $scope
                                                    .DamagedLables
                                                    .push('Other Damage Description: <NONE PROVIDED>');
                                            }
                                        } else {
                                            if ($scope.DamagedDevices[i].dbKey !== 'STORM_DAMAGE_DESCRIPTION') {
                                                $scope
                                                    .DamagedLables
                                                    .push($scope.DamagedDevices[i].label);
                                            } else if ($scope.DamagedDevices[i].dbKey !== 'OTHER_DESCRIPTION') {
                                                $scope
                                                    .DamagedLables
                                                    .push($scope.DamagedDevices[i].label);
                                            }

                                        }

                                    }

                                    $scope.DamagedDevicesString = $scope
                                        .DamagedLables
                                        .join(', ')
                                }

                                $scope.rustedDamaged = [
                                    {
                                        label: 'Front bumper',
                                        dbKey: 'FRONT_BUMPER_RUST',
                                        dbValue: $scope.inspectionSummaryResp.FRONT_BUMPER_RUST
                                    }, {
                                        label: 'Rear bumper',
                                        dbKey: 'REAR_BUMPER_RUST',
                                        dbValue: $scope.inspectionSummaryResp.REAR_BUMPER_RUST
                                    }, {
                                        label: 'Fender left front',
                                        dbKey: 'FENDER_LEFT_FRONT_RUST',
                                        dbValue: $scope.inspectionSummaryResp.FENDER_LEFT_FRONT_RUST
                                    }, {
                                        label: 'Fender right front',
                                        dbKey: 'FENDER_RIGHT_FRONT_RUST',
                                        dbValue: $scope.inspectionSummaryResp.FENDER_RIGHT_FRONT_RUST
                                    }, {
                                        label: 'Door left front',
                                        dbKey: 'DOOR_LEFT_FRONT_RUST',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_LEFT_FRONT_RUST
                                    }, {
                                        label: 'Door right front',
                                        dbKey: 'DOOR_RIGHT_FRONT_RUST',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_RIGHT_FRONT_RUST
                                    }, {
                                        label: 'Door left rear',
                                        dbKey: 'DOOR_LEFT_REAR_RUST',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_LEFT_REAR_RUST
                                    }, {
                                        label: 'Door right rear',
                                        dbKey: 'DOOR_RIGHT_REAR_RUST',
                                        dbValue: $scope.inspectionSummaryResp.DOOR_RIGHT_REAR_RUST
                                    }, {
                                        label: 'Quarter panel left rear',
                                        dbKey: 'QUARTER_PANEL_LEFT_REAR_RUST',
                                        dbValue: $scope.inspectionSummaryResp.QUARTER_PANEL_LEFT_REAR_RUST
                                    }, {
                                        label: 'Quarter panel right rear',
                                        dbKey: 'QUARTER_PANEL_RIGHT_REAR_RUST',
                                        dbValue: $scope.inspectionSummaryResp.QUARTER_PANEL_RIGHT_REAR_RUST
                                    }, {
                                        label: 'Hood panel',
                                        dbKey: 'HOOD_PANEL_RUST',
                                        dbValue: $scope.inspectionSummaryResp.HOOD_PANEL_RUST
                                    }, {
                                        label: 'Roof panel',
                                        dbKey: 'ROOF_PANEL_RUST',
                                        dbValue: $scope.inspectionSummaryResp.ROOF_PANEL_RUST
                                    }, {
                                        label: 'Trunk lid/rear door',
                                        dbKey: 'TRUNK_LID_RUST',
                                        dbValue: $scope.inspectionSummaryResp.TRUNK_LID_RUST
                                    }, {
                                        label: ' Grill',
                                        dbKey: 'GRILL_RUST',
                                        dbValue: $scope.inspectionSummaryResp.GRILL_RUST
                                    }, {
                                        label: 'Wheel covers',
                                        dbKey: 'WHELL_COVERS_RUST',
                                        dbValue: $scope.inspectionSummaryResp.WHELL_COVERS_RUST
                                    }, {
                                        label: 'Windshield',
                                        dbKey: 'WINDSHIELD_RUST',
                                        dbValue: $scope.inspectionSummaryResp.WINDSHIELD_RUST
                                    }

                                ];

                                for (var i = 0; i < $scope.rustedDamaged.length; i++) {
                                    if ($scope.rustedDamaged[i].dbValue == true) {
                                        $scope
                                            .rustedDamagedLables
                                            .push($scope.rustedDamaged[i].label);
                                    }
                                    $scope.rustedDamagedString = $scope
                                        .rustedDamagedLables
                                        .join(', ')
                                }

                                $scope.STATE_NAME = getStates(response.data[0].INSURED_STATE_CODE);
                                deferred.resolve({success: true});
                                return true,
                                response;
                            }
                        }, function (response) {
                            deferred.resolve({success: false});
                            $rootScope.isProcessShow(false);
                            return false;
                        });
                    deferred.resolve({success: true});

                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.formId != null && sessionStorage.formId != undefined) {

                    $scope.DATA = {
                        INSURED_APPLICATION_ID: sessionStorage.formId,
                        PAGE: 6,
                        UPDATE: false
                    }

                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA = {
                        INSURED_APPLICATION_ID: sessionStorage.clientID,
                        PAGE: 6,
                        UPDATE: false
                    }

                    $scope.onLoad();
                }

                function getStates(id) {
                    var defer = $q.defer();

                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {
                            $scope.states = response.data;
                            for (var i = 0; i < $scope.states.length; i++) {
                                if (id == $scope.states[i].id) {
                                    $scope.STATE_NAME = $scope.states[i].name;
                                }
                            }

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                }

                $scope.getYear = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/LISTOFYEARS", header)
                        .then(function onSuccess(response) {
                            $scope.yearID = response.data;
                            for (var i = 0; i < $scope.yearID.length; i++) {
                                if (id == $scope.yearID[i].ID) {
                                    $scope.YEAR_NAME = $scope.yearID[i].LIST_OF_YEARS1;
                                    return $scope.YEAR_NAME;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                }

                $scope.getMake = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofMake", header)
                        .then(function onSuccess(response) {
                            $scope.makes = response.data;
                            for (var i = 0; i < $scope.makes.length; i++) {
                                if (id == $scope.makes[i].Id) {
                                    $scope.MAKE = $scope.makes[i].MAKE1;
                                    return $scope.MAKE;
                                }
                            }

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });
                }

                $scope.getMajorColor = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofColors", header)
                        .then(function onSuccess(response) {
                            $scope.majorColors = response.data;
                            for (var i = 0; i < $scope.majorColors.length; i++) {
                                if (id == $scope.majorColors[i].Id) {
                                    $scope.colorMajor = $scope.majorColors[i].COLOR;
                                    return $scope.colorMajor;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });

                }

                $scope.getMinorColor = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofColors", header)
                        .then(function onSuccess(response) {
                            $scope.minorColors = response.data;
                            for (var i = 0; i < $scope.minorColors.length; i++) {
                                if (id == $scope.minorColors[i].Id) {
                                    $scope.colorMinor = $scope.minorColors[i].COLOR;
                                    return $scope.colorMinor;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });

                }

                $scope.getRadioEquipment = function (id) {
                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    }

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofRadiofEquipment", header)
                        .then(function onSuccess(response) {
                            $scope.radioEquipments = response.data;
                            for (var i = 0; i < $scope.radioEquipments.length; i++) {
                                if (id == $scope.radioEquipments[i].RADIO_ID) {
                                    $scope.radioEquipment = $scope.radioEquipments[i].RADIO_TYPE;
                                    return $scope.radioEquipment;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                        });

                }

                $scope.$on('callOnLoadInspectionSum', function (event, result) {
                    $scope.onLoadBool = result;
                    if ($scope.onLoadBool === true) {}
                });

                $scope.$on('callInspectSummary', function (event, result) {
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

                $scope.$on('visibilitySing', function (event, result) {
                    $scope.dataLoading = result
                    if (result == false) {
                        $scope.dynamicBtnName = 'View Report'
                    }
                });

                $scope.$on('originalSignature', function (event, result) {
                    $rootScope.isInsuredSing = false;
                    $scope.Usersing = result;
                });

                $scope.$on('inspectorOriginalSignature', function (event, result) {
                    $scope.inspectorUsersing = result
                });

            }
        }
    }
])