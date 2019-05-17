app
    .directive('autoFillSync', function ($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, model) {
                var origVal = elem.val();
                $timeout(function () {
                    var newVal = elem.val();
                    if (model.$pristine && origVal !== newVal) {
                        model.$setViewValue(newVal);
                    }
                }, 500);
            }
        };
    });