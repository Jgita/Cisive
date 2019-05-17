app.controller('PdfViewController', [
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

        var defer = $q.defer();

        var header = {
            'Content-Type': 'application/pdf',
            'Authorization': 'bearer ' + sessionStorage.accessToken
        };

        /*
            Check if Report Number is present or not :: $rootScope.RN and Type of user :: $rootScope.Type
            if not through Server Error as Toastr Notification
        */
        if ($rootScope && $rootScope.Type == 'P' && $rootScope.RN) {            
            var siteId = "0";
            if(sessionStorage.siteId)
               siteId=  sessionStorage.siteId;
            $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + 'InsuredSummary/GetPdf/' + $rootScope.RN + '/' + siteId,
                    responseType: 'arraybuffer',
                    headers: header
                })
                .then(function onSuccess(response) {

                    if (response.status == 200) {

                        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                            var blob = new Blob([response.data]);
                            window
                                .navigator
                                .msSaveOrOpenBlob(blob, $rootScope.RN + 'InsuredSummaryDetail.pdf');
                        } else {

                            var file = new Blob([response.data], {type: 'application/pdf'});
                            var fileURL = URL.createObjectURL(file);

                            if (typeof window.orientation != 'undefined') {
                                window.open(fileURL, "_parent");
                            } else {
                                window.open(fileURL, 'B', 'height=768,width=1024,top=0,left=0,menubar=0,toolbar=0,location=0,directories=0,' +
                                        'scrollbars=1,status=0');
                            }

                        }
                    } else if (response.status == 501) {
                        toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                    }
                    defer.resolve({success: true});
                })
                .catch(function onError() {
                    toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                    defer.resolve({success: false});
                });
            //}
        } else if ($rootScope && $rootScope.Type == 'W' && $rootScope.RN) {

            var siteId = "0";
            if(sessionStorage.siteId)
                siteId=  sessionStorage.siteId;
            $http({
                    method: 'GET',
                    url: $rootScope.baseUrl + 'windShied/GetPdf/' + $rootScope.RN + '/' + siteId,
                    responseType: 'arraybuffer',
                    headers: header
                })
                .then(function onSuccess(response) {

                    if (response.status == 200) {
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                            var blob = new Blob([response.data]);
                            window
                                .navigator
                                .msSaveOrOpenBlob(blob, $rootScope.RN + 'InsuredSummaryDetail.pdf');
                        } else {

                            var file = new Blob([response.data], {type: 'application/pdf'});
                            var fileURL = URL.createObjectURL(file);

                            if (typeof window.orientation != 'undefined') {
                                window.open(fileURL, "_parent");
                            } else {
                                window.open(fileURL, 'B', 'height=768,width=1024,top=0,left=0,menubar=0,toolbar=0,location=0,directories=0,' +
                                        'scrollbars=1,status=0');
                            }
                        }

                    } else if (response.status == 501) {
                        toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                    }
                    defer.resolve({success: true});
                })
                .catch(function onError() {
                    toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                    defer.resolve({success: false});
                });
        } else {
            toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
            defer.resolve({success: false});
        }

        // back to dashboard

        $scope.goToDashbord = function () {

            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
                $state.transitionTo("insuredPage.dashboardInsured");
            } else if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                $state.transitionTo("inspectionPage.dashboard");
            } else {
                $state.transitionTo("login");
            }

        }

        /* Disable the Browser Back Button */
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    }
]);