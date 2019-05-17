app.controller('QRRetakeController', [
    '$scope',
    '$http',
    '$q',
    'globalService',
    '$uibModal',
    'toastr',
    '$httpParamSerializerJQLike',
    '$state',
    '$css',
    '$rootScope',
    'CONSTANTS',
    function ($scope, $http, $q, globalService, $uibModal, toastr, $httpParamSerializerJQLike, $state, $css, $rootScope, CONSTANTS) {

        // Need tio change this with state code with the code return by API
        var siteStateCode = sessionStorage
            .siteId
            .substring(0, 2)
            .toUpperCase();
        $scope.StateCode = siteStateCode;
        $css.bind({
            href: 'rest/app/client/components/QRRetake/QRRetake.css'
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
        $scope.disabledReportText = false;

        $scope.regx = /(^[A-Za-z]{2}\s?[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':\|,.<>\/?]{1}\s?[0-9]{6}$)|(^[A-Za-z]{2}\s?[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':\|,.<>\/?]{1}\s?[0-9]{6}\s?[A-Ga-g]{1}$)|(^[A-Za-z]{2}\s?[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':\|,.<>\/?]{1}\s?[0-9]{6}\s?[-]{1}\s?[A-Ga-g]{1}$)/;

        $rootScope.photosUploadedByUser = {
            rear: null,
            front: null,
            damage: [],
            EPA: null
        }

        $scope.QCInfo = function () {
            angular
                .forEach($scope.QCInfoForm.$error.required, function (field) {
                    $scope.spinner = false;
                    toastr.error(CONSTANTS.reportNumberRequired, {timeOut: $rootScope.toastrErrorFiveSec})
                    field.$setDirty();
                });

            angular.forEach($scope.QCInfoForm.$error.pattern, function (field) {
                $scope.spinner = false;
                toastr.error(CONSTANTS.wrongReportNumber, {timeOut: $rootScope.toastrErrorFiveSec})
                field.$setDirty();
            });

            angular.forEach($scope.QCInfoForm.$error.minlength, function (field) {
                $scope.spinner = false;
                toastr.error(CONSTANTS.wrongReportNumber, {timeOut: $rootScope.toastrErrorFiveSec})
                field.$setDirty();
            });

        };

        // $scope.showMessage = function (input) {     return input && input.$error &&
        // input.$error.required && $scope.QCInfoForm.$submitted; };
        // $scope.showMessagePattern = function (input) {     return input &&
        // input.$error && input.$error.pattern && $scope.QCInfoForm.$submitted; }

        $rootScope.visiblePhotoView = false;

        $scope.getReportNumberSubmit = function (number) {
            $rootScope.sessionLogout();
            $scope.spinner = true;
            var deferred = $q.defer();

            if (number.length == 9) {
                sessionStorage.ReportNumber = number;
                var DATA = {
                    ReportNumber: number.toUpperCase()
                }
            } else if (number.length == 11) {
                $scope.lastDigOfReportNo = number.slice(-1);
                var removeLastDigOfReportNo = number.slice(0, -2);
                sessionStorage.ReportNumber = removeLastDigOfReportNo.toUpperCase();
                var DATA = {
                    ReportNumber: removeLastDigOfReportNo
                }
            } else {
                $scope.lastDigOfReportNo = number.slice(-1);
                var removeLastDigOfReportNo = number.slice(0, -1);
                sessionStorage.ReportNumber = removeLastDigOfReportNo.toUpperCase();
                var DATA = {
                    ReportNumber: removeLastDigOfReportNo
                }
            }

            if ($scope.QCInfoForm.$invalid) {
                $scope.QCInfoForm.$submitted = true;
            } else {
                $scope.QCInfoForm.$submitted = false;
            }

            if ($scope.QCInfoForm.$submitted == false) {

                $http({
                    url: $rootScope.baseUrl + 'InsuredSummary/reportnumbervalidate',
                    method: 'POST',
                    data: JSON.stringify(DATA),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.accessToken
                        }
                    })
                    .then(function (response) {
                        $scope.spinner = false;

                        if (response.data) {
                            // if (response.data == null || response.data == "") {
                            // $rootScope.visiblePhotoView = false;     $scope.disabledReportText = false;
                            // toastr.error(CONSTANTS.invalidReportNumber, {timeOut:
                            // $rootScope.toastrErrorFiveSec}); } else {   if (number.length == 10) {
                            if (number.length == 10 && $scope.lastDigOfReportNo.toUpperCase() != response.data) {
                                $rootScope.visiblePhotoView = false;
                                $scope.disabledReportText = false;
                                toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec} //  }
                                );
                            } else if (number.length == 11 && $scope.lastDigOfReportNo.toUpperCase() != response.data) {
                                $rootScope.visiblePhotoView = false;
                                $scope.disabledReportText = false;
                                toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec} //  }
                                );
                            } else {
                                $scope.reportNoCharResponse = response.data;
                                $scope.lastDigOfReportNo = response.data;

                                if ($scope.reportNoCharResponse == 'A' || $scope.reportNoCharResponse == 'a') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = true;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.frontAndDriverSide = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.frontAndDriverSidePhotos');

                                } else if ($scope.reportNoCharResponse == 'B' || $scope.reportNoCharResponse == 'b') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = true;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.rearAndPassengerSide = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.rearAndPassengerSidePhotos');

                                } else if ($scope.reportNoCharResponse == 'C' || $scope.reportNoCharResponse == 'c') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = false;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.EPA = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.EPAStickerPhotos');

                                } else if ($scope.reportNoCharResponse == 'D' || $scope.reportNoCharResponse == 'd') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = true;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.frontAndDriverSide = true;
                                    $scope.rearAndPassengerSide = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.frontAndDriverSidePhotos');

                                } else if ($scope.reportNoCharResponse == 'E' || $scope.reportNoCharResponse == 'e') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = false;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.frontAndDriverSide = true;
                                    $scope.EPA = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.frontAndDriverSidePhotos');

                                } else if ($scope.reportNoCharResponse == 'F' || $scope.reportNoCharResponse == 'f') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = true;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = false;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.rearAndPassengerSide = true;
                                    $scope.EPA = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.rearAndPassengerSidePhotos');

                                } else if ($scope.reportNoCharResponse == 'G' || $scope.reportNoCharResponse == 'g') {

                                    $scope.uploadPhotoTabs.frontAndDriverSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.rearAndPassengerSide.disabledValue = false;
                                    $scope.uploadPhotoTabs.EPA.disabledValue = false;
                                    $rootScope.visiblePhotoView = true;
                                    $scope.disabledReportText = true;
                                    sessionStorage.QR_Retake = true;
                                    $scope.frontAndDriverSide = true;
                                    $scope.rearAndPassengerSide = true;
                                    $scope.EPA = true;
                                    toastr.success(CONSTANTS.selectPhotoForQCRetake, {timeOut: $rootScope.toastrTimeThreeSec});
                                    $state.transitionTo('inspectionPage.QRRetake.frontAndDriverSidePhotos');
                                } else if ($scope.reportNoCharResponse == 'N' || $scope.reportNoCharResponse == 'n') {
                                    $rootScope.visiblePhotoView = false;
                                    toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec});
                                    $scope.disabledReportText = false;

                                } else {
                                    $rootScope.visiblePhotoView = false;
                                    toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec});
                                    $scope.disabledReportText = false;
                                }
                            }
                        } else {
                            $rootScope.visiblePhotoView = false;
                            $scope.disabledReportText = false;
                            toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec});
                        }

                    }, function (error) {
                        $scope.spinner = false;
                        toastr.error(CONSTANTS.invalidReportNumber, {timeOut: $rootScope.toastrErrorFiveSec});
                    });
            }
        }

        $scope.uploadPhotoTabs = {

            'frontAndDriverSide': {
                id: 'item1',
                title: 'Front and Driver Side',
                route: 'inspectionPage.QRRetake.frontAndDriverSidePhotos',
                disabledValue: null
            },
            'rearAndPassengerSide': {
                id: 'item2',
                title: 'Rear and Passenger Side',
                route: 'inspectionPage.QRRetake.rearAndPassengerSidePhotos',
                disabledValue: null
            },

            'EPA': {
                id: 'item4',
                title: 'EPA Sticker',
                route: 'inspectionPage.QRRetake.EPAStickerPhotos',
                disabledValue: null
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

        }

        $scope.confirmAnduploadAllPhotos = function (lastChar) {
            $rootScope.sessionLogout();
            if (lastChar == 'A' || lastChar == 'a') {
                if ($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) {
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
            } else if (lastChar == 'B' || lastChar == 'b') {
                if ($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined) {
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
                                    return 'The Rear and Driver Side photo is missing. Please select missing photo to contin' +
                                        'ue.';
                                } else {
                                    return 'The Rear and Passenger Side photo is missing. Please select missing photo to con' +
                                        'tinue.';
                                }
                            }
                        }
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

            } else if (lastChar == 'C' || lastChar == 'c') {
                if ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined) {
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
            } else if (lastChar == 'D' || lastChar == 'd') {
                if (($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) && ($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined)) {
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
            } else if (lastChar == 'E' || lastChar == 'e') {
                if (($rootScope.photosUploadedByUser.front == null || $rootScope.photosUploadedByUser.front == undefined) && ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined)) {
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
                                    return 'EPA Sticker Missing Box Checked. Please provide photo of blank doorjamb.'
                                } else {
                                    return 'The EPA Sticker is missing. Please select missing photo to continue.';
                                }
                            }
                        }
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
            } else if (lastChar == 'F' || lastChar == 'f') {
                if (($rootScope.photosUploadedByUser.rear == null || $rootScope.photosUploadedByUser.rear == undefined) && ($rootScope.photosUploadedByUser.EPA == null || $rootScope.photosUploadedByUser.EPA == undefined)) {
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
                                    return 'The Rear and Driver Side photo is missing. Please select missing photo to contin' +
                                        'ue.';
                                } else {
                                    return 'The Rear and Passenger Side photo is missing. Please select missing photo to con' +
                                        'tinue.';
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
            } else if (lastChar == 'G' || lastChar == 'g') {
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

        }

        $scope.$on('confirmationCall', function (event, result) {
            $scope.onLoadBool = result;
            if ($scope.onLoadBool === true) {
                $scope.QCUploadPhotos();
            }

        });

        $scope.QCUploadPhotos = function () {
            var deleteold = true;
            $scope.buttonLoader = true;
            const inspectorQCPhotoPromis = new Promise(function (resolve, reject) {
                var frontPromis = new Promise(function (fresolve, freject) {
                    $scope.buttonLoader = true;
                    if ($rootScope.photosUploadedByUser.front != null && $rootScope.photosUploadedByUser.front != undefined) {
                        if ($scope.lastDigOfReportNo == 'A' || $scope.lastDigOfReportNo == 'a') {
                            $rootScope.photosUploadedByUser.front.IsComplete = true;
                        } else if ($scope.lastDigOfReportNo == 'D' || $scope.lastDigOfReportNo == 'd') {
                            $rootScope.photosUploadedByUser.front.IsComplete = false;
                        } else if ($scope.lastDigOfReportNo == 'E' || $scope.lastDigOfReportNo == 'e') {
                            $rootScope.photosUploadedByUser.front.IsComplete = false;
                        } else if ($scope.lastDigOfReportNo == 'G' || $scope.lastDigOfReportNo == 'g') {
                            $rootScope.photosUploadedByUser.front.IsComplete = false;
                        } else {
                            $rootScope.photosUploadedByUser.front.IsComplete = false;
                        }
                        var fdata = $rootScope.photosUploadedByUser.front;
                        fdata.deleteOld = deleteold;
                        $http({
                            url: $rootScope.baseUrl + 'InsuredSummary/qcretakephoto',
                            method: 'POST',
                            data: $httpParamSerializerJQLike(fdata),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'bearer ' + sessionStorage.accessToken
                                }
                            })
                            .then(function (response) {

                                if (response.data.StatusCode == 400) {
                                    $scope.frontPhotoUploadStatus = false;
                                    $rootScope.frontPhotoRedirect = false;
                                    $scope.buttonLoader = true;
                                    $scope.uploadStatusDeleteAPI = false;
                                    freject(true);
                                    reject(true);
                                } else {
                                    $scope.frontPhotoUploadStatus = true;
                                    $rootScope.frontPhotoRedirect = true;
                                    $scope.uploadStatus = true;
                                    $scope.uploadStatusDeleteAPI = true;
                                    $scope.buttonLoader = false;
                                    deleteold = false;
                                    fresolve(true);
                                }
                            }, function (error) {

                                $scope.frontPhotoUploadStatus = false;
                                $rootScope.frontPhotoRedirect = false;
                                $scope.buttonLoader = false;

                                freject(true);
                                reject(true);

                            });
                    } else {
                        fresolve(true);
                    }
                });
                var rearPromise;
                frontPromis.then(function (response) {
                    $scope.buttonLoader = true;
                    var rearPromise = new Promise(function (rresolve, rreject) {
                        if ($rootScope.photosUploadedByUser.rear != null && $rootScope.photosUploadedByUser.rear != undefined) {
                            if ($scope.lastDigOfReportNo == 'B' || $scope.lastDigOfReportNo == 'b') {
                                $rootScope.photosUploadedByUser.rear.IsComplete = true;
                            } else if ($scope.lastDigOfReportNo == 'D' || $scope.lastDigOfReportNo == 'd') {
                                $rootScope.photosUploadedByUser.rear.IsComplete = true;
                            } else if ($scope.lastDigOfReportNo == 'F' || $scope.lastDigOfReportNo == 'f') {
                                $rootScope.photosUploadedByUser.rear.IsComplete = false;
                            } else if ($scope.lastDigOfReportNo == 'G' || $scope.lastDigOfReportNo == 'g') {
                                $rootScope.photosUploadedByUser.rear.IsComplete = false;
                            } else {
                                $rootScope.photosUploadedByUser.rear.IsComplete = false;
                            }
                            var rdata = $rootScope.photosUploadedByUser.rear;
                            rdata.deleteOld = deleteold;

                            $http({
                                url: $rootScope.baseUrl + 'InsuredSummary/qcretakephoto',
                                method: 'POST',
                                data: $httpParamSerializerJQLike(rdata),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'bearer ' + sessionStorage.accessToken
                                    }
                                })
                                .then(function (response) {

                                    if (response.data.StatusCode == 400) {
                                        $scope.rearPhotoUploadStatus = false;
                                        $rootScope.rearPhotoRedirect = false;

                                        $scope.buttonLoader = true;
                                        $scope.uploadStatusDeleteAPI = false;
                                        rreject(true);
                                        reject(true);
                                    } else {
                                        $scope.rearPhotoUploadStatus = true;
                                        $rootScope.rearPhotoRedirect = true;
                                        $scope.uploadStatus = true;
                                        $scope.uploadStatusDeleteAPI = true;
                                        $scope.buttonLoader = false;
                                        deleteold = false;
                                        rresolve(true);
                                    }
                                }, function (error) {

                                    $rootScope.rearPhotoUploadStatus = false;
                                    $scope.rearPhotoRedirect = false;
                                    $scope.buttonLoader = false;
                                    rreject(true);
                                    reject(true);
                                });
                        } else {
                            rresolve(true);
                        }
                    });

                    rearPromise.then(function (response) {
                        $scope.buttonLoader = true;
                        if ($rootScope.photosUploadedByUser.EPA != null && $rootScope.photosUploadedByUser.EPA != undefined) {

                            if ($scope.lastDigOfReportNo == 'C' || $scope.lastDigOfReportNo == 'c') {
                                $rootScope.photosUploadedByUser.EPA.IsComplete = true;
                            } else if ($scope.lastDigOfReportNo == 'E' || $scope.lastDigOfReportNo == 'e') {
                                $rootScope.photosUploadedByUser.EPA.IsComplete = true;
                            } else if ($scope.lastDigOfReportNo == 'F' || $scope.lastDigOfReportNo == 'f') {
                                $rootScope.photosUploadedByUser.EPA.IsComplete = true;
                            } else if ($scope.lastDigOfReportNo == 'G' || $scope.lastDigOfReportNo == 'g') {
                                $rootScope.photosUploadedByUser.EPA.IsComplete = true;
                            } else {
                                $rootScope.photosUploadedByUser.EPA.IsComplete = true;
                            }
                            var edata = $rootScope.photosUploadedByUser.EPA;
                            edata.deleteOld = deleteold;
                            $http({
                                url: $rootScope.baseUrl + 'InsuredSummary/qcretakephoto',
                                method: 'POST',
                                data: $httpParamSerializerJQLike(edata),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Authorization': 'bearer ' + sessionStorage.accessToken
                                    }
                                })
                                .then(function (response) {

                                    if (response.data.StatusCode == 400) {
                                        $scope.EPAPhotoUploadStatus = false;
                                        $rootScope.EPAPhotoRedirect = false;
                                        $scope.buttonLoader = true;
                                        $scope.uploadStatusDeleteAPI = false;
                                        reject(true);

                                    } else {
                                        $scope.EPAPhotoUploadStatus = true;
                                        $rootScope.EPAPhotoRedirect = true;
                                        $scope.uploadStatus = true;
                                        $scope.uploadStatusDeleteAPI = true;
                                        $scope.buttonLoader = false;
                                        deleteold = false;
                                        resolve(true);
                                    }
                                }, function (error) {

                                    $scope.EPAPhotoUploadStatus = false;
                                    $rootScope.EPAPhotoRedirect = false;
                                    $scope.buttonLoader = false;
                                    reject(true);
                                });
                        } else {
                            resolve(true);
                        }
                    })

                });
            });
            inspectorQCPhotoPromis.then(function (response) {

                $state.transitionTo('inspectionPage.newInspection');
                toastr.success(CONSTANTS.qcPhotoUploaded, {timeOut: $rootScope.toastrErrorFiveSec});

            }, function () {
                toastr.error(CONSTANTS.qcPhotoNotSaved, {timeOut: $rootScope.toastrErrorFiveSec});
            })

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

    }
])