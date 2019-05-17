app.controller('formProcessingController', [
    '$uibModalInstance',
    '$state',
    '$rootScope',
    function ($uibModalInstance, $state, $rootScope) {
        $rootScope.ok = function () {
            $state.transitionTo('login');
            $uibModalInstance.close();
            sessionStorage.clear();
            localStorage.clear();
            localStorage.setItem("isLogout", "1");
        };
    }
]);
