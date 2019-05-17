app
    .directive('phoneInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element
                        .val()
                        .replace(/[^0-9]/g, '');
                    $element.val($filter('tel')(value, false));
                };
                // This runs when we update the text field
                ngModelCtrl
                    .$parsers
                    .push(function (viewValue) {
                        return viewValue
                            .replace(/[^0-9]/g, '')
                            .slice(0, 10);
                    });

                // This runs when the model gets updated on the scope directly and keeps our
                // view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    // var key = event.keyCode;
                    $scope.key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do
                    // nothing. This lets us support copy and paste too
                    if ($scope.key == 91 || (15 < $scope.key && $scope.key < 19) || (37 <= $scope.key && $scope.key <= 40)) {
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    setTimeout(function () {
                        $scope.pastedText = $element.val();
                        if ($scope.pastedText.length == 14) {
                            ngModelCtrl.$setValidity('phoneInput', true);
                            return $scope.pastedText;
                        } else if ($scope.pastedText.length != 14) {
                            ngModelCtrl.$setValidity('phoneInput', false);
                            return false;
                        }
                        $scope.$apply();
                    }, 5);
                    $browser.defer(listener);
                });

                ngModelCtrl
                    .$parsers
                    .unshift(function (phoneText) {

                        phoneText = phoneText.trim();
                        var testPhnNo = phoneText.search(/[a-zA-Z]+/);

                        testPhnNo = testPhnNo > 0
                            ? true
                            : false;

                        if (phoneText == '(000) 000-0000' || phoneText == '0000000000') {
                            ngModelCtrl.$setValidity('phoneInput', false);
                            return false;
                        } else if ($scope.key == undefined) {

                            if (phoneText.length >= 10) {
                                ngModelCtrl.$setValidity('phoneInput', true);
                                return phoneText;
                            } else if (phoneText.length < 10) {
                                ngModelCtrl.$setValidity('phoneInput', false);
                                return false;
                            }

                        } else if (phoneText && phoneText.length == 14 || phoneText == '' || phoneText == '(') {
                            if (testPhnNo) {

                                ngModelCtrl.$setValidity('phoneInput', false);

                                return undefined;

                            }

                            ngModelCtrl.$setValidity('phoneInput', true);

                            return phoneText;

                        } else {

                            if (phoneText.length < 14) {

                                ngModelCtrl.$setValidity('phoneInput', false);
                                return undefined;

                            } else {

                                return phoneText;

                            }

                        }

                    });
            }

        };
    });

app.filter('tel', function () {
    return function (tel) {

        if (!tel) {
            return '';
        }

        var value = tel
            .toString()
            .trim()
            .replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country,
            city,
            number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if (number) {
            if (number.length > 3) {
                number = number.slice(0, 3) + '-' + number.slice(3, 7);
            } else {
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        } else {
            return "(" + city;
        }

    };
});