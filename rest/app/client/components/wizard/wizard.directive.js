app
    .directive('wizardApp', ['$rootScope', function ($rootScope) {

        return {
            restrict: "E",
            templateUrl: "rest/app/client/components/wizard/wizard.view.html",
            link: function ($scope, $elem, $attr, $q, $timeout, WizardHandler) {

                $scope.inspectionType = sessionStorage.InspectionType;

                $scope.canExit = true;
                $scope.stepActive = true;

                $scope.finished = function () {

                };
                $scope.logStep = function (insuredInfo) {

                };
                $scope.goBack = function (number) {
                    WizardHandler
                        .wizard()
                        .goTo(0);

                };

                $scope.exitWithAPromise = function () {
                    var d = $q.defer();
                    $timeout(function () {
                        d.resolve(true);
                    }, 1000);
                    return d.promise;
                };
                $scope.exitToggle = function () {
                    $scope.canExit = !$scope.canExit;
                };
                $scope.stepToggle = function () {
                    $scope.stepActive = !$scope.stepActive;
                };
                $scope.exitValidation = function () {
                    return $scope.canExit;
                };
            }
        };

    }]);