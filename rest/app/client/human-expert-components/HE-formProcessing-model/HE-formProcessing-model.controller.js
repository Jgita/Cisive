app.controller('HE-formProcessingController', [
    '$scope',
    '$uibModalInstance',
    '$state',
    'items',
    function ($scope, $uibModalInstance, $state, items) {

        // $scope.ok = function () {     localStorage.clear(); sessionStorage.clear();
        // $uibModalInstance.close(); $state.transitionTo('humanExpertLogin'); };

        $scope.modelBody = items;
        $scope.ok = function () {
            if ($scope.modelBody == 'It seems server is not responding, Please try after some time.') {
                localStorage.clear();
                sessionStorage.clear();
                $uibModalInstance.close();
                $state.transitionTo('humanExpertLogin');
            } else {
                localStorage.clear();
                sessionStorage.clear();
                $uibModalInstance.close();
                $state.transitionTo('humanExpertLogin');
            }

        };
    }
]);
