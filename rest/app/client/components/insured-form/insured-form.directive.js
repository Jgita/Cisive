app.directive('insuredForm', [
    '$state',
    '$uibModal',
    '$http',
    '$q',
    '$rootScope',
    '$filter',
    'WizardHandler',
    '$timeout',
    'toastr',
    'globalService',
    'WizardService',
    'CONSTANTS',
    function ($state, $uibModal, $http, $q, $rootScope, $filter, WizardHandler, $timeout, toastr, globalService, WizardService, CONSTANTS) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/insured-form/insured-form.view.html',
            link: function ($scope, $elem, $attr) {
                $scope.minlength = 14;
                $scope.maxlength = 14;
                $scope.otherUnknownCompanyCode = 'OTHER/UNKNOWN';
                $scope.displayAutoNumber = false;
                gPageNumber = 1;

                $scope.insuredSubmit = function () {
                    angular
                        .forEach($scope.insuredForm.$error.required, function (field) {
                            toastr.error(CONSTANTS.requiredFields);
                            field.$setDirty();
                        });
                };

                $scope.showMessage = function (input) {
                    if (input !== undefined && input.$error !== undefined) {
                        var show = $scope.insuredForm.$submitted && input.$error.required;
                        return show;
                    }
                };

                $scope.getAuthorizationValue = function (value) {
                    if (value === false) {
                        $scope.insuredInfo.AUTHORIZATION_FORM_NUMBER = '';
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

                            if (profileData.INSURED_CELL_PHONE != null || sessionStorage.userDispalyName != null || profileData.INSURED_FIRST_NAME != null || profileData.INSURED_LAST_NAME != null) {
                                $scope.insuredInfo = {
                                    INSURED_CELL_PHONE: profileData.INSURED_CELL_PHONE,
                                    INSURED_EMAIL: sessionStorage.userDispalyName,
                                    INSURED_FIRST_NAME: profileData.INSURED_FIRST_NAME,
                                    INSURED_LAST_NAME: profileData.INSURED_LAST_NAME
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

                var deferred = $q.defer();

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
                    var stepNo = sessionStorage.wizardStepNo;
                    WizardService.wizardContinue(stepNo, wizardDoneStepStatus);
                    WizardHandler
                        .wizard()
                        .setEditMode(true);
                    WizardHandler
                        .wizard()
                        .goTo(parseInt(sessionStorage.wizardStepNo));
                }

                $scope.date = moment().format("MM-DD-YYYY");
                $scope.time = moment().format("hh:mm a");

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
                        $scope.insuredInfo.INSURED_LANDLINE = '';
                    } else if (type === 'landLine') {
                        $scope.insuredInfo.INSURED_CELL_PHONE = '';
                    }

                };

                $scope.getBool = function (value) {
                    if (value != null && value != undefined) {
                        return !!JSON.parse(String(value).toLowerCase());
                    } else {
                        return '';
                    }
                };

                $scope.getStates = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();
                    $http
                        .get($rootScope.baseUrl + 'user/getState')
                        .then(function onSuccess(response) {
                            $scope.states = response.data;
                            $rootScope.isProcessShow(false);
                            $scope.states = $scope
                                .states
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
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: false});
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

                $scope.carOwnerRelation = function () {
                    $rootScope.isProcessShow(true);
                    var defer = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAuthAPI("GET", "InsuredSummary/RelationToCarOwner", header)
                        .then(function onSuccess(response) {
                            $scope.relToCarOwner = response.data;
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: true});
                        })
                        .catch(function onError(response) {
                            $rootScope.isProcessShow(false);
                            defer.resolve({success: false});
                        });
                };

                $scope.getStates();
                $scope.getAdverseConditions();
                $scope.getInsuranceCompany();
                $scope.carOwnerRelation();

                $scope.DATA = {
                    PAGE: 1,
                    UPDATE: false,
                    INSURED_APPLICATION_ID: 0,
                    USER_NAME: sessionStorage.userDispalyName
                };

                $scope.onLoad = function () {
                   

                    $rootScope.sessionLogout();

                    $rootScope.isProcessShow(true);
                    var deferred = $q.defer();

                    var header = {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.accessToken
                    };

                    globalService
                        .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.DATA, header)
                        .then(function (response) {
                            //      $rootScope.stateCode = response.data.INSURED_STATE_CODE;
                            gPageNumber = 0;
                            $rootScope.isProcessShow(false);

                            response.data.INSURED_STATE_CODE = parseInt(response.data.INSURED_STATE_CODE);
                            $scope.insuredInfo = {
                                INSURED_EMAIL: response.data.INSURED_EMAIL,
                                INSURED_LAST_NAME: response.data.INSURED_LAST_NAME,
                                INSURED_FIRST_NAME: response.data.INSURED_FIRST_NAME,
                                INSURED_MIDDLE_NAME: response.data.INSURED_MIDDLE_NAME,
                                POLICY_NUMBER: response.data.POLICY_NUMBER,
                                IS_COMMERCIAL_VEHICLE: response.data.IS_COMMERCIAL_VEHICLE,
                                IS_FIRST_NAME_ENABLE: response.data.IS_FIRST_NAME_ENABLE,
                                INSURED_ADDRESS: response.data.INSURED_ADDRESS,
                                INSURED_TOWN: response.data.INSURED_TOWN,
                                INSURED_ZIPCODE: response.data.INSURED_ZIPCODE,
                                INSURED_CELL_PHONE: response.data.INSURED_CELL_PHONE,
                                INSURED_LANDLINE: response.data.INSURED_LANDLINE,
                                INSURED_WORK_PHONE: response.data.INSURED_WORK_PHONE,
                                INSURED_EMAIL: response.data.INSURED_EMAIL,
                                ARE_YOU_INSURED: $scope.getBool(response.data.ARE_YOU_INSURED),
                                BROKER_NAME: response.data.BROKER_NAME,
                                IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED: response.data.IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED,
                                AUTHORIZATION_FORM_NUMBER: response.data.AUTHORIZATION_FORM_NUMBER
                            };

                            $scope.insuredInfo.INSURED_STATE_CODE = response.data.INSURED_STATE_CODE;
                            $scope.insuredInfo.ADVERSE_CONDITIONS = response.data.ADVERSE_CONDITIONS;
                            $scope.insuredInfo.INSPECTION_COMPANY_NAME = response.data.INSPECTION_COMPANY_NAME;
                            $scope.insuredInfo.INSURANCE_COMPANY_NAME_OTHER = response.data.INSURANCE_COMPANY_NAME_OTHER;

                            if ($scope.insuredInfo.ARE_YOU_INSURED == false) {

                                $scope.insuredInfo.INSURED_PRINT_LNAME = response.data.INSURED_PRINT_LNAME;
                                $scope.insuredInfo.INSURED_PRINT_FNAME = response.data.INSURED_PRINT_FNAME;
                                $scope.insuredInfo.RELATIONSHIP_TO_CAR_OWNER = response.data.RELATIONSHIP_TO_CAR_OWNER;
                                $scope.insuredInfo.ADDITIONAL_INFO_TOWN = response.data.ADDITIONAL_INFO_TOWN;
                                $scope.insuredInfo.ADDITIONAL_INFO_ZIPCODE = response.data.ADDITIONAL_INFO_ZIPCODE;
                                $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS = response.data.ADDITIONAL_INFO_ADDRESS;
                                $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS_TWO = response.data.ADDITIONAL_INFO_ADDRESS_TWO;
                                $scope.insuredInfo.ADDITIONAL_INFO_STATE = response.data.ADDITIONAL_INFO_STATE;
                            }

                            if ($scope.insuredInfo.ARE_YOU_INSURED) {

                                $scope.hideInfo = false;
                            } else {

                                $scope.hideInfo = true;
                                $scope.insuredInfo.INSURED_PRINT_LNAME = response.data.INSURED_PRINT_LNAME;
                                $scope.insuredInfo.INSURED_PRINT_FNAME = response.data.INSURED_PRINT_FNAME;
                                $scope.insuredInfo.RELATIONSHIP_TO_CAR_OWNER = response.data.RELATIONSHIP_TO_CAR_OWNER;
                                $scope.insuredInfo.ADDITIONAL_INFO_TOWN = response.data.ADDITIONAL_INFO_TOWN;
                                $scope.insuredInfo.ADDITIONAL_INFO_ZIPCODE = response.data.ADDITIONAL_INFO_ZIPCODE;
                                $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS = response.data.ADDITIONAL_INFO_ADDRESS;
                                $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS_TWO = response.data.ADDITIONAL_INFO_ADDRESS_TWO;
                                $scope.insuredInfo.ADDITIONAL_INFO_STATE = response.data.ADDITIONAL_INFO_STATE;
                            }

                            if (response.data.INSURED_CELL_PHONE != null) {
                                var formatCellPhone = response.data.INSURED_CELL_PHONE;

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

                            if (response.data.INSURED_LANDLINE != null) {

                                var formatLandPhone = response.data.INSURED_LANDLINE;

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

                            if (response.data.INSURED_WORK_PHONE != null) {
                                var formatWorkPhone = response.data.INSURED_WORK_PHONE;
                                //  $scope.insuredInfo.INSURED_WORK_PHONE = $filter('tel')(formatWorkPhone);
                                $scope.insuredInfo.INSURED_WORK_PHONE = formatWorkPhone;
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

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured' && sessionStorage.formId != null && sessionStorage.formId != undefined) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.formId;
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector' && sessionStorage.clientID != null) {
                    $scope.DATA.INSURED_APPLICATION_ID = sessionStorage.clientID;
                    $scope.onLoad();
                }

                if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                    if ($rootScope.CellPhone != null || sessionStorage.userDispalyName != null || $rootScope.FirstNameToDispaly != null || $rootScope.LastNameToDispaly != null) {
                        $scope.insuredInfo = {

                            INSURED_CELL_PHONE: $rootScope.CellPhone,
                            INSURED_EMAIL: sessionStorage.userDispalyName,
                            INSURED_FIRST_NAME: $rootScope.FirstNameToDispaly,
                            INSURED_LAST_NAME: $rootScope.LastNameToDispaly

                        };
                    }
                    $scope.isRequired = false;
                } else {
                    $scope.isRequired = true;
                }

                $scope.goNext = function (insuredInfo, pageNo, $event) {
                    // angular     .element('#vin')     .trigger('focus');
                   

                    if (insuredInfo.INSURED_CELL_PHONE) {
                        insuredInfo.INSURED_CELL_PHONE = insuredInfo
                            .INSURED_CELL_PHONE
                            .replace(/[^0-9]/g, '');
                    }
                    if (insuredInfo.INSURED_LANDLINE) {
                        insuredInfo.INSURED_LANDLINE = insuredInfo
                            .INSURED_LANDLINE
                            .replace(/[^0-9]/g, '');
                    }
                    if (insuredInfo.INSURED_WORK_PHONE) {
                        insuredInfo.INSURED_WORK_PHONE = insuredInfo
                            .INSURED_WORK_PHONE
                            .replace(/[^0-9]/g, '');
                    }

                    $rootScope.sessionLogout();
                    if ($scope.insuredForm.$invalid) {
                        $scope.insuredForm.$submitted = true;
                    } else {
                        $scope.insuredForm.$submitted = false;
                    }
                    if ($scope.insuredForm.$submitted == false) {
                        $rootScope.isProcessShow(true);
                        //    $rootScope.stateCode = insuredInfo.INSURED_STATE_CODE;
                        var deferred = $q.defer();

                        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            $scope.insuredInfoData = {
                                ADVERSE_CONDITIONS: insuredInfo.ADVERSE_CONDITIONS,
                                INSPECTION_COMPANY_NAME: insuredInfo.INSPECTION_COMPANY_NAME,
                                INSURANCE_COMPANY_NAME_OTHER: insuredInfo.INSURANCE_COMPANY_NAME_OTHER,
                                POLICY_NUMBER: insuredInfo.POLICY_NUMBER,
                                IS_COMMERCIAL_VEHICLE: insuredInfo.IS_COMMERCIAL_VEHICLE,
                                IS_FIRST_NAME_ENABLE: insuredInfo.IS_FIRST_NAME_ENABLE,
                                INSURED_LAST_NAME: insuredInfo.INSURED_LAST_NAME,
                                INSURED_FIRST_NAME: insuredInfo.INSURED_FIRST_NAME,
                                INSURED_MIDDLE_NAME: insuredInfo.INSURED_MIDDLE_NAME,
                                INSURED_ADDRESS: insuredInfo.INSURED_ADDRESS,
                                INSURED_TOWN: insuredInfo.INSURED_TOWN,
                                INSURED_STATE_CODE: insuredInfo.INSURED_STATE_CODE,
                                INSURED_ZIPCODE: insuredInfo.INSURED_ZIPCODE,
                                INSURED_CELL_PHONE: insuredInfo.INSURED_CELL_PHONE,
                                INSURED_LANDLINE: insuredInfo.INSURED_LANDLINE,
                                INSURED_WORK_PHONE: insuredInfo.INSURED_WORK_PHONE,
                                INSURED_EMAIL: insuredInfo.INSURED_EMAIL,
                                ARE_YOU_INSURED: $scope.getBool(insuredInfo.ARE_YOU_INSURED),
                                BROKER_NAME: insuredInfo.BROKER_NAME,
                                IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED: $scope.getBool(insuredInfo.IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED),
                                AUTHORIZATION_FORM_NUMBER: insuredInfo.AUTHORIZATION_FORM_NUMBER,
                                PAGE: 1,
                                INSURED_APPLICATION_ID: 0,
                                UPDATE: true,
                                SITE_ID: sessionStorage.siteId,
                                USER_NAME: sessionStorage.userDispalyName,
                                RANDOM_NUMBER: sessionStorage.randomNumber
                            };
                            //     $rootScope.stateCode = $scope.insuredInfoData.INSURED_STATE_CODE;

                            if (sessionStorage.clientID != null) {
                                $scope.insuredInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID;
                            }

                            if ($scope.insuredInfoData.ARE_YOU_INSURED == true) {

                                $scope.insuredInfoData.INSURED_PRINT_LNAME = "";
                                $scope.insuredInfoData.INSURED_PRINT_FNAME = "";
                                $scope.insuredInfoData.RELATIONSHIP_TO_CAR_OWNER = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_TOWN = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ZIPCODE = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS_TWO = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_STATE = "";
                            } else {
                                $scope.insuredInfoData.INSURED_PRINT_LNAME = insuredInfo.INSURED_PRINT_LNAME;
                                $scope.insuredInfoData.INSURED_PRINT_FNAME = insuredInfo.INSURED_PRINT_FNAME;
                                $scope.insuredInfoData.RELATIONSHIP_TO_CAR_OWNER = insuredInfo.RELATIONSHIP_TO_CAR_OWNER;
                                $scope.insuredInfoData.ADDITIONAL_INFO_TOWN = insuredInfo.ADDITIONAL_INFO_TOWN;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ZIPCODE = insuredInfo.ADDITIONAL_INFO_ZIPCODE;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS = insuredInfo.ADDITIONAL_INFO_ADDRESS;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS_TWO = insuredInfo.ADDITIONAL_INFO_ADDRESS_TWO;
                                $scope.insuredInfoData.ADDITIONAL_INFO_STATE = insuredInfo.ADDITIONAL_INFO_STATE;
                            }

                            if ($scope.showMobile) {
                                $scope.insuredInfoData.INSURED_LANDLINE = '';
                            } else if ($scope.showLandline) {
                                $scope.insuredInfoData.INSURED_CELL_PHONE = '';
                            }

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.insuredInfoData, header)
                                .then(function (response) {
                                    gPageNumber = 0;
                                    sessionStorage.clientID = response.data;
                                    $rootScope.isProcessShow(false);
                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();

                                    WizardService.setProgressLine(3, forward = false);

                                    if (sessionStorage.status === 'pending') {
                                        $rootScope.$broadcast('callInspectSummary', true);
                                    }

                                    $timeout(function () {
                                        $rootScope.$broadcast('callForOnLoad', true);
                                    }, 200);

                                    deferred.resolve({success: true});
                                }, function (error) {

                                    $rootScope.isProcessShow(false);
                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    deferred.resolve({success: false});
                                });
                        } else {
                            var header = {
                                'Content-Type': 'application/json',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            };

                            $scope.insuredInfoData = {
                                ADVERSE_CONDITIONS: insuredInfo.ADVERSE_CONDITIONS,
                                INSPECTION_COMPANY_NAME: insuredInfo.INSPECTION_COMPANY_NAME,
                                INSURANCE_COMPANY_NAME_OTHER: insuredInfo.INSURANCE_COMPANY_NAME_OTHER,
                                POLICY_NUMBER: insuredInfo.POLICY_NUMBER,
                                IS_COMMERCIAL_VEHICLE: insuredInfo.IS_COMMERCIAL_VEHICLE,
                                IS_FIRST_NAME_ENABLE: insuredInfo.IS_FIRST_NAME_ENABLE,
                                INSURED_LAST_NAME: insuredInfo.INSURED_LAST_NAME,
                                INSURED_FIRST_NAME: insuredInfo.INSURED_FIRST_NAME,
                                INSURED_ADDRESS: insuredInfo.INSURED_ADDRESS,
                                INSURED_TOWN: insuredInfo.INSURED_TOWN,
                                INSURED_STATE_CODE: insuredInfo.INSURED_STATE_CODE,
                                INSURED_ZIPCODE: insuredInfo.INSURED_ZIPCODE,
                                INSURED_CELL_PHONE: insuredInfo.INSURED_CELL_PHONE,
                                INSURED_LANDLINE: insuredInfo.INSURED_LANDLINE,
                                INSURED_MIDDLE_NAME: insuredInfo.INSURED_MIDDLE_NAME,
                                INSURED_WORK_PHONE: insuredInfo.INSURED_WORK_PHONE,
                                INSURED_EMAIL: insuredInfo.INSURED_EMAIL,
                                ARE_YOU_INSURED: $scope.getBool(insuredInfo.ARE_YOU_INSURED),
                                BROKER_NAME: insuredInfo.BROKER_NAME,
                                IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED: $scope.getBool(insuredInfo.IS_COMMERCIAL_AUTHORIZATION_FORM_SUPPLIED_BY_INSURED),
                                AUTHORIZATION_FORM_NUMBER: insuredInfo.AUTHORIZATION_FORM_NUMBER,
                                PAGE: 1,
                                INSURED_APPLICATION_ID: 0,
                                UPDATE: true,
                                USER_NAME: sessionStorage.userDispalyName,
                                RANDOM_NUMBER: sessionStorage.randomNumber
                            };

                            //     $rootScope.stateCode = $scope.insuredInfoData.INSURED_STATE_CODE;
                            if (sessionStorage.clientID != null) {
                                $scope.insuredInfoData.INSURED_APPLICATION_ID = sessionStorage.clientID;
                            } else if (sessionStorage.formId != null) {
                                $scope.insuredInfoData.INSURED_APPLICATION_ID = sessionStorage.formId;
                            }

                            if ($scope.insuredInfoData.ARE_YOU_INSURED == true) {

                                $scope.insuredInfoData.INSURED_PRINT_LNAME = "";
                                $scope.insuredInfoData.INSURED_PRINT_FNAME = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_TOWN = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ZIPCODE = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS_TWO = "";
                                $scope.insuredInfoData.ADDITIONAL_INFO_STATE = "";
                                $scope.insuredInfoData.RELATIONSHIP_TO_CAR_OWNER = "";
                            } else {
                                $scope.insuredInfoData.INSURED_PRINT_LNAME = insuredInfo.INSURED_PRINT_LNAME;
                                $scope.insuredInfoData.INSURED_PRINT_FNAME = insuredInfo.INSURED_PRINT_FNAME;
                                $scope.insuredInfoData.RELATIONSHIP_TO_CAR_OWNER = insuredInfo.RELATIONSHIP_TO_CAR_OWNER;
                                $scope.insuredInfoData.ADDITIONAL_INFO_TOWN = insuredInfo.ADDITIONAL_INFO_TOWN;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ZIPCODE = insuredInfo.ADDITIONAL_INFO_ZIPCODE;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS = insuredInfo.ADDITIONAL_INFO_ADDRESS;
                                $scope.insuredInfoData.ADDITIONAL_INFO_ADDRESS_TWO = insuredInfo.ADDITIONAL_INFO_ADDRESS_TWO;
                                $scope.insuredInfoData.ADDITIONAL_INFO_STATE = insuredInfo.ADDITIONAL_INFO_STATE;
                            }

                            if ($scope.showMobile) {
                                $scope.insuredInfoData.INSURED_LANDLINE = '';
                            } else if ($scope.showLandline) {
                                $scope.insuredInfoData.INSURED_CELL_PHONE = '';
                            }

                            globalService
                                .globalServiceAPI("POST", "InsuredSummay/InsuredData", $scope.insuredInfoData, header)
                                .then(function (response) {
                                    gPageNumber = 0;
                                    sessionStorage.clientID = response.data;

                                    $rootScope.isProcessShow(false);
                                    toastr.success(CONSTANTS.changesSuccess, {timeOut: $rootScope.toastrTimeThreeSec});
                                    WizardHandler
                                        .wizard()
                                        .next();
                                    WizardService.setProgressLine(3, forward = false);

                                    if (sessionStorage.status === 'pending') {
                                        $rootScope.$broadcast('callInspectSummary', true);
                                    }

                                    $timeout(function () {
                                        $rootScope.$broadcast('callForOnLoad', true);
                                    }, 200);

                                    deferred.resolve({success: true});
                                }, function () {

                                    $rootScope.isProcessShow(false);
                                    toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                                    deferred.resolve({success: false});
                                });
                        }

                        deferred.resolve({success: true});
                    }
                };

                $scope.changeMode = function () {
                    $scope.hideInfo = true;

                };

                $scope.HideMode = function () {
                    $scope.hideInfo = false;
                    $scope.insuredInfo.INSURED_PRINT_LNAME = "";
                    $scope.insuredInfo.INSURED_PRINT_FNAME = "";
                    $scope.insuredInfo.ADDITIONAL_INFO_TOWN = "";
                    $scope.insuredInfo.ADDITIONAL_INFO_ZIPCODE = "";
                    $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS = "";
                    $scope.insuredInfo.ADDITIONAL_INFO_ADDRESS_TWO = "";
                    $scope.insuredInfo.ADDITIONAL_INFO_STATE = "";
                    $scope.insuredInfo.RELATIONSHIP_TO_CAR_OWNER = "";
                };
            }
        };
    }
]);