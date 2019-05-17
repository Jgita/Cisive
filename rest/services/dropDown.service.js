(function () {
    'use strict';

    app.factory('dropDownService', dropDownService);

    dropDownService.$inject = ['$http', '$rootScope', '$q', ''];

    function dropDownService($http, $rootScope, $q, $scope) {

        var service = {};

        service.getStates = getStates;
        service.getAdverseConditions = getAdverseConditions;
        service.getInsuranceCompany = getInsuranceCompany;

        return service;

        function getStates(id) {
            var defer = $q.defer();

            $http
                .get($rootScope.baseUrl + 'user/getState')
                .then(function onSuccess(response) {

                    $scope.states = response.data;

                    for (var state in $scope.states) {

                        if (id == state.id) {
                            $scope.STATE_NAME = state.name;

                            return $scope.STATE_NAME;
                        }
                    }

                    defer.resolve({success: true});
                })
                .catch(function onError(response) {

                    defer.resolve({success: false});
                });
        }

        function getAdverseConditions() {

            var defer = $q.defer();

            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.accessToken
            }

            globalService
                .globalServiceAuthAPI("GET", "InsuredSummary/ADVERSECONDITIONS", header)
                .then(function onSuccess(response) {

                    $scope.adverseConditions = response.data;
                    defer.resolve({success: true});
                })
                .catch(function onError(response) {

                    defer.resolve({success: false});
                });
        }

        function getInsuranceCompany() {

            if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'inspector') {
                var siteIdForIC = sessionStorage.siteId;
            } else {
                var siteIdForIC = '';
            }

            var defer = $q.defer();
            var header = {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + sessionStorage.accessToken
            }

            globalService
                .globalServiceAuthAPI("GET", "InsuredSummary/ListofCompany/" + siteIdForIC, header)
                .then(function onSuccess(response) {

                    $scope.insuranceCompanies = response.data;
                    defer.resolve({success: true});
                })
                .catch(function onError(response) {

                    defer.resolve({success: false});
                });
        }

    }
})();