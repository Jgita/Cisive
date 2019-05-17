app.controller('FAQController', [
    '$scope',
    '$css',
    '$rootScope',
    '$timeout',
    function ($scope, $css, $rootScope, $timeout) {

        $css.bind({
            href: 'rest/app/client/components/FAQ/FAQ.css'
        }, $scope);

        $rootScope.isProced = false;

        if (sessionStorage.userType && sessionStorage.userType.toLowerCase() == 'insured') {
            $rootScope.$broadcast('FAQ', true);
            $scope.faqTab = {
                'preInsuranceFAQ': {
                    id: '1',
                    title: 'Pre-Insurance',
                    route: 'insuredPage.FAQ.preInsuranceFAQ'
                },
                'windshieldFAQ': {
                    id: '2',
                    title: 'Windshield',
                    route: 'insuredPage.FAQ.windshieldFAQ'
                }
            };

        } else {

            $timeout(function () {
                $rootScope.$broadcast('InspectorFAQ', true);
            },100);

            $scope.faqTab = {
                'preInsuranceFAQ': {
                    id: '1',
                    title: 'Pre-Insurance',
                    route: 'inspectionPage.FAQ.preInsuranceFAQ'
                },
                'windshieldFAQ': {
                    id: '2',
                    title: 'Windshield',
                    route: 'inspectionPage.FAQ.windshieldFAQ'
                }
            };
        }

        $rootScope.sessionLogout();
    }
]);