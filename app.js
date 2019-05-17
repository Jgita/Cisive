var app = angular.module('carco', [
    'ui.router',
    'ngAnimate',
    'ngMessages',
    'ui.bootstrap',
    'ngCookies',
    'ngTouch',
    'mgo-angular-wizard',
    'angular-button-spinner',
    'angularCSS',
    'signature',
    'ngResource',
    'datatables',
    'angularFileUpload',
    'angular-popover',
    'toastr',
    'base64',
    'pdfjsViewer',
    'ngImageAppear',
    'angularUtils.directives.dirPagination',
    'vcRecaptcha',
    'ngIdle',
    'ngSanitize'
]);

app.constant('_', window._);
app.constant('CONSTANTS', CONSTANTS);
