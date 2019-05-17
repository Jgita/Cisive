app.directive('windshieldInsuredForm', [
    '$state',
    'WizardHandler',
    '$q',
    '$http',
    '$anchorScroll',
    '$timeout',
    '$filter',
    '$rootScope',
    'toastr',
    'globalService',
    'WizardService',
    '$css',
    'CONSTANTS',
    function ($state, WizardHandler, $q, $http, $anchorScroll, $timeout, $filter, $rootScope, toastr, globalService, WizardService, $css, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/windshield-insured-form/windshield-insured-form.html',
            link: function ($scope, $elem, $attr) {

                $scope.minlength = 14;
                $scope.maxlength = 14;
                $scope.otherUnknownCompanyCode = 'OTHER/UNKNOWN';
                $scope.VINcount = 0;
                gPageNumber = 1;

                $scope.windshieldSubmit = function () {
                    angular
                        .forEach($scope.windshieldInsuredForm.$error.required, function (field) {
                            toastr.error(CONSTANTS.requiredFields, {timeOut: $rootScope.toastrTimeThreeSec});
                            field.$setDirty();
                        });
                };

                $scope.showMessage = function (input) {
                    var show = $scope.windshieldInsuredForm.$submitted && input && input.$error.required;
                    return show;
                };

                $scope.plateNAStatusForWinState = function (item) {

                    // $scope.statusOfPlateNumber = item;  $scope.getStates();

                    if (item == true) {
                        $scope.WindshieldInsuredInfo.WIN_LICENSE_PLATE = '';
                    }
                };

                // for mobile browser
                $scope.onLoadValueForMobile = function () {
                    var deferred = $q.defer();
                    var request = {
                        method: 'GET',
                        url: $rootScope.baseUrl + 'user/getuserprofile/' + $scope.USERID,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        }
                    }

                    $http(request).then(function (response) {

                        var profileData = response.data["0"];
                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                            $rootScope.stateCode = profileData
                                .STATE_CODE
                                .trim();
                            if (profileData.INSURED_FIRST_NAME != null || profileData.INSURED_LAST_NAME != null || sessionStorage.userDispalyName != null || profileData.INSURED_CELL_PHONE != null) {
                                $scope.WindshieldInsuredInfo = {
                                    WIN_INSURED_CELL_PHONE: profileData.INSURED_CELL_PHONE,
                                    WIN_INSURED_EMAIL: sessionStorage.userDispalyName,
                                    WIN_INSURED_FIRST_NAME: profileData.INSURED_FIRST_NAME,
                                    WIN_INSURED_LAST_NAME: profileData.INSURED_LAST_NAME
                                };
                            }
                            $scope.isRequired = false;
                        } else {
                            $scope.isRequired = true;
                            var siteId = sessionStorage.siteId;
                            var siteIdFirstTwo = siteId.substring(0, 2);
                            $rootScope.stateCode = siteIdFirstTwo;
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
                if (typeof window.orientation != 'undefined') {
                    if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                        $scope.userType = 'Insured';
                        $scope.USERID = sessionStorage.userId;
                        $scope.onLoadValueForMobile();
                    } else {
                        $scope.userType = 'Inspector';
                        $scope.userEmail = sessionStorage.userDispalyName;
                    }
                }
                // end

                $css.bind({
                    href: 'rest/app/client/components/windshield-insured-form/windshield-insured-form.css'
                }, $scope);

                $scope.date = moment().format("MM-DD-YYYY");
                $scope.time = moment().format("hh:mm a");

                $scope.OnBlurVINValidation = function (VIN) {
                    $rootScope.isProcessShow(true);

                    if (VIN) {
                        VIN = VIN.toUpperCase();
                    } else {
                        $rootScope.isProcessShow(false);
                    }

                    if (VIN) {
                        var winVINData = {
                            WIN_VEHICLE_IDENTIFICATION_NUMBER: VIN,
                            VIN_FlAG: false
                        };
                        var deferred = $q.defer();

                        var header = {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        };

                        if (VIN == $scope.winVINCopy || $scope.VINcount == 1) {
                            winVINData.VIN_FlAG = true;
                        } else {
                            winVINData.VIN_FlAG = false;
                        }

                        globalService
                            .globalServiceAuthAPI("GET", "windShied/GetVIN/" + VIN + '/' + winVINData.VIN_FlAG, header)
                            .then(function (response) {
                                $rootScope.isProcessShow(false);
                                if (response.data.Response == 'VIN Not Found In CARCO') {
                                    $scope.VINcount = 1;
                                    $scope.winVINCopy = winVINData.WIN_VEHICLE_IDENTIFICATION_NUMBER;
                                    toastr.warning(CONSTANTS.reEnterVIN, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $scope.WindshieldInsuredInfo.WIN_VEHICLE_IDENTIFICATION_NUMBER = '';
                                } else {
                                    $scope.WindshieldInsuredInfo.WIN_YEAR = response.data.VIN_RESULT.WIN_YEAR;
                                    $scope.WindshieldInsuredInfo.WIN_MAKE = response.data.VIN_RESULT.WIN_MAKE;
                                    if ($scope.WindshieldInsuredInfo.WIN_MAKE != null && $scope.WindshieldInsuredInfo.WIN_MAKE != '') {
                                        $scope.makeSelected(response.data.VIN_RESULT.WIN_MAKE);
                                    }
                                    $scope.WindshieldInsuredInfo.WIN_MODEL = response.data.VIN_RESULT.WIN_MODEL;
                                }

                            }, function () {
                                $rootScope.isProcessShow(false);
                                toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                deferred.resolve({success: false});
                            });

                    }
                };

                $scope.getAdverseConditions = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/ADVERSECONDITIONS", header)
                        .then(function onSuccess(response) {
                            $scope.adverseConditions = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            defer.resolve({success: false});
                            $rootScope.isProcessShow(false);
                        });
                };

                $scope.getInsuranceCompany = function () {
                    $rootScope.isProcessShow(true);
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
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: false});
                        });
                };

                // $scope.getStatesForPlate = function () {     $rootScope.isProcessShow(true);
                // var defer = $q.defer();     $http         .get($rootScope.baseUrl +
                // 'user/getState')         .then(function onSuccess(response) {
                // $rootScope.isProcessShow(false);             $scope.statesForPlate =
                // response.data;             defer.resolve({success: true});         })
                // .catch(function onError(response) { $rootScope.isProcessShow(false);
                // defer.resolve({success: false});         }); };

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
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: false});
                        });
                };

                $scope.filterStatesForProvince = function () {
                    if ($scope.states) {
                        return $scope
                            .states
                            .filter(function (item) {
                                return item.name !== 'N/A';
                            });
                    }
                }

                $scope.getStatesForProvince = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {
                            $scope.statesProvince = response.data;
                            $rootScope.isProcessShow(false);
                            $scope.statesProvince = $scope
                                .statesProvince
                                .filter(function (item) {
                                    return item.name !== 'N/A';
                                });
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: false});
                        });
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

                var progressDiv = false;
                var wizardDoneStepStatus = false;
                while (!progressDiv) {
                    var progressElement = angular.element("<div class='progress-line'></div>");
                    $scope.target = document.querySelector('.steps-indicator');
                    angular
                        .element($scope.target)
                        .prepend(progressElement);

                    if ($scope.target != null) {
                        progressDiv = true;
                    }
                }

                if (sessionStorage.wizardStepNo != null) {

                    $scope.stepNo = sessionStorage.wizardStepNo;
                    WizardService.wizardContinue($scope.stepNo, wizardDoneStepStatus);
                    WizardHandler
                        .wizard()
                        .setEditMode(true);
                    WizardHandler
                        .wizard()
                        .goTo(parseInt(sessionStorage.wizardStepNo));

                }

                $scope.typeOfPhoneNumbers = [
                    {
                        name: 'Mobile',
                        checked: true
                    }, {
                        name: 'Landline',
                        checked: false
                    }
                ];

                $scope.showMobile = true;

                $scope.handleRadioClick = function (item) {
                    $scope.phoneType = item;
                    if (item.name === 'Mobile') {
                        $scope.showMobile = true;
                        $scope.showLandline = false;

                    } else if (item.name === 'Landline') {
                        $scope.showLandline = true;
                        $scope.showMobile = false;

                    }

                };

                $scope.cellPhoneUpdate = function (type, value) {
                    if (type === 'cell') {
                        $scope.WindshieldInsuredInfo.WIN_INSURED_LANDLINE = '';
                    } else if (type === 'landLine') {
                        $scope.WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE = '';
                    }
                };

                $scope.winModelUpdate = function (model) {
                    if (model != 'OTHER') {
                        $scope.WindshieldInsuredInfo.WIN_MODEL_OTHER = '';
                    }

                }

                $scope.getCurrentYear = function () {
                    var date = new Date();
                    return currentYear = date.getFullYear();
                };

                $scope.currentYear = $scope.getCurrentYear() + 2;

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

                $scope.getStates();
                $scope.getStatesForProvince();
                $scope.getYear();
                $scope.getAdverseConditions();
                $scope.getInsuranceCompany();
                //  $scope.getStatesForPlate();
                $scope.getMake();

                $scope.DATA = {
                    PAGE: 1,
                    UPDATE: false,
                    WINSHIELD_ID: 0,
                    USER_NAME: sessionStorage.userDispalyName
                };
                // $scope.getStatesForPlate();
                $scope.onLoad = function () {
                   
                    $rootScope.isProcessShow(true);

                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.DATA, header)
                        .then(function (response) {
                            gPageNumber = 0;
                            $rootScope.isProcessShow(false);
                            response.data.WIN_INSURED_STATE = parseInt(response.data.WIN_INSURED_STATE);
                            //    $scope.filterStatesForProvince();
                            $scope.WindshieldInsuredInfo = {
                                WIN_ADVERSE_CONDITIONS: response.data.WIN_ADVERSE_CONDITIONS,
                                WIN_INSPECTION_COMPANY_NAME: response.data.WIN_INSPECTION_COMPANY_NAME,
                                WIN_INSURANCE_COMPANY_NAME_OTHER: response.data.WIN_INSURANCE_COMPANY_NAME_OTHER,
                                WIN_POLICY_NUMBER: response.data.WIN_POLICY_NUMBER,
                                WIN_INSURED_LAST_NAME: response.data.WIN_INSURED_LAST_NAME,
                                WIN_INSURED_MIDDLE_NAME: response.data.WIN_INSURED_MIDDLE_NAME,
                                WIN_INSURED_FIRST_NAME: response.data.WIN_INSURED_FIRST_NAME,
                                WIN_INSURED_ADDRESS: response.data.WIN_INSURED_ADDRESS,
                                WIN_INSURED_TOWN: response.data.WIN_INSURED_TOWN,
                                WIN_INSURED_STATE: response.data.WIN_INSURED_STATE,
                                WIN_INSURED_ZIPCODE: response.data.WIN_INSURED_ZIPCODE,
                                WIN_INSURED_CELL_PHONE: response.data.WIN_INSURED_CELL_PHONE,
                                WIN_INSURED_LANDLINE: response.data.WIN_INSURED_LANDLINE,
                                INSURED_WORK_PHONE: response.data.INSURED_WORK_PHONE,
                                WIN_INSURED_EMAIL: response.data.WIN_INSURED_EMAIL,
                                AUTHORIZATION_FORM_NUMBER: response.data.AUTHORIZATION_FORM_NUMBER,
                                WIN_YEAR: response.data.WIN_YEAR,
                                WIN_MAKE: response.data.WIN_MAKE,
                                WIN_MODEL: response.data.WIN_MODEL,
                                WIN_MODEL_OTHER: response.data.WIN_MODEL_OTHER,
                                WIN_VEHICLE_IDENTIFICATION_NUMBER: response.data.WIN_VEHICLE_IDENTIFICATION_NUMBER,
                                WIN_ODOMETER: response.data.WIN_ODOMETER,
                                WIN_LICENSE_PLATE: response.data.WIN_LICENSE_PLATE,
                                WIN_LICENSE_PLATE_NA: response.data.WIN_LICENSE_PLATE_NA,
                                IS_WIN_FIRST_NAME_ENABLE: response.data.IS_WIN_FIRST_NAME_ENABLE,
                                WIN_STATE: response.data.WIN_STATE,
                                WIN_STATE_OF_VEHICLE_PLATE_OTHER: response.data.WIN_STATE_OF_VEHICLE_PLATE_OTHER
                            };

                            if ($scope.WindshieldInsuredInfo.WIN_MAKE != null && $scope.WindshieldInsuredInfo.WIN_MAKE != '') {
                                $scope.getModel($scope.WindshieldInsuredInfo.WIN_MAKE);
                            }

                            $scope.WindshieldInsuredInfo.WIN_INSURED_STATE = response.data.WIN_INSURED_STATE;
                            $scope.WindshieldInsuredInfo.WIN_STATE = response.data.WIN_STATE;
                            $scope.WindshieldInsuredInfo.WIN_STATE_OF_VEHICLE_PLATE_OTHER = response.data.WIN_STATE_OF_VEHICLE_PLATE_OTHER;
                            $scope.WindshieldInsuredInfo.WIN_ADVERSE_CONDITIONS = response.data.WIN_ADVERSE_CONDITIONS;
                            $scope.WindshieldInsuredInfo.WIN_INSPECTION_COMPANY_NAME = response.data.WIN_INSPECTION_COMPANY_NAME;
                            $scope.WindshieldInsuredInfo.WIN_INSURANCE_COMPANY_NAME_OTHER = response.data.WIN_INSURANCE_COMPANY_NAME_OTHER;

                            // getPlateStateWinPromise.then(function (resp) {
                            // $scope.WindshieldInsuredInfo.WIN_STATE = response.data.WIN_STATE; })
                            if (response.data.WIN_INSURED_CELL_PHONE != null) {
                                var formatCellPhone = response.data.WIN_INSURED_CELL_PHONE;
                                // $scope.WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE =
                                // $filter('tel')(formatCellPhone);

                                $scope.typeOfPhoneNumbers = [
                                    {
                                        name: 'Mobile',
                                        checked: true
                                    }, {
                                        name: 'Landline',
                                        checked: false
                                    }

                                ];

                                $scope.showMobile = true;
                                $scope.showLandline = false;
                            }

                            if (response.data.WIN_INSURED_LANDLINE != null) {
                                var formatLandPhone = response.data.WIN_INSURED_LANDLINE;
                                $scope.WindshieldInsuredInfo.WIN_INSURED_LANDLINE = formatLandPhone;

                                $scope.typeOfPhoneNumbers = [
                                    {
                                        name: 'Mobile',
                                        checked: false
                                    }, {
                                        name: 'Landline',
                                        checked: true
                                    }

                                ];

                                $scope.showLandline = true;
                                $scope.showMobile = false;

                            }

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

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.WinshieldID != null) {
                    $scope.DATA.WINSHIELD_ID = sessionStorage.WinshieldID;
                    $scope.onLoad();

                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.WinshieldID != null) {

                    $scope.DATA.WINSHIELD_ID = sessionStorage.WinshieldID;
                    $scope.onLoad();

                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {

                    if ($rootScope.CellPhone != null || $rootScope.FirstNameToDispaly != null || sessionStorage.userDispalyName != null) {

                        $scope.WindshieldInsuredInfo = {

                            WIN_INSURED_CELL_PHONE: $rootScope.CellPhone,
                            WIN_INSURED_EMAIL: sessionStorage.userDispalyName,

                            WIN_INSURED_FIRST_NAME: $rootScope.FirstNameToDispaly,
                            WIN_INSURED_LAST_NAME: $rootScope.LastNameToDispaly
                        };
                    }
                    $scope.isRequired = false;
                } else {
                    $scope.isRequired = true;
                }

                $scope.goNext = function (WindshieldInsuredInfo) {

                    WindshieldInsuredInfo.WIN_VEHICLE_IDENTIFICATION_NUMBER = WindshieldInsuredInfo
                        .WIN_VEHICLE_IDENTIFICATION_NUMBER
                        .toUpperCase();

                    WindshieldInsuredInfo.WIN_LICENSE_PLATE = WindshieldInsuredInfo
                        .WIN_LICENSE_PLATE
                        .toUpperCase();

                    if (angular.element('#vin').val() == 0) {
                        angular
                            .element('#vin')
                            .$setDirty();
                    }

                    if (WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE) {
                        WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE = WindshieldInsuredInfo
                            .WIN_INSURED_CELL_PHONE
                            .replace(/[^0-9]/g, '');
                    }
                    if (WindshieldInsuredInfo.WIN_INSURED_LANDLINE) {
                        WindshieldInsuredInfo.WIN_INSURED_LANDLINE = WindshieldInsuredInfo
                            .WIN_INSURED_LANDLINE
                            .replace(/[^0-9]/g, '');
                    }

                    $rootScope.sessionLogout();
                    //Scroll to top
                    $anchorScroll();

                    if (WindshieldInsuredInfo == undefined) {
                        WindshieldInsuredInfo = '';
                    }

                    if ($scope.windshieldInsuredForm.$invalid) {
                        $scope.windshieldInsuredForm.$submitted = true;
                    } else {
                        $scope.windshieldInsuredForm.$submitted = false;
                    }
                    if ($scope.windshieldInsuredForm.$submitted == false) {
                        $rootScope.isProcessShow(true);
                        $scope.dataLoading = true;
                        var deferred = $q.defer();

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            $scope.WindshieldInsuredData = {

                                WIN_ADVERSE_CONDITIONS: WindshieldInsuredInfo.WIN_ADVERSE_CONDITIONS,
                                WIN_INSPECTION_COMPANY_NAME: WindshieldInsuredInfo.WIN_INSPECTION_COMPANY_NAME,
                                WIN_INSURANCE_COMPANY_NAME_OTHER: WindshieldInsuredInfo.WIN_INSURANCE_COMPANY_NAME_OTHER,
                                WIN_POLICY_NUMBER: WindshieldInsuredInfo.WIN_POLICY_NUMBER,
                                WIN_INSURED_LAST_NAME: WindshieldInsuredInfo.WIN_INSURED_LAST_NAME,
                                WIN_INSURED_MIDDLE_NAME: WindshieldInsuredInfo.WIN_INSURED_MIDDLE_NAME,
                                WIN_INSURED_FIRST_NAME: WindshieldInsuredInfo.WIN_INSURED_FIRST_NAME,
                                WIN_INSURED_ADDRESS: WindshieldInsuredInfo.WIN_INSURED_ADDRESS,
                                WIN_INSURED_TOWN: WindshieldInsuredInfo.WIN_INSURED_TOWN,
                                WIN_INSURED_STATE: WindshieldInsuredInfo.WIN_INSURED_STATE,
                                WIN_INSURED_ZIPCODE: WindshieldInsuredInfo.WIN_INSURED_ZIPCODE,
                                WIN_INSURED_CELL_PHONE: WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE,
                                WIN_INSURED_LANDLINE: WindshieldInsuredInfo.WIN_INSURED_LANDLINE,
                                INSURED_WORK_PHONE: WindshieldInsuredInfo.INSURED_WORK_PHONE,
                                WIN_INSURED_EMAIL: WindshieldInsuredInfo.WIN_INSURED_EMAIL,

                                AUTHORIZATION_FORM_NUMBER: WindshieldInsuredInfo.AUTHORIZATION_FORM_NUMBER,
                                WIN_YEAR: WindshieldInsuredInfo.WIN_YEAR,
                                WIN_MAKE: WindshieldInsuredInfo.WIN_MAKE,
                                WIN_MODEL: WindshieldInsuredInfo.WIN_MODEL,
                                WIN_MODEL_OTHER: WindshieldInsuredInfo.WIN_MODEL_OTHER,
                                WIN_VEHICLE_IDENTIFICATION_NUMBER: WindshieldInsuredInfo.WIN_VEHICLE_IDENTIFICATION_NUMBER,
                                WIN_ODOMETER: WindshieldInsuredInfo.WIN_ODOMETER,
                                WIN_LICENSE_PLATE: WindshieldInsuredInfo.WIN_LICENSE_PLATE,
                                WIN_LICENSE_PLATE_NA: WindshieldInsuredInfo.WIN_LICENSE_PLATE_NA,
                                IS_WIN_FIRST_NAME_ENABLE: WindshieldInsuredInfo.IS_WIN_FIRST_NAME_ENABLE,
                                WIN_STATE: WindshieldInsuredInfo.WIN_STATE,
                                WIN_STATE_OF_VEHICLE_PLATE_OTHER: WindshieldInsuredInfo.WIN_STATE_OF_VEHICLE_PLATE_OTHER,
                                PAGE: 1,
                                WINSHIELD_ID: 0,
                                UPDATE: true,
                                SITE_ID: sessionStorage.siteId,
                                USER_NAME: sessionStorage.userDispalyName,
                                RANDOM_NUMBER: sessionStorage.randomNumber
                            };

                            if (sessionStorage.clientID != null) {

                                $scope.WindshieldInsuredData.WINSHIELD_ID = sessionStorage.clientID;

                            } else if (sessionStorage.WinshieldID != null) {

                                $scope.WindshieldInsuredData.WINSHIELD_ID = sessionStorage.WinshieldID;

                            }

                            if ($scope.showMobile) {
                                $scope.WindshieldInsuredData.WIN_INSURED_LANDLINE = '';
                            } else if ($scope.showLandline) {
                                $scope.WindshieldInsuredData.WIN_INSURED_CELL_PHONE = '';
                            }

                            globalService
                                .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.WindshieldInsuredData, header)
                                .then(function (response) {
                                    sessionStorage.clientID = response.data;
                                    $rootScope.isProcessShow(false);

                                    $scope.dataLoading = false;

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();

                                    WizardService.setProgressLine(3, forward = false);
                                    $rootScope.$broadcast('callWindInspectSummary', true);

                                    deferred.resolve({success: true});
                                }, function (error) {

                                    $rootScope.isProcessShow(false);

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $scope.dataLoading = false;

                                    deferred.resolve({success: false});
                                });
                        } else {

                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            $scope.WindshieldInsuredData = {

                                WIN_ADVERSE_CONDITIONS: WindshieldInsuredInfo.WIN_ADVERSE_CONDITIONS,
                                WIN_INSPECTION_COMPANY_NAME: WindshieldInsuredInfo.WIN_INSPECTION_COMPANY_NAME,
                                WIN_INSURANCE_COMPANY_NAME_OTHER: WindshieldInsuredInfo.WIN_INSURANCE_COMPANY_NAME_OTHER,
                                WIN_POLICY_NUMBER: WindshieldInsuredInfo.WIN_POLICY_NUMBER,
                                WIN_INSURED_LAST_NAME: WindshieldInsuredInfo.WIN_INSURED_LAST_NAME,
                                WIN_INSURED_MIDDLE_NAME: WindshieldInsuredInfo.WIN_INSURED_MIDDLE_NAME,
                                WIN_INSURED_FIRST_NAME: WindshieldInsuredInfo.WIN_INSURED_FIRST_NAME,
                                WIN_INSURED_ADDRESS: WindshieldInsuredInfo.WIN_INSURED_ADDRESS,
                                WIN_INSURED_TOWN: WindshieldInsuredInfo.WIN_INSURED_TOWN,
                                WIN_INSURED_STATE: WindshieldInsuredInfo.WIN_INSURED_STATE,
                                WIN_INSURED_ZIPCODE: WindshieldInsuredInfo.WIN_INSURED_ZIPCODE,
                                WIN_INSURED_CELL_PHONE: WindshieldInsuredInfo.WIN_INSURED_CELL_PHONE,
                                WIN_INSURED_LANDLINE: WindshieldInsuredInfo.WIN_INSURED_LANDLINE,
                                INSURED_WORK_PHONE: WindshieldInsuredInfo.INSURED_WORK_PHONE,
                                WIN_INSURED_EMAIL: WindshieldInsuredInfo.WIN_INSURED_EMAIL,

                                AUTHORIZATION_FORM_NUMBER: WindshieldInsuredInfo.AUTHORIZATION_FORM_NUMBER,
                                WIN_YEAR: WindshieldInsuredInfo.WIN_YEAR,
                                WIN_MAKE: WindshieldInsuredInfo.WIN_MAKE,
                                WIN_MODEL: WindshieldInsuredInfo.WIN_MODEL,
                                WIN_MODEL_OTHER: WindshieldInsuredInfo.WIN_MODEL_OTHER,
                                WIN_VEHICLE_IDENTIFICATION_NUMBER: WindshieldInsuredInfo.WIN_VEHICLE_IDENTIFICATION_NUMBER,
                                WIN_ODOMETER: WindshieldInsuredInfo.WIN_ODOMETER,
                                WIN_LICENSE_PLATE: WindshieldInsuredInfo.WIN_LICENSE_PLATE,
                                WIN_LICENSE_PLATE_NA: WindshieldInsuredInfo.WIN_LICENSE_PLATE_NA,
                                IS_WIN_FIRST_NAME_ENABLE: WindshieldInsuredInfo.IS_WIN_FIRST_NAME_ENABLE,
                                WIN_STATE: WindshieldInsuredInfo.WIN_STATE,
                                WIN_STATE_OF_VEHICLE_PLATE_OTHER: WindshieldInsuredInfo.WIN_STATE_OF_VEHICLE_PLATE_OTHER,
                                PAGE: 1,
                                WINSHIELD_ID: 0,
                                UPDATE: true,
                                USER_NAME: sessionStorage.userDispalyName,
                                RANDOM_NUMBER: sessionStorage.randomNumber
                            };

                            if (sessionStorage.clientID != null) {

                                $scope.WindshieldInsuredData.WINSHIELD_ID = sessionStorage.clientID;

                            } else if (sessionStorage.WinshieldID != null) {

                                $scope.WindshieldInsuredData.WINSHIELD_ID = sessionStorage.WinshieldID;

                            }

                            if ($scope.showMobile) {
                                $scope.WindshieldInsuredData.WIN_INSURED_LANDLINE = '';
                            } else if ($scope.showLandline) {
                                $scope.WindshieldInsuredData.WIN_INSURED_CELL_PHONE = '';
                            }

                            globalService
                                .globalServiceAPI("POST", "WindShield/WindShieldData", $scope.WindshieldInsuredData, header)
                                .then(function (response) {

                                    sessionStorage.clientID = response.data;
                                    $rootScope.isProcessShow(false);

                                    $scope.dataLoading = false;

                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();

                                    WizardService.setProgressLine(3, forward = false);
                                    $rootScope.$broadcast('callWindInspectSummary', true);

                                    deferred.resolve({success: true});
                                }, function (error) {

                                    $rootScope.isProcessShow(false);

                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $scope.dataLoading = false;

                                    deferred.resolve({success: false});
                                });
                        }
                    }
                };

                $rootScope.sessionLogout();
            }
        };
    }
]);