app.controller('uploadPhotoController', [
    '$scope',
    '$http',
    '$q',
    'globalService',
    '$uibModal',
    'toastr',
    'FileUploader',
    '$httpParamSerializerJQLike',
    '$state',
    '$css',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $http, $q, globalService, $uibModal, toastr, FileUploader, $httpParamSerializerJQLike, $state, $css, $rootScope, CONSTANTS) {

        // Need tio change this with state code with the code return by API
        $scope.StateCode = $rootScope.stateCode;

        if (!$scope.StateCode && sessionStorage.userId) {
            var request = {
                method: 'GET',
                url: $rootScope.baseUrl + 'user/getuserprofile/' + sessionStorage.userId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.accessToken
                }
            };
            $http(request).then(function (response) {
                $scope.StateCode = response
                    .data[0]
                    .STATE_CODE
                    .trim();
            }, function (response) {});
        }
        $css.bind({
            href: 'rest/app/client/components/uploadPhoto/uploadPhoto.css'
        }, $scope);

        $scope.modalSize = 'md';

        $scope.EPAStrickerMissing = function (item) {

            $scope.statusOfEPAStricker = item;
            if (item) {
                $scope.modalSize = 'lg';
            } else {
                $scope.modalSize = 'md';
            }
        }

        $scope.delete = function (index, photoType) {

            if (photoType == 'front') {

                $rootScope.photosUploadedByUser.front = null;
            }
            if (photoType == 'EPA') {
                $rootScope.photosUploadedByUser.EPA = null;
            }
            if (photoType == 'rear') {
                $rootScope.photosUploadedByUser.rear = null;
            }
            if (photoType == 'damage') {
                if (index > -1) {
                    $rootScope
                        .photosUploadedByUser
                        .damage
                        .splice(index, 1);
                    $rootScope.$broadcast('deleteDamagePhoto', true);

                }
            }

        }

        $scope.frontPhotoUploadStatus = false;
        $scope.rearPhotoUploadStatus = false;
        $scope.EPAPhotoUploadStatus = false;
        $scope.infoVisibilityStatus = true;

        $scope.$on('confirmationCall', function (event, result) {
            $scope.onLoadBool = result;
            if ($scope.onLoadBool === true) {
                $scope.uploadPhotos();
            }

        });

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

                            // need to use javascript false statement null and undefined acts as false only
                            // so no need to check twice for null and undefined
                            if (($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) && ($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined) && ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined)) {
                                $uibModal.open({
                                    backdrop: 'static',
                                    backdropClick: false,
                                    dialogFade: false,
                                    keyboard: false,
                                    size: $scope.modalSize,
                                    templateUrl: 'rest/app/client/components/photoMissing-model/photoMissing-model.view.html',
                                    controller: 'photoMissingModelController',
                                    resolve: {
                                        items: function () {
                                            if (($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') && $scope.statusOfEPAStricker) {
                                                return 'Front Passenger Side AND Rear Driver Side photos missing; please select missing ' +
                                                    'photos to continue.<br>EPA Sticker Missing Box checked. Please provide photo of ' +
                                                        'blank doorjamb.'
                                            } else if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The Front and Passenger Side, Rear and Driver Side and EPA photos are missing. P' +
                                                    'lease select missing photo to continue.'
                                            } else if ($scope.statusOfEPAStricker) {
                                                return 'Front Driver Side AND Rear Passenger Side photos missing; please select missing ' +
                                                    'photos to continue.<br>EPA Sticker Missing Box checked. Please provide photo of ' +
                                                        'blank doorjamb.'
                                            } else {
                                                return 'The Front and Driver Side, Rear and Passenger Side and EPA photos are missing. P' +
                                                    'lease select missing photo to continue.';
                                            }

                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if (($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) && ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined)) {

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

                                            if (($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') && $scope.statusOfEPAStricker) {
                                                return 'Front Passenger Side photo missing; please select missing photo to continue.<br>' +
                                                    'EPA Sticker Missing Box checked. Please provide photo of blank doorjamb.'
                                            } else if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The Front and Passanger Side, EPA photos are missing. Please select missing phot' +
                                                    'o to continue.'
                                            } else if ($scope.statusOfEPAStricker) {
                                                return 'Front Driver Side photo missing; please select missing photo to continue.<br>EPA' +
                                                    ' Sticker Missing Box checked. Please provide photo of blank doorjamb.'
                                            } else {
                                                return 'The Front and Driver Side, EPA photos are missing. Please select missing photo t' +
                                                    'o continue.';
                                            }
                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if (($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) && ($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined)) {

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
                                            if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The Front and Passenger Side, Rear and Driver Side photos are missing. Please se' +
                                                    'lect missing photo to continue.';
                                            } else {
                                                return 'The Front and Driver Side, Rear and Passenger Side photos are missing. Please se' +
                                                    'lect missing photo to continue.';
                                            }

                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if (($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined) && ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined)) {

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

                                            if (($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') && $scope.statusOfEPAStricker) {
                                                return 'Rear Driver Side photo missing; please select missing photo to continue.<br>EPA ' +
                                                    'Sticker Missing Box checked. Please provide photo of blank doorjamb.'
                                            } else if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The Rear and Driver Side and EPA photos are missing. Please select missing photo' +
                                                    ' to continue.';
                                            } else if ($scope.statusOfEPAStricker) {
                                                return 'Rear Passenger Side photo missing; please select missing photo to continue.<br>E' +
                                                    'PA Sticker Missing Box checked. Please provide photo of blank doorjamb.'
                                            } else {
                                                return 'The Rear and Passenger Side and EPA photos are missing. Please select missing ph' +
                                                    'oto to continue.';
                                            }
                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if ($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) {

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
                                            if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The Front and Passenger Side photo is missing. Please select missing photo to co' +
                                                    'ntinue.';
                                            } else {
                                                return 'The Front and Driver Side photo is missing. Please select missing photo to conti' +
                                                    'nue.';
                                            }
                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if ($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined) {

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
                                            if ($scope.StateCode == 'MA' || $scope.StateCode == 'massachusetts') {
                                                return 'The  Rear and Driver Side photo is missing. Please select missing photo to conti' +
                                                    'nue.';
                                            } else {
                                                return 'The  Rear and Passenger Side photo is missing. Please select missing photo to co' +
                                                    'ntinue.';
                                            }
                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined) {

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
                                            if ($scope.statusOfEPAStricker) {
                                                return 'EPA Sticker Missing Box Checked. Please provide photo of blank doorjamb.';
                                            } else {
                                                return 'The EPA Sticker is missing. Please select missing photo to continue.';
                                            }

                                        }
                                    }
                                    })
                                    .result
                                    .then(function (response) {}, function () {});
                            } else if ($rootScope.photosUploadedByUser.damage.length == 0) {

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
                            }
                        }
                    }, function () {
                        $rootScope.isProcessShow(false);
                        toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                    });
            }
        }

        $scope.uploadPhotos = function () {
            $rootScope.isProcessShow(true);
            //$scope.buttonLoader = true;
            $rootScope.chkboxDisable = true;
            const insuredPhotoPromis = new Promise(function (resolve, reject) {
                var frontPromis = new Promise(function (fresolve, freject) {
                    $rootScope.isProcessShow(true);
                    if ($rootScope.photosUploadedByUser.front != null && $rootScope.photosUploadedByUser.front != undefined) {
                        $http({
                            url: $rootScope.baseUrl + 'user/SaveImage',
                            method: 'POST',
                            data: $httpParamSerializerJQLike($rootScope.photosUploadedByUser.front),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'bearer ' + sessionStorage.accessToken
                                }
                            })
                            .then(function (response) {
                                $rootScope.isProcessShow(false);
                                if (response.data.StatusCode == 200) {
                                    $scope.frontPhotoUploadStatus = true;
                                    $scope.photoDisableStatus = true;
                                    fresolve(true);
                                } else {
                                    $scope.frontPhotoUploadStatus = false;
                                    $scope.photoDisableStatus = false;
                                    freject(true);
                                    reject(true);
                                }
                            }, function (error) {
                                $rootScope.isProcessShow(false);
                                $scope.photoDisableStatus = false;
                                $scope.frontPhotoUploadStatus = false;
                                freject(true);
                                reject(error);
                            });
                    }
                });
                var rearPromise;
                frontPromis.then(function (response) {
                    $rootScope.isProcessShow(true);
                    rearPromise = new Promise(function (rresolve, rreject) {
                        if ($rootScope.photosUploadedByUser.rear != null && $rootScope.photosUploadedByUser.rear != undefined) {
                            $http({
                                url: $rootScope.baseUrl + 'user/SaveImage',
                                method: 'POST',
                                data: $httpParamSerializerJQLike($rootScope.photosUploadedByUser.rear),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'bearer ' + sessionStorage.accessToken
                                    }
                                })
                                .then(function (response) {
                                    $rootScope.isProcessShow(false);
                                    if (response.data.StatusCode == 200) {
                                        $scope.rearPhotoUploadStatus = true;
                                        $scope.photoDisableStatus = true;
                                        rresolve(true);
                                    } else {
                                        $scope.rearPhotoUploadStatus = false;
                                        $scope.photoDisableStatus = false;
                                        rreject(true);
                                        reject(true);
                                    }
                                }, function (error) {
                                    $rootScope.isProcessShow(false);
                                    $scope.photoDisableStatus = false;
                                    $scope.rearPhotoUploadStatus = false;
                                    rreject(true);
                                    reject(error);
                                });
                        }
                    })
                    var EPAPromise;
                    rearPromise.then(function (response) {
                        $rootScope.isProcessShow(true);
                        EPAPromise = new Promise(function (eresolve, ereject) {
                            if ($rootScope.photosUploadedByUser.EPA != null && $rootScope.photosUploadedByUser.EPA != undefined) {
                                $http({
                                    url: $rootScope.baseUrl + 'user/SaveImage',
                                    method: 'POST',
                                    data: $httpParamSerializerJQLike($rootScope.photosUploadedByUser.EPA),
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                            'Authorization': 'bearer ' + sessionStorage.accessToken
                                        }
                                    })
                                    .then(function (response) {
                                        $rootScope.isProcessShow(false);
                                        if (response.data.StatusCode == 200) {
                                            $scope.EPAPhotoUploadStatus = true;
                                            $scope.photoDisableStatus = true;
                                            eresolve(true);
                                        } else {
                                            $scope.EPAPhotoUploadStatus = false;
                                            $scope.photoDisableStatus = false;
                                            ereject(true);
                                            reject(true);
                                        }
                                    }, function (error) {
                                        $rootScope.isProcessShow(false);
                                        $scope.photoDisableStatus = false;
                                        $scope.EPAPhotoUploadStatus = false;
                                        ereject(true);
                                        reject(error);
                                    });
                            }
                        });
                        EPAPromise.then(function (response) {

                            if ($rootScope.photosUploadedByUser.damage.length != 0) {

                                for (var i = 0; i < $rootScope.photosUploadedByUser.damage.length; i++) {
                                    $http({
                                        url: $rootScope.baseUrl + 'user/SaveImage',
                                        method: 'POST',
                                        data: $httpParamSerializerJQLike($rootScope.photosUploadedByUser.damage[i]),
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Authorization': 'bearer ' + sessionStorage.accessToken
                                            }
                                        })
                                        .then(function (response) {
                                            $rootScope.isProcessShow(false);
                                            if (response.data.StatusCode == 200) {
                                                $scope.photoDisableStatus = true;
                                                $scope.damagePhotoUploadStatus = true;
                                                resolve(true);
                                            } else if (response.data.StatusCode == 400) {
                                                $scope.damagePhotoUploadStatus = false;
                                                $scope.photoDisableStatus = false;
                                                reject(true);
                                                toastr.error(CONSTANTS.maxDamagePhotoLimit, {timeOut: $rootScope.toastrErrorFiveSec})
                                            } else {
                                                $scope.damagePhotoUploadStatus = false;
                                                $scope.photoDisableStatus = false;
                                                reject(true);
                                            }
                                        }, function (error) {
                                            $rootScope.isProcessShow(false);
                                            $scope.photoDisableStatus = false;
                                            $scope.damagePhotoUploadStatus = false;
                                            reject(error);
                                        });
                                }
                            } else {
                                resolve(true);
                            }
                        });
                    });
                });

            });

            insuredPhotoPromis.then(function (response) {
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
                } else {
                    toastr.error(CONSTANTS.photoNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                }
            })
        }

        $scope.photoTab = {
            'frontAndDriverSide': {
                id: '1',
                title: 'Front and Driver Side',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.UploadPhoto.frontAndDriverSidePhotos'
            },
            'rearAndPassengerSide': {
                id: '2',
                title: 'Rear and Passenger Side',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.UploadPhoto.rearAndPassengerSidePhotos'
            },

            'EPA': {
                id: '4',
                title: 'EPA Sticker',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.UploadPhoto.EPAStickerPhotos'
            },

            'damagePhoto': {
                id: '3',
                title: 'Damage Photo(s)',
                disabledValue: $scope.photoDisableStatus,
                route: 'insuredPage.UploadPhoto.damagePhoto'
            }
        }

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
        }

        $rootScope.sessionLogout();
    }
])