app.controller('HEPhotoViewController', [
    '$scope',
    '$css',
    'toastr',
    '$uibModalInstance',
    '$rootScope',
    '$state',
    '$q',
    'globalService',
    'CONSTANTS',
    function ($scope, $css, toastr, $uibModalInstance, $rootScope, $state, $q, globalService, CONSTANTS) {

        $css.bind({
            href: 'rest/app/client/human-expert-components/HE-photoView/HE-photoView.css'
        }, $scope);
        $scope.dataLoading = true;
        $scope.autoAcceptStatus = false;
        $scope.approve = false;

        $scope.$on('closePhotoViewModal', function (event, result) {
            if (result === true) {
                if ($scope.approve) {
                    $scope.autoAcceptStatus = false;
                } else {
                    $scope.autoAcceptStatus = true;
                }
                $scope.dataLoading = false;
            } else {
                $scope.autoAcceptStatus = false;
            }

        });

        $scope.closeModal = function () {
            $uibModalInstance.close();
            if ($rootScope.logoutExecute == false) {
                $rootScope.onLoadHE();
            }
            delete sessionStorage.checkStatus;
        }

        $scope.close = function () {
            $uibModalInstance.close();
        }

        $scope.viewPhoto = function () {

            var data = {
                HE_PHOTO_ID: sessionStorage.HE_PHOTO_ID,
                HE_ID: sessionStorage.HE_USERID
            }

            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            };

            var deferred = $q.defer();

            globalService
                .globalServiceAPI("POST", "humanexpert/getphotos", data, header)
                .then(function (response) {
                    if (response.data.LOCKED == 'True') {
                        $scope.close();
                        toastr.error(CONSTANTS.HEPhotoPicked, {
                            timeOut: $rootScope.toastrErrorFiveSec,
                            closeButton: true
                        });
                    }
                    $scope.dataLoading = false;
                    $scope.photoReview = response.data.HE_PHOTO;
                    if ($scope.photoReview != null) {
                        showPage();
                    } else {
                        loader();
                    }
                }),
            function (error) {
                loader();
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                $scope.dataLoading = false;
                deferred.resolve({success: false});

            }
        }

        $scope.viewPhoto();

        $scope.acceptPhoto = function () {

            $scope.AdataLoading = true;
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            };

            var data = {
                ID: sessionStorage.ID,
                HE_APPRUV_STATUS: true,
                HE_ID: sessionStorage.HE_USERID,
                UPDATED_BY: 'HE'
            }

            var deferred = $q.defer();
            $scope.approve = false;
            globalService
                .globalServiceAPI("POST", "humanexpert/heapprove", data, header)
                .then(function (response) {

                    if (response.data && response.data == 'Approved') {
                        if ($rootScope.logoutExecute == false) {
                            $rootScope.onLoadHE();
                        }
                        delete sessionStorage.checkStatus;
                        toastr.success(CONSTANTS.approved, {timeOut: $rootScope.toastrTimeThreeSec})
                        $scope.AdataLoading = false;
                        $scope.autoAcceptStatus = false;
                        $scope.approve = true;
                        $rootScope.$broadcast('checkBoxModel', true);
                        $uibModalInstance.close();
                    } else {
                        if ($rootScope.logoutExecute == false) {
                            $rootScope.onLoadHE();
                        }
                        delete sessionStorage.checkStatus;
                        $scope.AdataLoading = false;
                        toastr.error(CONSTANTS.notApproved, {timeOut: $rootScope.toastrTimeThreeSec})
                    }
                }),
            function (error) {
                delete sessionStorage.checkStatus;
                $scope.AdataLoading = false;
                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                deferred.resolve({success: false});
            }
        }

        $scope.rejectPhoto = function () {
            $scope.RdataLoading = true;

            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.HE_TOKEN
            };

            var data = {
                ID: sessionStorage.ID,
                HE_APPRUV_STATUS: false,
                HE_ID: sessionStorage.HE_USERID,
                UPDATED_BY: 'HE'
            }

            var deferred = $q.defer();

            globalService
                .globalServiceAPI("POST", "humanexpert/heapprove", data, header)
                .then(function (response) {

                    if (response.data && response.data == 'Rejected') {
                        if ($rootScope.logoutExecute == false) {
                            $rootScope.onLoadHE();
                        }
                        delete sessionStorage.checkStatus;
                        $scope.RdataLoading = false;
                        $scope.approve = true;
                        toastr.success(CONSTANTS.rejected, {timeOut: $rootScope.toastrTimeThreeSec})
                        delete sessionStorage.currentWorkingRow;
                        $uibModalInstance.close();
                    } else {
                        if ($rootScope.logoutExecute == false) {
                            $rootScope.onLoadHE();
                        }
                        delete sessionStorage.checkStatus;

                        $scope.RdataLoading = false;
                        toastr.error(CONSTANTS.notApproved, {timeOut: $rootScope.toastrTimeThreeSec})
                        $uibModalInstance.close();
                    }
                }),
            function (error) {
                delete sessionStorage.checkStatus;
                $scope.RdataLoading = false;

                toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                deferred.resolve({success: false});
            }
        }

        //function for loader

        function showPage() {
            angular
                .element("#loader")
                .css({display: 'none'})
            angular
                .element("#myDiv")
                .css({display: 'block'})
        }

        function loader() {
            angular
                .element("#loader")
                .css({display: 'block'})
        }
    }
])