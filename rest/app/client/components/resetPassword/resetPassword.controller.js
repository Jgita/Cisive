app.controller('ResetPasswordController', [
    '$scope',
    '$state',
    '$css',
    'vcRecaptchaService',
    'globalService',
    'toastr',
    '$q',
    '$http',
    '$timeout',
    '$rootScope',
    '$httpParamSerializerJQLike',
    'CONSTANTS',
    function ($scope, $state, $css, vcRecaptchaService, globalService, toastr, $q, $http, $timeout, $rootScope, $httpParamSerializerJQLike, CONSTANTS) {

        $css.bind({
            href: 'rest/app/client/components/login/login.css'
        }, $scope);

        $scope.onSubmit = function (resetPasswordInfo) {
            $scope.dataLoading = true;

            /* vcRecaptchaService.getResponse() gives you the g-captcha-response */
            // if (vcRecaptchaService.getResponse() === "") { //if string is empty
            // alert("Please resolve the captcha and submit!") } else {
            $scope.DATA = {
                USER_NAME: resetPasswordInfo.USER_NAME,
                OLD_PASSWORD: resetPasswordInfo.password,
                NEW_PASSWORD: resetPasswordInfo.confirmPassword.confirm,
                // encodedResponse: vcRecaptchaService.getResponse(), //send g-captcah-reponse
                // to our server captchRequestFor: "Web"
            }
            //  }

            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            var deferred = $q;
            /**
             * Encryption Code Starts here
             */
            var getRSAKey = new Promise(function (resolve, reject) {
                globalService
                    .globalServiceAPI("GET", "user/GetPublicKey", headers)
                    .then(function (response) {
                        if (response.status == 200) {
                            resolve(response);
                        } else {
                            reject(true);
                        }
                    }, function (response) {
                        $scope.dataLoading = false;
                        toastr.error(CONSTANTS.somethingWentWrong, {timeOut: $rootScope.toastrTimeThreeSec});
                        return false;
                    })
            });

            getRSAKey.then(function (response) {

                $scope.DATA.UId = response.data.UId;

                var rsa = new RSAKey();
                rsa.setPublic(response.data.Modulus, response.data.Exponent);

                var encryptOldPassword = rsa.encrypt($scope.DATA.OLD_PASSWORD);
                var encryptNewPassword = rsa.encrypt($scope.DATA.NEW_PASSWORD);

                $scope.DATA.OLD_PASSWORD = hex2b64(encryptOldPassword);
                $scope.DATA.NEW_PASSWORD = hex2b64(encryptNewPassword);

                $http({
                    url: $rootScope.baseUrl + 'User/ChangePassword',
                    method: 'POST',
                    data: $httpParamSerializerJQLike($scope.DATA),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(function (response) {

                        $scope.dataLoading = false;
                        toastr.success(CONSTANTS.passwordChanged, {timeOut: $rootScope.toastrTimeThreeSec});
                        localStorage.password = $scope.DATA.NEW_PASSWORD;
                        $state.transitionTo('login');
                    }, function (error) {

                        $scope.dataLoading = true;

                        if (error.statusText == "Not Found") {
                            $timeout(function () {
                                $scope.dataLoading = false;

                                toastr.error(CONSTANTS.oldPasswordIncorrect, {timeOut: $rootScope.toastrTimeThreeSec})
                                document
                                    .getElementById("email")
                                    .disabled = false;

                            }, 2000)
                        }

                    })

                deferred.resolve({success: true});
            })

        }

        $scope.onLoad = function () {
            if (sessionStorage.userDispalyName != null) {

                $scope.resetPasswordInfo = {
                    USER_NAME: sessionStorage.userDispalyName
                }
                $scope.OnLoadingEmail = true;
            }
        }

        $scope.onLoad();

        $scope.paste = function () {
            toastr.warning(CONSTANTS.copyPasteNotAllowed, {timeOut: $rootScope.toastrTimeThreeSec});
        }

        $scope.goToDashbord = function () {

            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                $state.transitionTo("insuredPage.dashboardInsured");
            } else if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                $state.transitionTo("inspectionPage.dashboard");
            } else {
                $state.transitionTo("login");
            }

        }

        $rootScope.sessionLogout();

    }
]);