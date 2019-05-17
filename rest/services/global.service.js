(function () {
    'use strict';

    app.factory('globalService', globalService);

    globalService.$inject = ['$http', '$rootScope', '$httpParamSerializerJQLike'];

    function globalService($http, $rootScope, $httpParamSerializerJQLike) {

        var service = {};

        service.globalServiceAPI = globalServiceAPI;
        service.globalSessionCheck = globalSessionCheck;
        service.globalServiceAuthAPI = globalServiceAuthAPI

        return service;

        function globalServiceAPI(method, url, data, header) {

            data = data || {};
            header = header || {};

            var request = {
                method: method,
                url: $rootScope.baseUrl + url,

                headers: header,
                data: JSON.stringify(data)
            }

            return $http(request)
        }

        function globalSessionCheck(method, url, data, header) {

            data = data || {};
            header = header || {};

            var request = {
                method: method,
                url: window._config.pythonAPIURL + url,

                headers: header,
                data: JSON.stringify(data)
            }

            return $http(request)
        }

        function globalServiceAuthAPI(method, url, header) {

            header = header || {};

            var request = {
                method: method,
                url: $rootScope.baseUrl + url,
                headers: header
            }

            return $http(request)
        }

    }
})();