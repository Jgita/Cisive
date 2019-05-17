app
    .controller('PhotoViewModelController', ['$scope', 'items', '$css', '$uibModalInstance','$rootScope', function ($scope, items, $css, $uibModalInstance,$rootScope) {

        $css.bind({
            href: 'rest/app/client/components/PhotoView-model/PhotoView-model.css'
        }, $scope);

        $scope.close = function () {
            $uibModalInstance.close();
        }

        $scope.photoLoad = items;
        if ($scope.photoLoad.PHOTO_TYPE == 'EPASTICKER') {
            $scope.PhotoBase64 = $scope.photoLoad.EPA_STICKER;
            $scope.photoName = $scope.photoLoad.PHOTO_NAME;
            $scope.photoType = 'EPA STICKER';
        } else if ($scope.photoLoad.WIN_PHOTO_TYPE == 'WIN_DAMAGE') {
            $scope.PhotoBase64 = $scope.photoLoad.WIN_PHOTO;
            $scope.photoName = $scope.photoLoad.WIN_PHOTO_NAME;
            $scope.photoType = 'WINDSHIELD DAMAGE';
        } else if ($scope.photoLoad.WIN_PHOTO_TYPE == 'WIN_FULL_PHOTO') {
            $scope.PhotoBase64 = $scope.photoLoad.WIN_PHOTO;
            $scope.photoName = $scope.photoLoad.WIN_PHOTO_NAME;
            $scope.photoType = 'FULL WINDSHIELD';
        } else if ($scope.photoLoad.PHOTO_TYPE == 'QCR') {
            $scope.PhotoBase64 = $scope.photoLoad.PHOTO;
            $scope.photoName = $scope.photoLoad.PHOTO_NAME;
            $scope.photoType = 'REAR';
        } else if ($scope.photoLoad.PHOTO_TYPE == 'QCF') {
            $scope.PhotoBase64 = $scope.photoLoad.PHOTO;
            $scope.photoName = $scope.photoLoad.PHOTO_NAME;
            $scope.photoType = 'FRONT';
        } else if ($scope.photoLoad.PHOTO_TYPE == 'QCEPA') {
            $scope.PhotoBase64 = $scope.photoLoad.EPA_STICKER;
            $scope.photoName = $scope.photoLoad.PHOTO_NAME;
            $scope.photoType = 'EPA STICKER';
        } else {
            $scope.PhotoBase64 = $scope.photoLoad.PHOTO;
            $scope.photoName = $scope.photoLoad.PHOTO_NAME;
            $scope.photoType = $scope.photoLoad.PHOTO_TYPE;
        }
        var stateCode =$rootScope.stateCode ||sessionStorage.siteId.substring(0, 2).toUpperCase();
        
        if($scope.photoType.toLowerCase() == "front"  ){
            $scope.photoType = stateCode == "MA"? "Front and Passenger Side":"Front and Driver Side";
        } else if($scope.photoType.toLowerCase() == "rear" ) {
            $scope.photoType = stateCode == "MA"? "Rear and Driver Side":"Rear and Passenger Side";
        }
        
    }])