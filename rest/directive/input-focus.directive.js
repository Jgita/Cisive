app
    .directive('placeholder', function () {
        return {
            restrict: 'A',
            scope: {},
            controller: 'placeholderCtrl',
            bindToContrller: true,
            controllerAs: 'placeholder',
            link: function (scope, element, attr) {
                
                if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
                    $(document).on('focus', 'input, textarea, select', function () {
                        $("header").css({
                            position: "absolute",
                            top: 0,
                            left: 0
                        })
                        $("#main_content .steps-indicator").css({
                            position: "absolute",
                            top: $("header").height(),
                            left: 0
                        })
                    });

                    $(document).on('blur', 'input, textarea, select', function () {
                        $("header, #toast-container").css({
                            position: "fixed"
                        })   
                        $("#main_content .steps-indicator").css({
                            position:"fixed",
                            top: $("header").height()
                        })                
                    });
                }
                
                var placeholder;
                element.on('focus', function (event) {
                    placeholder = attr.placeholder;

                    setTimeout(function () {
                        element.removeAttr('placeholder');
                        scope.$digest();
                    }, 100);

                });
                element.on('blur', function (event) {

                    setTimeout(function () {
                        element.attr('placeholder', placeholder);
                        scope.$digest();
                    }, 100);

                })

                //on backspace down + optional callback
                function onBackspace(e, callback) {
                    var key;
                    if (typeof e.keyIdentifier !== "undefined") {
                        key = e.keyIdentifier;

                    } else if (typeof e.keyCode !== "undefined") {
                        key = e.keyCode;
                    }
                    if (key === 'U+0008' || key === 'Backspace' || key === 8) {
                        if (typeof callback === "function") {
                            callback();
                        }
                        return true;
                    }
                    return false;
                }

                window
                    .addEventListener('keydown', function (e) {

                        switch (e.target.tagName.toLowerCase()) {
                            case "input":
                            case "textarea":
                                break;
                            case "body":
                                onBackspace(e, function () {
                                    e.preventDefault();
                                });

                                break;
                        }
                    }, true);

                var regx = /INPUT|SELECT|TEXTAREA/i;

                $(document).bind("keydown keypress", function (e) {
                    if (e.which == 8) { // 8 == backspace
                        if (!regx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                            e.preventDefault();
                        }
                    }
                });

            }
        }
    })
    .controller('placeholderCtrl', function () {});
