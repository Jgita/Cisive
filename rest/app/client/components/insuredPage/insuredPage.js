app.controller('insuredPageController', [
    '$scope',
    '$state',
    '$css',
    'toastr',
    '$rootScope',
    '$q',
    '$http',
    '$window',
    function ($scope, $state, $css, toastr, $rootScope, $q, $http, $window) {

        $css.bind({
            href: 'rest/app/client/components/header-content/header-content.css'
        }, $scope);
        $scope.showRoute = true;

        $scope.Isdisable = sessionStorage.IsDevice;

        $scope.$on('FAQ', function (event, result) {
            if (result) {
                $scope.showRoute = false;
            }
        });

        $scope.newInspection = {

            'Inspection': {
                id: 'item2',
                title: 'Pre-Inspection',
                disabledValue: true,
                route: 'insuredPage.UploadPhoto.frontAndDriverSidePhotos'
            },

            'Windshield': {
                id: 'item3',
                title: 'Windshield',
                disabledValue: sessionStorage.IsWindEnable,
                route: 'insuredPage.WindshieldUploadPhoto.damagePhoto'
            }

        };

        $scope.headerTabs = {

            'Inspection': {
                id: 'item2',
                title: 'New Inspection',
                route: 'insuredPage.newInspection'
            },

            'Dashboard': {
                id: 'item1',
                title: 'Dashboard',
                route: 'insuredPage.dashboardInsured'
            }

        };
        $scope.dropDownVisible = false;

        $scope.navigateFAQ = function () {

            if (sessionStorage.InspectionType === 'Windshield') {
                var url = $state.href('insuredPage.FAQ.windshieldFAQ');
                window.open(url, '_blank');

            } else {
                var url = $state.href('insuredPage.FAQ.preInsuranceFAQ');
                window.open(url, '_blank');

            }
        };

        $scope.welcomeDropDown = {
            'myProfile': {
                id: 'item1',
                title: 'My Profile',
                faClass: 'fa-user',
                route: 'insuredPage.profile'
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
        };

        $scope.onSubmit = function (title) {
            $rootScope.logout(title);
        };

        $scope.onSubmitClear = function (title) {
            $rootScope.logout(title);
        };

        $scope.onLoad = function () {

            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: $rootScope.baseUrl + 'user/getuserprofile/' + $scope.USERID,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }
            };
            $http(request).then(function (response) {

                $scope.profileData = response.data["0"];
                $rootScope.FirstNameToDispaly = $scope.profileData.INSURED_FIRST_NAME;
                $rootScope.LastNameToDispaly = $scope.profileData.INSURED_LAST_NAME;
                $rootScope.CellPhone = $scope.profileData.INSURED_CELL_PHONE;
                $rootScope.stateCode = $scope.profileData.STATE_CODE.trim();
                deferred.resolve({success: true});
                return true,
                response;
            }, function (response) {

                deferred.resolve({success: false});
                return false;
            });
            deferred.resolve({success: true});
        };

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $scope.userType = 'Insured';
            $scope.USERID = sessionStorage.userId;
            $scope.onLoad();
        } else {
            $scope.userType = 'Inspector';
            $scope.userEmail = sessionStorage.userDispalyName;
            var siteId = sessionStorage.siteId;
            var siteIdFirstTwo = siteId.substring(0, 2);
            $rootScope.stateCode = siteIdFirstTwo;
        }

        $scope.onEnterInspectionInformation = function () {
            $state.transitionTo('home', {
                'clientId': 'clientId',
                'accessToken': 'accessToken',
                'userType': 'userType',
                'page': 'page',
                'userName': 'userName',
                'siteID': 'siteID',
                'InspectionType': 'InspectionType',
                'randomNumber': 'randomNumber',
                'userId': 'userId',
                'refreshToken': 'refreshToken',
                'siteLocation': 'siteLocation',
                'siteName': 'siteName',
                'IsDevice': 'IsDevice'
            });
        };

    }
]);