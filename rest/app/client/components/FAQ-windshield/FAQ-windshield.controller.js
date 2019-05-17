app.controller('windshieldFAQController', [
    '$scope',
    '$css',
    '$rootScope',
    function ($scope, $css, $rootScope) {

        $css.bind({
            href: 'rest/app/client/components/FAQ/FAQ.css'
        }, $scope);

        $rootScope.sessionLogout();
    }
]);