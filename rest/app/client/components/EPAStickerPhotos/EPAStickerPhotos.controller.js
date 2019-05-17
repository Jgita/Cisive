app.controller('EPAStickerPhotosController', [
    '$scope',
    '$http',
    '$q',
    'globalService',
    '$uibModal',
    'toastr',
    '$css',
    'FileUploader',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $http, $q, globalService, $uibModal, toastr, $css, FileUploader, $rootScope, CONSTANTS) {
        $scope.selectedImages = [];
        $scope.EPAImageCounter = false;
        $scope.updatedImage;
        $scope.progressBar = 0;
        $scope.showProgress = false;
        $scope.uploadAllVisibility = false;
        $rootScope.EPAPhotos = null;

        $css.bind({
            href: 'rest/app/client/components/damagePhoto/damagePhoto.css'
        }, $scope);

        if ($rootScope.photosUploadedByUser.EPA != null) {
            $rootScope.EPAPhotos = $rootScope.photosUploadedByUser;
        }

        var uploader = $scope.uploader = new FileUploader({});

        $scope.ISEPAChecked = function (item) {

            if (item == true) {
                $uibModal
                    .open({
                        backdrop: 'static',
                        backdropClick: false,
                        dialogFade: false,
                        keyboard: false,
                        size: 'md',
                        templateUrl: 'rest/app/client/components/alert-model/alert-model.view.html',
                        controller: 'alertModelController'
                    })
                    .result
                    .then(function (response) {}, function () {});
            }
        };

        // FILTERS

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
                EPA_STICKER: $scope.base64,
                PHOTO_TYPE: "EPASTICKER",
                INSURED_APPLICATION_ID: sessionStorage.clientId,
                PHOTO_NAME: $scope.photoName,
                SiteID: null,
                // QR_Retake: sessionStorage.QR_Retake,
                longitude: null,
                latitude: null,
                REPORT_NUMBER: null,
                RANDOM_NUMBER: sessionStorage.randomNumber,
                WebRequest: true
            };

            if (sessionStorage.siteId != null) {
                if (sessionStorage.QR_Retake == 'true') {
                    $scope.damageForm.REPORT_NUMBER = sessionStorage.ReportNumber;
                    // sessionStorage.ReportNumber;
                    $scope.damageForm.PHOTO_TYPE = 'QCEPA';
                } else {
                    $scope.damageForm.INSURED_APPLICATION_ID = sessionStorage.clientId;
                }
                $scope.damageForm.SiteID = sessionStorage.siteId;
                return $scope.damageForm;
            } else {
                $scope.damageForm.SiteID = null;
                $scope.damageForm.INSURED_APPLICATION_ID = sessionStorage.clientId;
                return $scope.damageForm;
            }
        };

        uploader.onAfterAddingFile = function (fileItem) {

            $scope.selectedImages = [];

            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                sessionStorage.QR_Retake = false;
            }

            uploader
                .queue
                .splice(0, (uploader.queue.length) - 1);
            uploader.progress = 0;

            $scope.EPAImageCounter = true;
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
                    $rootScope.photosUploadedByUser.EPA = $scope.damageForm;
                });

                for (var i = 0; i < $scope.selectedImages.length; i++) {
                    for (var j = 0; j < uploader.queue.length; j++) {
                        if ($scope.selectedImages[i].PHOTO_NAME == uploader.queue[j].file.name.slice(0, 40)) {
                            $scope.updatedImage = $scope.selectedImages[i];
                        } else {
                            var index = $scope
                                .selectedImages
                                .indexOf($scope.selectedImages[i]);
                            if (index != -1) {
                                $scope
                                    .selectedImages
                                    .splice(index, 1);
                            }
                            $scope.updatedImage = $scope.selectedImages[i];
                        }
                    }
                }
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