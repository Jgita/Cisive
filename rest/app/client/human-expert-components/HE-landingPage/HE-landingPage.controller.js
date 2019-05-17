app
    .controller('HALandingPageController', ['$scope', '$css', '$rootScope', function ($scope, $css, $rootScope) {

        $css.bind({
            href: 'rest/app/client/components/header-content/header-content.css'
        }, $scope);

        $rootScope.logoutExecute = false;
        $scope.welcomeDropDown = {

            'Logout': {
                id: 'item3',
                title: 'Logout',
                faClass: 'fa-power-off',
                route: 'humanExpertLogin'
            }
        }

        $scope.onSubmit = function (title) {
            if (title && title.toLowerCase() === 'logout') {

                $rootScope.logoutExecute = true;
                sessionStorage.clear();
            }
        }
        $scope.FirstNameToDispaly = sessionStorage.FirstNameToDispaly;
        $scope.LastNameToDispaly = sessionStorage.LastNameToDispaly;

    }]);