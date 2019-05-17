app.controller('windshieldUploadPhotoController', [
    '$scope',
    '$timeout',
    '$http',
    '$q',
    'globalService',
    'FileUploader',
    '$uibModal',
    'toastr',
    '$httpParamSerializerJQLike',
    '$state',
    '$css',
    '$rootScope',
    'CONSTANTS',
    '$window',
    function ($scope, $timeout, $http, $q, globalService, FileUploader, $uibModal, toastr, $httpParamSerializerJQLike, $state, $css, $rootScope, CONSTANTS, $window) {

        $css.bind({
            href: 'rest/app/client/components/uploadPhoto/uploadPhoto.css'
        }, $scope);

        // photos used to set flag to check status of all
        $scope.delete = function (index, photoType) {

            if (photoType == 'fullPhoto') {
                if (index > -1) {
                    $rootScope
                        .winPhotosUploadedByUser
                        .fullPhoto
                        .splice(index, 1);
                    $rootScope.$broadcast('winDeleteFullDamagePhoto', true);
                }
            }

            if (photoType == 'damage') {
                if (index > -1) {
                    $rootScope
                        .winPhotosUploadedByUser
                        .damage
                        .splice(index, 1);
                    $rootScope.$broadcast('winDeleteDamagePhoto', true);
                }
            }

        }

        $scope.$on('confirmationCall', function (event, result) {
            $scope.onLoadBool = result;
            if ($scope.onLoadBool === true) {
                    uploadPhoto();
            }
        });

        $scope.photoDisableStatus = false;

        $scope.confirmAnduploadAllPhotos = function () {
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
                            if ($rootScope.winPhotosUploadedByUser.fullPhoto.length <= 1) {

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
                                            return 'The Full Windshield and/or VIN Plate on Dashboard photo is missing. Please selec' +
                                                't missing photo(s) to continue.';
                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if ($rootScope.winPhotosUploadedByUser.damage.length == 0) {

                                $uibModal
                                    .open({
                                        backdrop: 'static',
                                        backdropClick: false,
                                        dialogFade: false,
                                        keyboard: false,
                                        size: 'md',
                                        templateUrl: 'rest/app/client/components/confirmation-model/confirmation-model.view.html',
                                        controller: 'confirmationModelController'
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else {
                                $uibModal
                                    .open({
                                        backdrop: 'static',
                                        backdropClick: false,
                                        dialogFade: false,
                                        keyboard: false,
                                        size: 'md',
                                        templateUrl: 'rest/app/client/components/editUploadedPhoto-model/editUploadedPhoto-model.view.' +
                                                'html',
                                        controller: 'editUploadedPhotoModelController'
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            };
                        };
                    }, function () {
                        $rootScope.isProcessShow(false);
                        toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                    });
            };

        };

        function uploadPhoto() {
            $rootScope.isProcessShow(true);
            const winInsurePhotoPromis = new Promise(function (resolve, reject) {
                var fullPhotoPromis = new Promise(function (fresolve, freject) {
                    if ($rootScope.winPhotosUploadedByUser.fullPhoto.length != 0) {
                        for (var i = 0; i < $rootScope.winPhotosUploadedByUser.fullPhoto.length; i++) {
                            const photoNameLength = $rootScope
                                .winPhotosUploadedByUser
                                .fullPhoto[i]
                                .WIN_PHOTO_NAME
                                .split('.')
                                .length;
                            $rootScope.winPhotosUploadedByUser.fullPhoto[i].WIN_PHOTO_NAME = 'Full Windshield_' + i + '.' + $rootScope
                                .winPhotosUploadedByUser
                                .fullPhoto[i]
                                .WIN_PHOTO_NAME
                                .split('.')[photoNameLength - 1];
                            $http({
                                url: $rootScope.baseUrl + 'user/SaveImage',
                                method: 'POST',
                                data: $httpParamSerializerJQLike($rootScope.winPhotosUploadedByUser.fullPhoto[i]),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'bearer ' + sessionStorage.accessToken
                                    }
                                })
                                .then(function (response) {
                                    $rootScope.isProcessShow(false);
                                    if (response.data.StatusCode == 200) {
                                        $scope.photoDisableStatus = true;
                                        fresolve(true);
                                    } else if (response.data.StatusCode == 400) {
                                        $scope.photoDisableStatus = false;
                                        toastr.error(CONSTANTS.maxWinFullPhotosLimit, {timeOut: $rootScope.toastrTimeThreeSec});
                                        freject(response);
                                        reject(response);
                                    } else if (response.data.StatusCode == 417) {
                                        $scope.photoDisableStatus = false;
                                        freject(response);
                                        reject(response);
                                    } else {
                                        $scope.photoDisableStatus = false;
                                        freject(response);
                                        reject(response);
                                    }
                                }, function (error) {
                                    $rootScope.isProcessShow(false);
                                    $scope.photoDisableStatus = false;
                                    freject(error);
                                    reject(error);
                                });
                        }

                    }
                });

                fullPhotoPromis.then(function (response) {
                    if ($rootScope.winPhotosUploadedByUser.damage.length != 0) {
                        for (var i = 0; i < $rootScope.winPhotosUploadedByUser.damage.length; i++) {
                            const damagePhotoNameLength = $rootScope
                                .winPhotosUploadedByUser
                                .damage[i]
                                .WIN_PHOTO_NAME
                                .split('.')
                                .length;
                            $rootScope.winPhotosUploadedByUser.damage[i].WIN_PHOTO_NAME = 'Damage Windshield_' + i + '.' + $rootScope
                                .winPhotosUploadedByUser
                                .damage[i]
                                .WIN_PHOTO_NAME
                                .split('.')[damagePhotoNameLength - 1];
                            $http({
                                url: $rootScope.baseUrl + 'user/SaveImage',
                                method: 'POST',
                                data: $httpParamSerializerJQLike($rootScope.winPhotosUploadedByUser.damage[i]),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'bearer ' + sessionStorage.accessToken
                                    }
                                })
                                .then(function (response) {
                                    $rootScope.isProcessShow(false);
                                    if (response.data.StatusCode == 200) {
                                        $scope.photoDisableStatus = true;
                                        resolve(true);
                                    } else if (response.data.StatusCode == 400) {
                                        $scope.photoDisableStatus = false;
                                        toastr.error(CONSTANTS.maxWinFullPhotosLimit, {timeOut: $rootScope.toastrTimeThreeSec});
                                        reject(true);
                                    } else if (response.data.StatusCode == 417) {
                                        $scope.photoDisableStatus = false;
                                        reject(response);
                                    } else {
                                        $scope.photoDisableStatus = false;
                                        reject(response);
                                    }
                                }, function (error) {
                                    $rootScope.isProcessShow(false);
                                    $scope.photoDisableStatus = false;
                                    reject(error);
                                });
                        }

                    } else {
                        resolve(true);
                    }
                })

            });

            winInsurePhotoPromis.then(function (response) {
                $rootScope.isProcessShow(false);
                toastr.success(CONSTANTS.photosUploaded, {timeOut: $rootScope.toastrTimeThreeSec})
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
            }, function (error) {
                $rootScope.isProcessShow(false);
                if (error.data.StatusCode == 417) {
                    toastr.warning(CONSTANTS.winInspectionFlorida, {timeOut: $rootScope.toastrTimeThreeSec});
                } else {
                    toastr.error(CONSTANTS.photoNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                }
            })
        }

        $scope.photoTab = {
            'fullWindshieldPhoto': {
                id: '1',
                title: 'Full Windshield Photo',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.WindshieldUploadPhoto.fullPhoto'
            },
            'damagePhoto': {
                id: '3',
                title: 'Windshield Damage Photo(s)',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.WindshieldUploadPhoto.damagePhoto'
            }
        };

        $scope.photoViewModal = function (item) {

            $uibModal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'rest/app/client/components/PhotoView-model/PhotoView-model.view.html',
                controller: 'PhotoViewModelController',

                resolve: {
                    items: function () {
                        return item;
                    }
                }
                })
                .result
                .then(function (response) {}, function () {});
        };

    }
])