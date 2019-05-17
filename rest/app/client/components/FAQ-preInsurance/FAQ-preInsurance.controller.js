app.controller('preInsuranceFAQController', [
    '$scope',
    '$css',
    function ($scope, $css) {

        $css.bind({
            href: 'rest/app/client/components/FAQ/FAQ.css'
        }, $scope);

    }
]);