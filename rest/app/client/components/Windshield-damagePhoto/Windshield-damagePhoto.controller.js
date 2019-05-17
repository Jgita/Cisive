app.controller('windshieldDamagePhotoController', [
    '$scope',
    '$state',
    '$q',
    'globalService',
    '$uibModal',
    'toastr',
    '$css',
    'FileUploader',
    '$httpParamSerializerJQLike',
    '$http',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $state, $q, globalService, $uibModal, toastr, $css, FileUploader, $httpParamSerializerJQLike, $http, $rootScope, CONSTANTS) {
        $scope.selectedImages = [];
        $scope.damageImageCounter = 0;
        $scope.damageImageCounterDisable = false;

        $scope.progressBar = 0;

        $css.bind({
            href: 'rest/app/client/components/Windshield-damagePhoto/Windshield-damagePhoto.css'
        }, $scope);

        var uploader = $scope.uploader = new FileUploader({});

        $scope.$on('winDeleteDamagePhoto', function (event, result) {
            $scope.onLoadBool = result;
            if ($scope.onLoadBool === true) {
                $rootScope.remainingWinDamagePhotoLimit++;
            }

        });

        $rootScope.winDamagePhotos = null;

        if ($rootScope.winPhotosUploadedByUser.damage.length != 0) {
            $rootScope.winDamagePhotos = $rootScope.winPhotosUploadedByUser.damage;
        }

        // FILTERS
        $scope.uploadStatus = false;
        uploader
            .filters
            .push({
                name: 'imageFilter',
                fn: function (item,
                /*{File|FileLikeObject}*/
                options) {
                    var type = '|' + item
                        .type
                        .slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            });

        uploader
            .filters
            .push({
                name: 'sizeFilter',
                fn: function (item, options) {
                    var maxSize = $rootScope.imageMaxLimitToUpload;
                    //1048576;
                    return parseInt(item.size) < maxSize;
                }
            });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item,
        /*{File|FileLikeObject}*/
        filter,
        options) {
            var imageSize = item.size;
            $scope.imageType = item.type;
            var maxSize = $rootScope.imageMaxLimitToUpload;
            //1048576;
            if (filter.name == 'sizeFilter') {
                if (imageSize > maxSize) {
                    toastr.error(CONSTANTS.maxPhotoUploadSize, {timeOut: $rootScope.toastrTimeThreeSec});
                    $rootScope.sizeLimitWait = true;
                } else {
                    $rootScope.sizeLimitWait = false;
                }
            } else {
                if (item.type != 'image/png' || item.type != 'image/jpeg') {
                    toastr.error(CONSTANTS.invalidFile, {timeOut: $rootScope.toastrErrorFiveSec});
                }
            }

        };

        $scope.move = function () {
            var elem = document.getElementById("myBar");
            var width = 10;
            var id = setInterval(frame, 10);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                } else {
                    width++;
                    elem.style.width = width + '%';
                    elem.innerHTML = width * 1 + '%';
                }
            }
        };
        $scope.photoName = [];
        uploader.onAfterAddingAll = function (addedFileItems) {
            if (addedFileItems.length <= 6) {
                if (addedFileItems.length <= $rootScope.remainingWinDamagePhotoLimit) {
                    $rootScope.remainingWinDamagePhotoLimit = $rootScope.remainingWinDamagePhotoLimit - addedFileItems.length;
                    for (var i = 0; i < addedFileItems.length; i++) {
                        if (addedFileItems[i].file.name.length > 40) {
                            var slicePhotoName = addedFileItems[i]
                                .file
                                .type
                                .split('/');
                            $scope
                                .photoName
                                .push(addedFileItems[i].file.name.slice(0, 40) + '.' + slicePhotoName[1])
                        } else {
                            $scope
                                .photoName
                                .push(addedFileItems[i].file.name);
                        }
                        uploader.onAfterAddingFileChanged(addedFileItems[i], $scope.photoName[i]);
                    }

                } else {
                    toastr.error(CONSTANTS.maxWinDamagePhotos, {timeOut: $rootScope.toastrErrorFiveSec});
                }

            } else {
                toastr.error(CONSTANTS.maxWinDamagePhotos, {timeOut: $rootScope.toastrErrorFiveSec});
            }
        };

        uploader.onAfterAddingFileChanged = function (fileItem, photoName) {
           
            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                sessionStorage.QR_Retake = false;
            }
            $scope.damageImageCounter++;

            // if (fileItem.file.name.length > 40) {     var slicePhotoName = fileItem .file
            //         .type         .split('/');     $scope.photoName = fileItem .file
            // .name         .slice(0, 40) + '.' + slicePhotoName[1]; } else {
            // $scope.photoName = fileItem.file.name; }

            var reader = new FileReader();
            reader.readAsDataURL(fileItem._file);
            reader.onload = function (event) {
                $scope.base64 = event
                    .target
                    .result
                    .substring(event.target.result.indexOf(',') + 1, event.target.result.length);

                $scope.damageForm = {
                    WIN_PHOTO: $scope.base64,
                    WIN_PHOTO_TYPE: "WIN_DAMAGE",
                    WINSHIELD_ID: sessionStorage.clientIdForUploadPhoto,
                    WIN_PHOTO_NAME: photoName,
                    SiteID: sessionStorage.siteId,
                    QR_Retake: sessionStorage.QR_Retake,
                    longitude: null,
                    latitude: null,
                    RANDOM_NUMBER: sessionStorage.randomNumber,
                    WebRequest: true
                };

                $scope
                    .selectedImages
                    .push($scope.damageForm);

                $rootScope.$apply(function () {
                    if ($rootScope.winPhotosUploadedByUser.damage.length < 6) {
                        $rootScope
                            .winPhotosUploadedByUser
                            .damage
                            .push($scope.damageForm);
                    } else {
                        toastr.error(CONSTANTS.maxWinDamagePhotos, {timeOut: $rootScope.toastrErrorFiveSec});
                    }

                });

                if (event.lengthComputable) {
                    $scope.progressBar = (event.loaded / event.total) * 100;

                }
            };

        };

        if ($scope.selectedImages.length == 0) {
            $scope.flag = false;
        } else {
            $scope.flag = true;
        }

        $scope.uploader.uploadAllPhotos = function () {
            $scope.dataLoading = true;
            $scope.buttonLoader = true;

            for (var i = 0; i < $scope.selectedImages.length; i++) {

                if (sessionStorage.siteId != null) {
                    $scope.selectedImages[i].SiteID = sessionStorage.siteId;
                }

                if (sessionStorage.clientIdForUploadPhoto != null) {

                    $http({
                        url: $rootScope.baseUrl + 'windShied/receivedImage',
                        method: 'POST',
                        data: $httpParamSerializerJQLike($scope.selectedImages[i]),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            }
                        })
                        .then(function (response) {

                            if ($scope.selectedImages.length == 0) {
                                $rootScope.$broadcast('damageUploadStatus', $scope.selectedImages.length);
                            } else {
                                $rootScope.$broadcast('damageUploadStatus', $scope.selectedImages.length);
                            }
                            uploader.uploadAll();
                            $scope.dataLoading = false;
                            $scope.buttonLoader = false;

                            if (response.data.StatusCode == 400) {
                                toastr.error(CONSTANTS.maxwinDamagePhotoLimit, {timeOut: $rootScope.toastrTimeThreeSec});
                                $scope.dataLoading = true;
                                $scope.buttonLoader = false;

                            } else {
                                $scope.uploadStatus = true;
                                $scope.dataLoading = false;
                                $scope.buttonLoader = false;

                                toastr.success(CONSTANTS.photoSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            }

                        }, function (error) {
                            $scope.dataLoading = false;
                            $scope.buttonLoader = false;

                            toastr.error(CONSTANTS.photoNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});

                        });

                } else {

                    $http({
                        url: $rootScope.baseUrl + 'user/SaveImage',
                        method: 'POST',
                        data: $httpParamSerializerJQLike($scope.selectedImages[i]),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'bearer ' + sessionStorage.accessToken
                            }
                        })
                        .then(function (response) {
                            uploader.uploadAll();

                            if ($scope.selectedImages.length == 0) {
                                $rootScope.$broadcast('damageUploadStatus', $scope.selectedImages.length);
                            } else {
                                $rootScope.$broadcast('damageUploadStatus', $scope.selectedImages.length);
                            }
                            $scope.dataLoading = false;
                            $scope.buttonLoader = false;

                            if (response.data.StatusCode == 400) {
                                $scope.dataLoading = true;
                                $scope.buttonLoader = true;
                                toastr.error(CONSTANTS.maxWinDamagePhotosLimitShort, {timeOut: $rootScope.toastrTimeThreeSec});
                            } else {
                                $scope.uploadStatus = true;
                                $scope.dataLoading = false;
                                $scope.buttonLoader = false;

                                toastr.success(CONSTANTS.photoSaved, {timeOut: $rootScope.toastrTimeThreeSec});
                            }

                        }, function (error) {
                            $scope.dataLoading = false;
                            $scope.buttonLoader = false;
                            toastr.error(CONSTANTS.photoNotSaved, {timeOut: $rootScope.toastrTimeThreeSec});

                        });

                }

            }
        };

        $rootScope.sessionLogout();

    }
]);