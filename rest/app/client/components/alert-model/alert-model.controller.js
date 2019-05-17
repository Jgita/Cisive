app.controller('alertModelController', [
    '$scope',
    '$css',
    '$uibModalInstance',
    '$rootScope',
    function ($scope, $css, $uibModalInstance, $rootScope) {

        $css.bind({
            href: 'rest/app/client/components/alert-model/alert-model.css'
        }, $scope);

        $rootScope.ok = function () {
            $uibModalInstance.close();
        };
    }
]);