app.controller('photoMissingModelController', [
    '$scope',
    '$css',
    'items',
    '$uibModalInstance',
    '$rootScope',
    '$state',
    function ($scope, $css, items, $uibModalInstance, $rootScope, $state) {

        $css.bind({
            href: 'rest/app/client/components/photoMissing-model/photoMissing-model.css'
        }, $scope);
        $scope.modelBody = items;
        $rootScope.ok = function () {
            if ($scope.modelBody == 'It seems server is not responding, Please try after some time.' || $scope.modelBody == 'It seems server is not responding. Please log in again.') {
                $state.transitionTo('login');
                $uibModalInstance.close();
                sessionStorage.clear();
                localStorage.clear();
                localStorage.setItem("isLogout", "1");
            } else {
                $uibModalInstance.close();
            }

        };

    }
]);