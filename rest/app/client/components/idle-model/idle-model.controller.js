app
    .controller('idleModelController', ['$scope', 'Idle', '$state', 'Keepalive', '$css', function ($scope, Idle, $state, Keepalive, $css) {

        $css.bind({
            href: 'rest/app/client/components/alert-model/alert-model.css'
        }, $scope);

    }]);