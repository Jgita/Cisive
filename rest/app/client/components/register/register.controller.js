app.controller('RegisterController', [
    '$scope',
    '$css',
    'toastr',
    '$http',
    '$q',
    'UserService',
    'vcRecaptchaService',
    '$location',
    '$rootScope',
    'FlashService',
    'CONSTANTS',
    function ($scope, $css, toastr, $http, $q, UserService, vcRecaptchaService, $location, $rootScope, FlashService, CONSTANTS) {

        var vm = this;
        $scope.disableText = false;

        $css.bind({
            href: 'rest/app/client/components/login/login.css'
        }, $scope);

        vm.register = register;

        function register() {

            var selectStateObj = vm.user.INSURED_STATE_CODE
            selectStateObj = JSON.parse(selectStateObj);

            if (vcRecaptchaService.getResponse() === "") { //if string is empty
                alert("Please resolve the captcha and submit!")
            } else {
                var user = { //prepare payload for request
                    INSURED_EMAIL: vm.user.INSURED_EMAIL,
                    INSURED_FIRST_NAME: vm.user.INSURED_FIRST_NAME,
                    INSURED_LAST_NAME: vm.user.INSURED_LAST_NAME,
                    INSURED_CELL_PHONE: vm.user.INSURED_CELL_PHONE,
                    INSURED_STATE_CODE: selectStateObj.id,
                    encodedResponse: vcRecaptchaService.getResponse(), //send g-captcah-reponse to our server
                    captchRequestFor: "Web"
                }
            }

            vm.dataLoading = true;
            UserService
                .Create(user)
                .then(function (response) {

                    if (response.status == 200) {

                        vm.dataLoading = false;
                        toastr.success(CONSTANTS.registrationSuccessful, {timeOut: 0});
                        $location.path('/login');
                    } else {

                        toastr.error(CONSTANTS.registrationFailed, {timeOut: $rootScope.toastrTimeThreeSec})
                        $scope.disableText = false;
                        vm.dataLoading = false;
                    }
                }, function (error) {

                    if (error.data.Message !== null && error.data.Message == "Sequence contains more than one element") {
                        vm.dataLoading = false;
                        $scope.disableText = false;
                        toastr.error(CONSTANTS.allReadyRegistered, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else if (error.status == 409) {
                        vm.dataLoading = false;
                        $scope.disableText = false;
                        toastr.error(CONSTANTS.allReadyRegistered, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else if (error.status == 405) {
                        vm.dataLoading = false;
                        $scope.disableText = false;
                        toastr.error(CONSTANTS.invalidEmailId, {timeOut: $rootScope.toastrTimeThreeSec})
                    } else {
                        vm.dataLoading = false;
                        $scope.disableText = false;
                        toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec})
                    }

                });
        }

        var getStates = function () {
            var defer = $q.defer();

            $http
                .get($rootScope.baseUrl + 'user/getState')
                .then(function onSuccess(response) {

                    $scope.states = response.data;

                    $scope.states = $scope
                        .states
                        .filter(function (item) {
                            return item.name !== 'N/A';
                        });

                    defer.resolve({success: true});
                })
                .catch(function onError(response) {

                    defer.resolve({success: false});
                });

        }

        getStates();

        $scope.GetValue = function () {
            var selectedStateObj = vm.user.INSURED_STATE_CODE
            var state = JSON.parse(selectedStateObj);

            if (state.name === 'Florida') {

                $scope.floridaState = true;

            } else {
                $scope.floridaState = false;
            }
        }
        $scope.insuredRegister = function () {
            $scope.disableText = true;
            localStorage.clear();
        }

    }
]);
