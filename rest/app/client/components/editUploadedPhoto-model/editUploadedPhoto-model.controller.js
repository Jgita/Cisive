app.controller('editUploadedPhotoModelController', [
    '$scope',
    '$css',
    '$uibModalInstance',
    '$rootScope',
    'globalService',
    'toastr',
    '$uibModal',
    function ($scope, $css, $uibModalInstance, $rootScope, globalService, toastr, $uibModal) {

        $css.bind({
            href: 'rest/app/client/components/editUploadedPhoto-model/editUploadedPhoto-model.css'
        }, $scope);

        $rootScope.yes = function () {
            $rootScope.sessionLogout();
            $uibModalInstance.close();
        };

        $scope.no = function () {
            $rootScope.isProcessShow(true);
            $rootScope.AILoader = true;
            $scope.dataLoading = true;
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
                        $scope.dataLoading = false;
                        $rootScope.isProcessShow(false);
                        if (response.data.Result == "unauthorised") {
                            $rootScope.allReadyLogin();
                            localStorage.clear();
                            sessionStorage.clear();
                            $rootScope.AILoader = false;

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
                            $uibModalInstance.close();
                            $rootScope.isProced = true;
                            $rootScope.AILoader = false;

                            $rootScope.$broadcast('confirmationCall', true);
                        }
                    }, function () {
                        $rootScope.AILoader = false;
                        $scope.dataLoading = false;
                        $rootScope.isProcessShow(false);
                        toastr.error(CONSTANTS.AIFaliure, {timeOut: $rootScope.toastrTimeThreeSec});
                    });
            }

        };

    }
]);