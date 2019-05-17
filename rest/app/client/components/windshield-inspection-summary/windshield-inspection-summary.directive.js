app.directive('windshieldInsuranceSummeryForm', [
    '$uibModal',
    '$state',
    'WizardHandler',
    '$anchorScroll',
    '$q',
    '$http',
    '$timeout',
    '$rootScope',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($uibModal, $state, WizardHandler, $anchorScroll, $q, $http, $timeout, $rootScope, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/windshield-inspection-summary/windshield-inspection-s' +
                    'ummary.html',
            link: function ($scope, $elem, $attr) {

                $scope.date = moment().format("MM/DD/YYYY");
                $scope.dataLoading = true;
                $scope.dynamicBtnName = 'Submit';
                $scope.wsNoneProvided = '<NONE PROVIDED>';

                $rootScope.isWinInsuredSing = true;
                $rootScope.isDisabledWinInsuredSignOnce = false;

                $scope.editWizardPage = function (step) {

                    WizardService.wizardContinue(step, false);
                    if (step == 0) {
                        $anchorScroll();
                        WizardService.setProgressLine(1, forward = false);
                    } else {
                        $anchorScroll();
                        WizardService.setProgressLine(3, forward = false);
                    }
                    WizardHandler
                        .wizard()
                        .goTo(step);

                };

                $scope.showModal = function () {
                    $rootScope.isProcessShow(true);
                    $rootScope.isDisabledWinInsuredSignOnce = true;
                    $rootScope.isWinInsuredSing = true;
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
                                    if (sessionStorage.wizardStepNo != null && sessionStorage.wizardStepNo != undefined) {

                                        if ($rootScope.winFormStateValidation.pageTwo != true) {

                                            toastr.error(CONSTANTS.winDamageFormRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                                            WizardHandler
                                                .wizard()
                                                .goTo(1);
                                            return;
                                        }
                                    }
                                    $uibModal
                                        .open({
                                            backdrop: 'static',
                                            backdropClick: false,
                                            dialogFade: false,
                                            keyboard: false,
                                            templateUrl: 'rest/app/client/components/windshield-insuredSignature-modal/windshield-insuredS' +
                                                    'ignature-modal.html',
                                            controller: 'winshieldInsuredSignModalController'
                                        })
                                        .result
                                        .then(function () {}, function () {});
                                }
                            }, function () {
                                $rootScope.isProcessShow(false);
                                toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                            });
                    }

                };

                // modal for Inspector Signature
                $scope.showWinInspectorModal = function () {
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

                                        if ($rootScope.winFormStateValidation.pageTwo != true) {

                                            toastr.error(CONSTANTS.winDamageFormRequired, {timeOut: $rootScope.toastrErrorFiveSec});
                                            WizardHandler
                                                .wizard()
                                                .goTo(1);
                                            return;
                                        }
                                    }
                                    $uibModal
                                        .open({
                                            backdrop: 'static',
                                            backdropClick: false,
                                            dialogFade: false,
                                            keyboard: false,
                                            templateUrl: 'rest/app/client/components/windshield-inspectorSignature-modal/windshield-inspec' +
                                                    'torSignature-modal.html',
                                            controller: 'winshieldInspectorSignModalController'
                                        })
                                        .result
                                        .then(function () {}, function () {});
                                }
                            }, function () {
                                $rootScope.isProcessShow(false);
                                toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                            });
                    }

                };

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

                $scope.DATA = {
                    PAGE: 3,
                    UPDATE: false,
                    WINSHIELD_ID: sessionStorage.WinshieldID

                };

                $scope.onLoad = function () {
                    gPageNumber = 0;
                    //Scroll to top
                    $anchorScroll();
                    $rootScope.isProcessShow(true);

                    var deferred = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.DATA, header)
                        .then(function (response) {
                            $rootScope.isProcessShow(false);
                            $scope.winLicesePlate = response.data.WIN_LICENSE_PLATE_NA;

                            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                                $scope.siteID = 'N/A';
                                $scope.inspectorName = 'N/A';
                                $scope.siteName = 'N/A';
                                $scope.siteLocation = 'N/A';
                                $scope.inspectorFirstName = 'N/A';
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
                            $scope.winInspectionSummaryResp = {
                                WIN_INSPECTION_DATE: response.data.WIN_INSPECTION_DATE,
                                WIN_ADVERSE_CONDITIONS: response.data.WIN_ADVERSE_CONDITIONS,
                                WIN_INSPECTION_COMPANY_NAME: response.data.WIN_INSPECTION_COMPANY_NAME,
                                WIN_INSURANCE_COMPANY_NAME_OTHER: response.data.WIN_INSURANCE_COMPANY_NAME_OTHER,
                                WIN_POLICY_NUMBER: response.data.WIN_POLICY_NUMBER,
                                WIN_INSURED_FIRST_NAME: response.data.WIN_INSURED_FIRST_NAME,
                                WIN_INSURED_LAST_NAME: response.data.WIN_INSURED_LAST_NAME,
                                WIN_INSURED_ADDRESS: response.data.WIN_INSURED_ADDRESS,
                                WIN_INSURED_TOWN: response.data.WIN_INSURED_TOWN,
                                WIN_INSURED_ZIPCODE: response.data.WIN_INSURED_ZIPCODE,
                                WIN_INSURED_CELL_PHONE: response.data.WIN_INSURED_CELL_PHONE,
                                WIN_INSURED_LANDLINE: response.data.WIN_INSURED_LANDLINE,

                                WIN_MODEL: response.data.WIN_MODEL,
                                WIN_MODEL_OTHER: response.data.WIN_MODEL_OTHER,
                                WIN_INSURED_STATE: response.data.WIN_INSURED_STATE,
                                WIN_STATE: response.data.WIN_STATE,
                                WIN_STATE_OF_VEHICLE_PLATE_OTHER: response.data.WIN_STATE_OF_VEHICLE_PLATE_OTHER,
                                WIN_INSURED_EMAIL: response.data.WIN_INSURED_EMAIL,
                                WIN_MAKE: response.data.WIN_MAKE,
                                WIN_YEAR: response.data.WIN_YEAR,
                                WIN_VEHICLE_IDENTIFICATION_NUMBER: response.data.WIN_VEHICLE_IDENTIFICATION_NUMBER,
                                WIN_ODOMETER: response.data.WIN_ODOMETER,
                                WIN_LICENSE_PLATE: response.data.WIN_LICENSE_PLATE,
                                WIN_LICENSE_PLATE_NA: response.data.WIN_LICENSE_PLATE_NA,

                                //damage section
                                WINDSHIELD_DAMAGE_DESCRIBE: response.data.WINDSHIELD_DAMAGE_DESCRIBE,

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

                                WIN_NO_DAMAGE: response.data.WIN_NO_DAMAGE,
                                AUTOMATIC_WIPERS: response.data.AUTOMATIC_WIPERS,

                                TINTED_WINDSHIELD: response.data.TINTED_WINDSHIELD,
                                WIN_OTHER_DESCRIPTION: response.data.WIN_OTHER_DESCRIPTION,
                                WIN_INSURED_SIGNATURE: response.data.WIN_INSURED_SIGNATURE
                            };

                            if ($scope.winInspectionSummaryResp.WIN_INSURED_SIGNATURE != null) {
                                $scope.Usersing = $scope.winInspectionSummaryResp.WIN_INSURED_SIGNATURE;
                                $rootScope.isWinInsuredSing = false;
                            }

                            $scope.DamagedLables = [];

                            $scope.DamagedDevices = [
                                {
                                    label: 'Passenger Side Chipped',
                                    dbKey: 'PASSENGER_CHIP',
                                    dbValue: $scope.winInspectionSummaryResp.PASSENGER_CHIP
                                }, {
                                    label: 'Passenger Side Star Crack',
                                    dbKey: 'PASSENGER_STAR_CRACK',
                                    dbValue: $scope.winInspectionSummaryResp.PASSENGER_STAR_CRACK
                                }, {
                                    label: 'Passenger Side Cracked',
                                    dbKey: 'PASSENGER_CRACKED',
                                    dbValue: $scope.winInspectionSummaryResp.PASSENGER_CRACKED
                                }, {
                                    label: 'Passenger Side Smashed',
                                    dbKey: 'PASSENGER_SMASHED',
                                    dbValue: $scope.winInspectionSummaryResp.PASSENGER_SMASHED
                                }, {
                                    label: 'Passenger Side Pitted',
                                    dbKey: 'PASSENGER_PIT',
                                    dbValue: $scope.winInspectionSummaryResp.PASSENGER_PIT
                                }, {
                                    label: 'Center Chipped',
                                    dbKey: 'CENTER_CHIP',
                                    dbValue: $scope.winInspectionSummaryResp.CENTER_CHIP
                                }, {
                                    label: 'Center Star Crack',
                                    dbKey: 'CENTER_STAR_CRACK',
                                    dbValue: $scope.winInspectionSummaryResp.CENTER_STAR_CRACK
                                }, {
                                    label: 'Center Cracked',
                                    dbKey: 'CENTER_CRACKED',
                                    dbValue: $scope.winInspectionSummaryResp.CENTER_CRACKED
                                }, {
                                    label: 'Center Smashed',
                                    dbKey: 'CENTER_SMASHED',
                                    dbValue: $scope.winInspectionSummaryResp.CENTER_SMASHED
                                }, {
                                    label: 'Center Pitted',
                                    dbKey: 'CENTER_PIT',
                                    dbValue: $scope.winInspectionSummaryResp.CENTER_PIT
                                }, {

                                    label: 'Driver Side Chipped',
                                    dbKey: 'DRIVER_SIDE_CHIP',
                                    dbValue: $scope.winInspectionSummaryResp.DRIVER_SIDE_CHIP
                                }, {
                                    label: 'Driver Side Star Crack',
                                    dbKey: 'DRIVER_SIDE_STAR_CRACK',
                                    dbValue: $scope.winInspectionSummaryResp.DRIVER_SIDE_STAR_CRACK
                                }, {
                                    label: 'Driver Side Cracked',
                                    dbKey: 'DRIVER_SIDE_CRACKED',
                                    dbValue: $scope.winInspectionSummaryResp.DRIVER_SIDE_CRACKED
                                }, {
                                    label: 'Driver Side Smashed',
                                    dbKey: 'DRIVER_SIDE_SMASHED',
                                    dbValue: $scope.winInspectionSummaryResp.DRIVER_SIDE_SMASHED
                                }, {
                                    label: 'Driver Side Pitted',
                                    dbKey: 'DRIVER_SIDE_PIT',
                                    dbValue: $scope.winInspectionSummaryResp.DRIVER_SIDE_PIT
                                }
                            ];

                            for (var i = 0; i < $scope.DamagedDevices.length; i++) {

                                if ($scope.DamagedDevices[i].dbValue == true) {

                                    $scope
                                        .DamagedLables
                                        .push($scope.DamagedDevices[i].label);

                                }
                                $scope.DamagedDevicesString = $scope
                                    .DamagedLables
                                    .join(', ');
                            }

                            getStates(response.data.WIN_INSURED_STATE);
                            getPlateStates(response.data.WIN_STATE);
                            $scope.getYear(response.data.WIN_YEAR);
                            $scope.getMake(response.data.WIN_MAKE);
                            getAdverseConditions(response.data.WIN_ADVERSE_CONDITIONS);
                            getInsuranceCompany(response.data.WIN_INSPECTION_COMPANY_NAME);
                            deferred.resolve({success: true});
                            return true,
                            response;
                        }, function (response) {
                            $rootScope.isProcessShow(false);
                            deferred.resolve({success: false});
                            return false;
                        });
                    deferred.resolve({success: true});

                };

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.WinshieldID != null && sessionStorage.WinshieldID != undefined) {

                    $scope.DATA = {
                        WINSHIELD_ID: sessionStorage.WinshieldID,
                        PAGE: 3,
                        UPDATE: false
                    };
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.WinshieldID != null) {

                    $scope.DATA = {
                        WINSHIELD_ID: sessionStorage.WinshieldID,
                        PAGE: 3,
                        UPDATE: false
                    };
                    $scope.onLoad();
                } else if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA = {
                        WINSHIELD_ID: sessionStorage.clientID,
                        PAGE: 3,
                        UPDATE: false
                    };
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
                                    $scope.STATE_NAME_OWNER = $scope.states[i].name;

                                }
                            }

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {

                            defer.resolve({success: false});
                        });
                }

                function getPlateStates(id) {
                    var defer = $q.defer();

                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {

                            $scope.plateStates = response.data;

                            for (var i = 0; i < $scope.plateStates.length; i++) {

                                if (id == $scope.plateStates[i].id) {
                                    $scope.PlateStateName = $scope.plateStates[i].name;
                                }
                            }

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {

                            defer.resolve({success: false});
                        });
                }

                //AdverseConditions API Call

                function getAdverseConditions(id) {

                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ADVERSECONDITIONS", header)
                        .then(function onSuccess(response) {

                            $scope.adverseConditions = response.data;
                            for (var i = 0; i < $scope.adverseConditions.length; i++) {

                                if (id == $scope.adverseConditions[i].ID) {
                                    $scope.ADVERSE_NAME = $scope.adverseConditions[i].ADVERSE_CONDITION;

                                    return $scope.ADVERSE_NAME;
                                }
                            }

                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {

                            defer.resolve({success: false});
                        });
                }

                //InsuranceCompany API Call

                function getInsuranceCompany(id) {

                    if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                        var siteIdForIC = sessionStorage.siteId;
                    } else {
                        var siteIdForIC = "null";
                    }

                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofCompany/" + siteIdForIC, header)
                        .then(function onSuccess(response) {

                            $scope.insuranceCompanies = response.data;
                            for (var i = 0; i < $scope.insuranceCompanies.length; i++) {

                                if (id == $scope.insuranceCompanies[i].CompanyID) {
                                    $scope.COMPANY_NAME = $scope.insuranceCompanies[i].Name;

                                    return $scope.COMPANY_NAME;
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
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/LISTOFYEARS", header)
                        .then(function onSuccess(response) {

                            $scope.YEARS = response.data;
                            for (var i = 0; i < $scope.YEARS.length; i++) {

                                if (id == $scope.YEARS[i].ID) {
                                    $scope.year = $scope.YEARS[i].LIST_OF_YEARS1;

                                    return $scope.year;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {

                            defer.resolve({success: false});
                        });

                };

                $scope.getMake = function (id) {

                    var defer = $q.defer();
                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ListofMake", header)
                        .then(function onSuccess(response) {

                            $scope.Make = response.data;
                            for (var i = 0; i < $scope.Make.length; i++) {
                                if (id == $scope.Make[i].ID) {
                                    $scope.make = $scope.Make[i].MAKE1;

                                    return $scope.make;
                                }
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {

                            defer.resolve({success: false});
                        });

                };

                $scope.$on('callWindInspectSummary', function (event, result) {
                    $scope.onLoadBool = result;
                    if ($scope.onLoadBool === true) {
                        if (sessionStorage.WinshieldID != null || sessionStorage.WinshieldID != undefined) {
                            $scope.DATA.WINSHIELD_ID = sessionStorage.WinshieldID;

                        } else if (sessionStorage.clientID != null || sessionStorage.clientID != undefined) {

                            $scope.DATA.WINSHIELD_ID = sessionStorage.clientID;

                        }
                        $scope.onLoad();

                    }
                });

                $scope.$on('winVisibilitySing', function (event, result) {

                    $scope.dataLoading = result;

                    if (result == false) {
                        $scope.dynamicBtnName = 'View Report';
                    }
                });

                $scope.$on('winOriginalSignature', function (event, result) {

                    $rootScope.isWinInsuredSing = false;

                    $scope.Usersing = result;

                });

                $scope.$on('winInspectorOriginalSignature', function (event, result) {
                    $scope.winInspectorUsersing = result;
                });
            }
        };
    }
]);