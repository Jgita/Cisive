app.directive('headerContent', [
    '$css',
    'toastr',
    '$state',
    '$rootScope',
    '$q',
    '$http',
    function ($css, toastr, $state, $rootScope, $q, $http) {
        return {
            restrict: "E",
            templateUrl: 'rest/app/client/components/header-content/header-content.html',
            link: function ($scope, $elem, $attr) {
                $scope.showRoute = true;

                $scope.Isdisable = sessionStorage.IsDevice;
              
                $scope.$on('InspectorFAQ', function (event, result) {
                    if (result) {
                        $scope.showRoute = false;
                    }
                })

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
                        $rootScope.stateCode = $scope.profileData.STATE_CODE.trim();
                      
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
                    var QCDisable = false;
                    $scope.onLoad();
                } else {
                    $scope.userType = 'Inspector';
                    $scope.userEmail = sessionStorage.userDispalyName;
                     var siteId = sessionStorage.siteId;
                     var siteIdFirstTwo = siteId.substring(0, 2);
                     $rootScope.stateCode = siteIdFirstTwo;
                 
                    if (sessionStorage.IsAllowPhotoSelect == 'false') {
                        var QCDisable = true;
                    } else {
                        var QCDisable = false;
                    }
                }

                $css.bind({
                    href: 'rest/app/client/components/header-content/header-content.css'
                }, $scope);

                $scope.newInspection = {
                    'Inspection': {
                        id: 'item2',
                        title: 'Pre-Inspection',
                        disabledValue: true,
                        route: 'inspectionPage.uploadPhotoInspector.frontAndDriverSidePhotos'
                    },

                    'Windshield': {
                        id: 'item3',
                        title: 'Windshield',
                        disabledValue: sessionStorage.IsWindEnable,
                        route: 'inspectionPage.WindshieldUploadPhotoInspector.damagePhoto'
                    }

                }

                $scope.headerTabs = {
                    'Inspection': {
                        id: 'item1',
                        title: 'New Inspection',
                        disabledValue: false,
                        route: 'inspectionPage.newInspection'
                    },
                    'Dashboard': {
                        id: 'item2',
                        title: 'Dashboard',
                        disabledValue: false,
                        route: 'inspectionPage.dashboard'
                    },

                    'QC': {
                        id: 'item4',
                        title: 'QC Re-take',
                        disabledValue: QCDisable,
                        route: 'inspectionPage.QRRetake'
                    }
                }

                $scope.navigateFAQ = function () {

                    if (sessionStorage.InspectionType && sessionStorage.InspectionType.toLowerCase() == 'windshield') {
                        var url = $state.href('inspectionPage.FAQ.windshieldFAQ');
                        window.open(url, '_blank');

                    } else {
                        var url = $state.href('inspectionPage.FAQ.preInsuranceFAQ');
                        window.open(url, '_blank');

                    }
                }

                $scope.welcomeDropDown = {
                    'Logout': {
                        id: 'item3',
                        title: 'Logout',
                        faClass: 'fa-power-off',
                        route: 'login'
                    }
                }

                $scope.onSubmit = function (title) {
                    $rootScope.logout(title);
                }

                $scope.onSubmitClear = function (title) {
                    $rootScope.logout(title);
                }

            }

        }
    }
])