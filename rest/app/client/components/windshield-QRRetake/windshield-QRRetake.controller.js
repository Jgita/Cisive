app
    .controller('windshieldQRRetakeController', ['$scope', '$state', '$css', function ($scope, $state, $css) {

        $css.bind({
            href: 'rest/app/client/components/uploadPhoto/uploadPhoto.css'
        }, $scope);

    }])