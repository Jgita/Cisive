app.controller('ForgotPasswordController', [
    '$scope',
    'toastr',
    '$css',
    'vcRecaptchaService',
    '$state',
    '$q',
    '$http',
    '$rootScope',
    '$timeout',
    'CONSTANTS',
    function ($scope, toastr, $css, vcRecaptchaService, $state, $q, $http, $rootScope, $timeout, CONSTANTS) {
        
        $rootScope.isProced = false;
        $css.bind({
            href: 'rest/app/client/components/login/login.css'
        }, $scope);

        $scope.loading = function () {
            $scope.dataLoading = true;
        };

        $scope.cancel = function () {
            $state.transitionTo('login');
        };

        $scope.onSubmit = function (email) {
            $scope.dataLoading = true;
            // if (vcRecaptchaService.getResponse() === "") { //if string is empty
            //     alert("Please resolve the captcha and submit!");
            // } else {
                var emailDATA = {
                    INSURED_EMAIL: email,
                  //  encodedResponse: vcRecaptchaService.getResponse(), //send g-captcah-reponse to our server
                  //  captchRequestFor: "Web"
                };
           // }

            var deferred = $q.defer();
            var request = {
                method: 'POST',
                credentials: 'include',
                cache: 'no-cache',
                url: $rootScope.baseUrl + 'user/ForgotPassword',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(emailDATA)
            };
            $http(request).then(function (response) {

                $scope.dataLoading = false;

                toastr.success(CONSTANTS.emailSent, {timeOut: $rootScope.toastrTimeThreeSec});
                $state.transitionTo('login');
                deferred.resolve({success: true});
                return true,
                response;
            }, function (response) {
                $scope.dataLoading = false;
                if (response.status == 404) {
                    $timeout(function () {
                        $scope.dataLoading = false;
                        toastr.error(CONSTANTS.userNotExist, {timeOut: $rootScope.toastrTimeThreeSec});
                    }, 2000);
                }
                deferred.resolve({success: false});
                return false;
            });
            deferred.resolve({success: true});
        };
    }
]);
