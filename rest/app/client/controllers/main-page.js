app.controller('main-page', [
    '$scope',
    '$state',
    '$rootScope',
    'toastr',
    '$window',
    '$css',
    '$timeout',
    'WizardHandler',
    'WizardService',
    '$q',
    '$http',
    '$location',
    function ($scope, $state, $rootScope, toastr, $window, $css, $timeout, WizardHandler, WizardService, $q, $http, $location) {

        $scope.activeTabIndex = 0;
        $rootScope.wizardWelcomeDropDown = false;
        angular
            .element('.mytabsclass')
            .each(function () {
                var ar = this.id;
                angular
                    .element('#' + ar)
                    .tabs();
            });

        $scope.showRoute = true;

        $scope.Isdisable = sessionStorage.IsDevice;

        $scope.$on('FAQ', function (event, result) {
            if (result) {
                $scope.showRoute = false;
            }
        })

        $scope.$on('InspectorFAQ', function (event, result) {
            if (result) {
                $scope.showRoute = false;
            }
        })

        if (sessionStorage.wizardStepNo == 1) {
            $rootScope.formStateValidation = {
                pageOne: true,
                pageTwo: false,
                pageThree: false,
                pageFour: false,
                pageFive: false
            }
        } else if (sessionStorage.wizardStepNo == 2) {
            $rootScope.formStateValidation = {
                pageOne: true,
                pageTwo: true,
                pageThree: false,
                pageFour: false,
                pageFive: false
            }

        } else if (sessionStorage.wizardStepNo == 3) {
            $rootScope.formStateValidation = {
                pageOne: true,
                pageTwo: true,
                pageThree: true,
                pageFour: false,
                pageFive: false
            }

        } else if (sessionStorage.wizardStepNo == 4) {
            $rootScope.formStateValidation = {
                pageOne: true,
                pageTwo: true,
                pageThree: true,
                pageFour: true,
                pageFive: false
            }

        } else if (sessionStorage.wizardStepNo == 5) {
            $rootScope.formStateValidation = {
                pageOne: true,
                pageTwo: true,
                pageThree: true,
                pageFour: true,
                pageFive: true
            }

        }

        if (sessionStorage.wizardStepNo == 1) {
            $rootScope.winFormStateValidation = {
                pageOne: true,
                pageTwo: false

            }
        } else if (sessionStorage.wizardStepNo == 2) {
            $rootScope.winFormStateValidation = {
                pageOne: true,
                pageTwo: true

            }
        }

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
            $scope.userTypeValue = true;
        } else {
            $scope.userTypeValue = false;
        }

        function setProgressLine(state, forward) {
            WizardService.setProgressLine(state, forward);
        }

        if (sessionStorage.wizardStepNo != null) {

            $scope.stepNo = parseInt(sessionStorage.wizardStepNo);
            $timeout(function () {
                $scope.previousWizardStep;
                $timeout(function () {
                    for (i = $scope.stepNo; i < 6; i++) {
                        angular.element($('li.f1-step:eq(' + i + ')').removeClass('done'));
                    }

                }, 10)

                //set Style to Progress line
                switch ($scope.stepNo) {
                    case 2:
                        setProgressLine(5);
                        break;
                    case 3:

                        setProgressLine(7, true);
                        break;
                    case 4:
                        setProgressLine(9, true);
                        break;
                    case 5:
                        setProgressLine(11, true);
                        break;
                }

            }, 50);

        }

        $scope.onLoad = function () {

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

                $scope.profileData = response.data["0"];
                $rootScope.FirstNameToDispaly = $scope.profileData.INSURED_FIRST_NAME;
                $rootScope.LastNameToDispaly = $scope.profileData.INSURED_LAST_NAME;
                $rootScope.CellPhone = $scope.profileData.INSURED_CELL_PHONE;

                deferred.resolve({success: true});
                return true,
                response;
            }, function (response) {

                deferred.resolve({success: false});
                return false;
            });
            deferred.resolve({success: true});
        }

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.userType = 'Insured';
            $scope.USERID = sessionStorage.userId;
            $scope.onLoad();
        } else {
            $scope.userType = 'Inspector';
            $scope.userEmail = sessionStorage.userDispalyName;
        }

        $css.bind({
            href: 'rest/app/client/components/header-content/header-content.css'
        }, $scope);

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.profileRoute = 'insuredPage.profile';

            $scope.headerTabs = {

                'Dashboard': {
                    id: 'item1',
                    title: 'Dashboard',
                    route: 'insuredPage.dashboardInsured'

                }
            }
        } else {

            $scope.headerTabs = {

                'Dashboard': {
                    id: 'item1',
                    title: 'Dashboard',
                    route: 'inspectionPage.dashboard'

                }
            }

        }

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $rootScope.wizardWelcomeDropDown = true;
            $scope.welcomeDropDown = {
                'myProfile': {
                    id: 'item1',
                    title: 'My Profile',
                    faClass: 'fa-user',
                    route: $scope.profileRoute
                },
                'changePassword': {
                    id: 'item2',
                    title: 'Change Password',
                    faClass: 'fa-lock',
                    route: 'resetPassword'
                },
                'Logout': {
                    id: 'item3',
                    title: 'Logout',
                    faClass: 'fa-power-off',
                    route: 'login'
                }
            }
        } else {

            $scope.welcomeDropDown = {
                'Logout': {
                    id: 'item3',
                    title: 'Logout',
                    faClass: 'fa-power-off',
                    route: 'login'
                }
            }

        }

        $scope.navigateFAQ = function (itemType) {
            if (itemType.toLowerCase() == 'inspector') {
                if (sessionStorage.InspectionType && sessionStorage.InspectionType.toLowerCase() == 'windshield') {
                    var url = $state.href('inspectionPage.FAQ.windshieldFAQ');
                    window.open(url, '_blank');

                } else {
                    var url = $state.href('inspectionPage.FAQ.preInsuranceFAQ');
                    window.open(url, '_blank');

                }
            } else {
                if (sessionStorage.InspectionType && sessionStorage.InspectionType.toLowerCase() == 'windshield') {
                    var url = $state.href('insuredPage.FAQ.windshieldFAQ');
                    window.open(url, '_blank');

                } else {
                    var url = $state.href('insuredPage.FAQ.preInsuranceFAQ');
                    window.open(url, '_blank');

                }

            }

        }

        $scope.onSubmit = function (title) {
            $rootScope.logout(title);
        }

        $scope.onSubmitClear = function (title) {
            $rootScope.logout(title);
        }

    }
])