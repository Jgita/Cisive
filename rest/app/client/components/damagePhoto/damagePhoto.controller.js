app.controller('damagePhotoController', [
    '$scope',
    '$q',
    'globalService',
    'toastr',
    '$css',
    'FileUploader',
    '$http',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $q, globalService, toastr, $css, FileUploader, $http, $rootScope, CONSTANTS) {

        $scope.selectedImages = [];
        $scope.progressBar = 0;
        $scope.showProgress = false;
        $scope.uploadAllVisibility = false;
        $rootScope.damagePhotos = null;

        $css.bind({
            href: 'rest/app/client/components/damagePhoto/damagePhoto.css'
        }, $scope);

        if ($rootScope.photosUploadedByUser.damage.length != 0) {
            $rootScope.damagePhotos = $rootScope.photosUploadedByUser;
        }

        $scope
            .$on('deleteDamagePhoto', function (event, result) {
                if (result === true) {
                    $rootScope.remainingDamagePhotoLimit++;
                }
            });

        var uploader = $scope.uploader = new FileUploader({});

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

        $scope.uploadObject = function (base64, fileItem) {
            if (fileItem.file.name.length > 40) {
                var slicePhotoName = fileItem
                    .file
                    .type
                    .split('/');

                $scope.photoName = fileItem
                    .file
                    .name
                    .slice(0, 40) + '.' + slicePhotoName[1];
            } else {
                $scope.photoName = fileItem.file.name
            }

            $scope.damageForm = {

                PHOTO: base64,
                PHOTO_TYPE: "DAMAGE",
                INSURED_APPLICATION_ID: sessionStorage.clientId,
                PHOTO_NAME: $scope.photoName,
                QR_Retake: sessionStorage.QR_Retake,
                longitude: null,
                latitude: null,
                RANDOM_NUMBER: sessionStorage.randomNumber,
                WebRequest: true
            };

            if (sessionStorage.siteId != null) {
                $scope.damageForm.SiteID = sessionStorage.siteId;
                return $scope.damageForm;
            } else {
                $scope.damageForm.SiteID = null;
                return $scope.damageForm;
            }
        };

        uploader.onAfterAddingAll = function (addedFileItems) {

            if (addedFileItems.length <= 15) {
                if (addedFileItems.length <= $rootScope.remainingDamagePhotoLimit) {
                    $rootScope.remainingDamagePhotoLimit = $rootScope.remainingDamagePhotoLimit - addedFileItems.length;

                    for (var i = 0; i < addedFileItems.length; i++) {
                        uploader.onAfterAddingFileChanged(addedFileItems[i]);
                    }
                } else {
                    toastr.error(CONSTANTS.maxDamagePhotoLimit, {timeOut: $rootScope.toastrErrorFiveSec});
                }

            } else {
                toastr.error(CONSTANTS.maxDamagePhotoLimit, {timeOut: $rootScope.toastrErrorFiveSec});
            }
        };

        uploader.onAfterAddingFileChanged = function (fileItem) {

            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                sessionStorage.QR_Retake = false;
            }

            $scope.uploadAllVisibility = true;
            var reader = new FileReader();
            reader.readAsDataURL(fileItem._file);

            reader.onload = function (event) {
                $scope.base64 = event
                    .target
                    .result
                    .substring(event.target.result.indexOf(',') + 1, event.target.result.length);

                $scope
                    .selectedImages
                    .push($scope.uploadObject($scope.base64, fileItem));

                $rootScope.$apply(function () {

                    if ($rootScope.photosUploadedByUser.damage.length < 15) {
                        $rootScope
                            .photosUploadedByUser
                            .damage
                            .push($scope.damageForm);
                    } else {
                        toastr.error(CONSTANTS.maxDamagePhotoLimit, {timeOut: $rootScope.toastrErrorFiveSec});

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

    }
]);