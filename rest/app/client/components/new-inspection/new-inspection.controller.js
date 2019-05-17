app.controller('newInspectionController', [
    '$scope',
    '$state',
    '$css',
    '$rootScope',
    'toastr',
    'CONSTANTS',
    '$window',
    '$http',
    '$uibModal',
    function ($scope, $state, $css, $rootScope, toastr, CONSTANTS, $window, $http, $uibModal) {

        $css.bind({
            href: 'rest/app/client/components/new-inspection/new-inspection.css'
        }, $scope);

        $rootScope.remainingDamagePhotoLimit = 15;
        $rootScope.remainingWinFullPhotoLimit = 3;
        $rootScope.remainingWinDamagePhotoLimit = 6;
        $rootScope.isProced = false;

        if ($rootScope.toastrCloseFlag) {
            toastr.clear();
        }

        $rootScope.photosUploadedByUser = {
            rear: null,
            front: null,
            damage: [],
            EPA: null
        };

        $rootScope.winPhotosUploadedByUser = {
            fullPhoto: [],
            damage: []
        };

        $rootScope.frontPhotosStatus = false;

        delete sessionStorage.QR_Retake;
        delete sessionStorage.randomNumber;
        delete sessionStorage.winReportNumber;
        //  delete sessionStorage.stateCode;
        delete sessionStorage.InspectionType;
        $rootScope.chkboxDisable = false;
        delete $rootScope.uploadPhotoServerError;
        $scope.windEnable = sessionStorage.IsWindEnable;

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {

            $scope.preInsuranceInspection = function () {
                sessionStorage.InspectionType = 'Pre-Inspection';
                $state.transitionTo('insuredPage.UploadPhoto.frontAndDriverSidePhotos');
            };

            $scope.windshieldInspection = function ($event) {
                if (sessionStorage.IsWindEnable == 'false') {
                    toastr.warning(CONSTANTS.winInspectionFlorida, {timeOut: $rootScope.toastrTimeThreeSec});
                    $event.preventDefault();
                    delete sessionStorage.InspectionType;
                } else {
                    sessionStorage.InspectionType = 'Windshield';
                    $state.transitionTo('insuredPage.WindshieldUploadPhoto.fullPhoto');
                }
            };
        } else {

            // var siteId = sessionStorage.siteId; var siteIdFirstTwo = siteId.substring(0,
            // 2);

            $scope.preInsuranceInspection = function () {
                sessionStorage.InspectionType = 'Pre-Inspection';
                //
                // $state.transitionTo('inspectionPage.uploadPhotoInspector.frontAndDriverSidePh
                // o tos');

                if (sessionStorage.IsAllowPhotoSelect == 'false') {
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
                } else {
                    $state.transitionTo('inspectionPage.uploadPhotoInspector.frontAndDriverSidePhotos');
                }
            };

            $scope.windshieldInspection = function ($event) {
                sessionStorage.InspectionType = 'Windshield';
                $state.transitionTo('inspectionPage.WindshieldUploadPhotoInspector.fullPhoto');
            };

        }

        $scope.getNumber = function () {
            $scope.randomDigit = (Math.floor(Math.random() * 9000000) + 3000000);
            sessionStorage.randomNumber = $scope.randomDigit;
        };

        $scope.getNumber();

        function onLoad() {
            var request = {
                method: 'GET',
                url: $rootScope.baseUrl + 'user/validatesession',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }
            };
            $http(request).then(function (response) {}, function (error) {
                if (error.status === 401) {
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
                                return 'It seems server is not responding. Please log in again.';
                            }
                        }
                        })
                        .result
                        .then(function (response) {}, function () {});
                }
            });
        };

        //  To check token authentication
        onLoad();
    }
]);