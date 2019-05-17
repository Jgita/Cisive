app.controller('PDFViewAuthVINController', [
    '$scope',
    '$css',
    '$rootScope',
    '$location',
    '$q',
    '$http',
    'toastr',
    function ($scope, $css, $rootScope, $location, $q, $http, toastr) {
        $css.bind({
            href: 'rest/app/client/components/PDFView-AuthVIN/PDFView-AuthVIN.css'
        }, $scope);

        $scope.showMessage = function (input) {
            return input && input.$error && input.$error.required && $scope.authVINForm.$submitted;
        };
        $scope.loading = function () {
            $scope.dataLoading = true;
        };

        var defer = $q.defer();

        var header = {
            'Content-Type': 'application/json'
        };

        if ($rootScope.emailDetails) {
            var Email_Details = '/' + $rootScope.emailDetails
        } else {
            var Email_Details = "";
        }

        $scope.onSubmit = function (VEHICLE_IDENTIFICATION_NUMBER, $event) {
            $scope.VEHICLE_IDENTIFICATION_NUMBER = VEHICLE_IDENTIFICATION_NUMBER.toUpperCase();

            if ($scope.authVINForm.$invalid) {
                $scope.authVINForm.$submitted = true;
            } else {
                $scope.authVINForm.$submitted = false;
            }
            if ($scope.authVINForm.$submitted == false) {
                $scope.dataSpinner = true;

                if ($rootScope.Type == 'P' && $rootScope.RN) {

                    $http({
                            method: 'GET',
                            url: $rootScope.baseUrl + 'InsuredSummary/GetPdfByVIN/' + $rootScope.RN + '/' + $scope.VEHICLE_IDENTIFICATION_NUMBER + Email_Details,
                            responseType: 'arraybuffer'
                        })
                        .then(function onSuccess(response) {
                            $scope.dataSpinner = false;
                            $scope.dataLoading = false;
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
                                        window.open(fileURL,'B','height=768,width=1024,top=0,left=0,menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=0');
                                    }
 
                                    // window.open(fileURL, "_self");
                                }
                            } else if (response.status == 501) {
                                $scope.dataSpinner = false;
                                $scope.dataLoading = false;
                                toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(error) {
                            $scope.dataSpinner = false;
                            $scope.dataLoading = false;
                            if (error.status == 400) {
                                toastr.error("Invalid VIN number", {timeOut: $rootScope.toastrErrorFiveSec});
                            } else {
                                toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                            }

                            defer.resolve({success: false});
                        });
                    // }
                } else if ($rootScope.Type == 'W' && $rootScope.RN) {

                    $http({
                            method: 'GET',
                            url: $rootScope.baseUrl + 'windShied/GetPdfByVIN/' + $rootScope.RN + '/' + $scope.VEHICLE_IDENTIFICATION_NUMBER + Email_Details,
                            responseType: 'arraybuffer'
                        })
                        .then(function onSuccess(response) {
                            $scope.dataSpinner = false;
                            $scope.dataLoading = false;
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
                                        window.open(fileURL,'B','height=768,width=1024,top=0,left=0,menubar=0,toolbar=0,location=0,directories=0,scrollbars=1,status=0');
                                    }
                                }

                            } else if (response.status == 501) {
                                $scope.dataSpinner = false;
                                $scope.dataLoading = false;
                                toastr.error(CONSTANTS.serverErrorDownloadPdf, {timeOut: $rootScope.toastrErrorFiveSec});
                            }
                            defer.resolve({success: true});
                        })
                        .catch(function onError(error) {
                            $scope.dataSpinner = false;
                            $scope.dataLoading = false;
                            if (error.status == 400) {
                                toastr.error("Invalid VIN number", {timeOut: $rootScope.toastrErrorFiveSec});
                            } else {
                                toastr.error(CONSTANTS.accessDenied, {timeOut: $rootScope.toastrErrorFiveSec});
                            }

                            defer.resolve({success: false});
                        });
                } else {
                    $scope.dataSpinner = false;
                    toastr.error(CONSTANTS.serverErrorTryAgain, {timeOut: $rootScope.toastrTimeThreeSec});
                    $scope.dataLoading = false;
                    defer.resolve({success: false});
                }

            }
        }

        /* Disable the Browser Back Button */
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
    }
]);