app.config([
    '$stateProvider',
    '$urlRouterProvider',
    'toastrConfig',
    '$interpolateProvider',
    '$locationProvider',
    '$httpProvider',
    '$compileProvider',
    'KeepaliveProvider',
    'IdleProvider',
    function ($stateProvider, $urlRouterProvider, toastrConfig, $interpolateProvider, $locationProvider, $httpProvider, $compileProvider, KeepaliveProvider, IdleProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        angular.extend(toastrConfig, {positionClass: 'toast-top-center'});

        IdleProvider.idle(30 * 60); // 30 minutes idle
        IdleProvider.timeout(30); // after 30 seconds idle, time the user out
        KeepaliveProvider.interval(60 * 60); // 60 minute keep-alive ping

        var onlyLoggedIn = function ($location, $q, $rootScope) {
            var deferred = $q.defer();

            if (sessionStorage.isAuthenticated) {
                deferred.resolve();
            } else {
                if ($location.path() != null && $location.path() != '') {
                    var currentPath = $location
                        .path()
                        .split("/");

                    if (currentPath[1] == 'humanExpert') {
                        deferred.reject();
                        $location.path('/humanExpertLogin');
                    }

                    if (currentPath[1] == 'insuredPage') {
                        deferred.reject();
                        $location.path('/login');
                    }
                    if (currentPath[1] == 'inspectionPage') {
                        deferred.reject();
                        $location.path('/login');
                    }

                    var clientId = currentPath[2];
                    var accessToken = currentPath[3];
                    var userType = currentPath[4];
                    var page = currentPath[5];
                    var userName = currentPath[6];
                    var siteID = currentPath[7];
                    var InspectionType = currentPath[8];
                    var randomNumber = currentPath[9];
                    var userId = currentPath[10];
                    var refreshToken = currentPath[11];
                    var siteLocation = currentPath[12];
                    var siteName = currentPath[13];
                    var IsDevice = currentPath[14];

                    siteLocation = siteLocation == '0'? '': siteLocation;
                    siteName = siteName == '0'? '': siteName;

                    if (clientId != 'clientId' && clientId != undefined && accessToken != 'accessToken' && accessToken != undefined && userType != 'userType' && userType != undefined && page != 'page' && page != undefined && userName != 'userName' && userName != undefined && siteID != 'siteID' && siteID != undefined && refreshToken != 'refreshToken' && refreshToken != undefined && siteLocation != 'siteLocation' && siteLocation != undefined && siteName != 'siteName' && siteName != undefined && IsDevice != undefined) {
                        if (page != 0) {
                            sessionStorage.wizardStepNo = page;
                        }
                        if (userType && userType.toLowerCase() == 'inspector') {
                            sessionStorage.siteId = siteID;
                            sessionStorage.siteLocation = siteLocation;
                            sessionStorage.siteName = siteName;
                        }

                        if (InspectionType == 'Windshield' && sessionStorage.wizardStepNo != undefined && sessionStorage.wizardStepNo != null) {
                            sessionStorage.WinshieldID = clientId;
                        } else {

                            if (InspectionType == 'Pre-Inspection' && sessionStorage.wizardStepNo != undefined && sessionStorage.wizardStepNo != null) {

                                if (userType == 'Insured') {
                                    sessionStorage.formId = clientId;
                                } else {
                                    sessionStorage.clientID = clientId;
                                }
                            }

                        }

                        sessionStorage.userDispalyName = userName
                        sessionStorage.isAuthenticated = true;
                        sessionStorage.accessToken = accessToken;
                        sessionStorage.userType = userType;
                        sessionStorage.InspectionType = InspectionType;
                        sessionStorage.randomNumber = randomNumber;
                        sessionStorage.userId = userId;
                        sessionStorage.refreshToken = refreshToken;
                        sessionStorage.IsDevice = IsDevice;

                        deferred.resolve();
                    }
                } else {
                    deferred.reject();
                    $location.path('/login');
                }
            }
            return deferred.promise;
        };

        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('home', {
            url: '/home/:clientId/:accessToken/:userType/:page/:userName/:siteID/:InspectionType/:' +
                    'randomNumber/:userId/:refreshToken/:siteLocation/:siteName/:IsDevice',
            templateUrl: 'rest/app/client/views/main-page.html',
            controller: 'main-page',
            resolve: {
                loggedIn: onlyLoggedIn
            }
        })
            .state('windshield', {
                url: '/windshield/:clientId/:accessToken/:userType/:page/:userName/:siteID/:Inspection' +
                        'Type/:randomNumber/:userId/:refreshToken/:siteLocation/:siteName/:IsDevice',
                templateUrl: 'rest/app/client/views/main-page.html',
                controller: 'main-page',
                resolve: {
                    loggedIn: onlyLoggedIn
                }
            })

            // pdf download for mobile view
            .state('downloadMobilePdf', {url: '/downloadMobilePdf/:reportNumber/:accessToken/:refreshToken'})

            // pdf view  for mobile view
            .state('viewMobilePdf', {url: '/viewMobilePdf/:reportNumber/:accessToken/:refreshToken'})

            // insured dashbord for mobile view
            .state('dashboardInsured', {url: '/dashboardInsured/:accessToken/:refreshToken'})

            // inspector dashbord for mobile view
            .state('dashboard', {url: '/dashboard/:accessToken/:refreshToken'})

            // login
            .state('login', {
                url: '/login',
                templateUrl: 'rest/app/client/components/login/login.view.html',
                controller: 'LoginController'
            })
            // login Redirected
            .state('loginRedirected', {
                url: '/login/redirected',
                templateUrl: 'rest/app/client/components/login/login.view.html',
                controller: 'LoginController'
            })

            // Auth VIN Redirected
            .state('VINRedirected', {
                url: '/VINRedirected',
                templateUrl: 'rest/app/client/components/PDFView-AuthVIN/PDFView-AuthVIN.view.html',
                controller: 'PDFViewAuthVINController'
            })

            // Human expert login
            .state('humanExpertLogin', {
                url: '/humanExpertLogin',
                templateUrl: 'rest/app/client/human-expert-components/HA-login/HA-login.view.html',
                controller: 'HALoginController'
            })
            .state('humanExpert', {
                url: '/humanExpert',
                templateUrl: 'rest/app/client/human-expert-components/HE-landingPage/HE-landingPage.view.html',
                controller: 'HALandingPageController',
                resolve: {
                    loggedIn: onlyLoggedIn
                }
            })
            .state('humanExpert.queueList', {
                url: '/queueList',
                templateUrl: 'rest/app/client/human-expert-components/HE-queueList/HE-queueList.view.html',
                controller: 'HAQueueListController'
            })
            // // register
            .state('register', {
                url: '/register',
                templateUrl: 'rest/app/client/components/register/register.view.html',
                controller: 'RegisterController'
            })

            // Forgot Password
            .state('forgotPassword', {
                url: '/forgot-password',
                templateUrl: 'rest/app/client/components/forgotPassword/forgotPassword.view.html',
                controller: 'ForgotPasswordController'
            })

            // Reset Password
            .state('resetPassword', {
                url: '/reset-password',
                templateUrl: 'rest/app/client/components/resetPassword/resetPassword.view.html',
                controller: 'ResetPasswordController'

            })

            // pdfView
            .state('pdfView', {
                url: '/pdfView',
                templateUrl: 'rest/app/client/components/pdfView/pdfView.view.html',
                controller: 'PdfViewController',
                resolve: {
                    loggedIn: onlyLoggedIn
                }
            })

            // Inspector
            .state('inspectionPage', {
                url: '/inspectionPage',
                templateUrl: 'rest/app/client/components/inspectionPage/inspectionPage.view.html',
                controller: 'InspectionPageController',
                resolve: {
                    loggedIn: onlyLoggedIn
                }
            })
            .state('insuredPage', {
                url: '/insuredPage',
                templateUrl: 'rest/app/client/components/insuredPage/insuredPage.view.html',
                controller: 'insuredPageController',
                resolve: {
                    loggedIn: onlyLoggedIn
                }
            })

            // insuredPage.newInspection
            .state('insuredPage.newInspection', {
                url: '/newInspection',
                templateUrl: 'rest/app/client/components/new-inspection/new-inspection.view.html',
                controller: 'newInspectionController'
            })

            // insuredPage.dashboardInsured
            .state('insuredPage.dashboardInsured', {
                url: '/dashboardInsured',
                templateUrl: 'rest/app/client/components/dashboard.Insured/dashboard.Insured.view.html',
                controller: 'DashboardInsuredController'
            })

            // insuredPage FAQ
            .state('insuredPage.FAQ', {
                url: '/FAQ',
                templateUrl: 'rest/app/client/components/FAQ/FAQ.view.html',
                controller: 'FAQController'
            })
            .state('insuredPage.FAQ.preInsuranceFAQ', {
                url: '/preInsuranceFAQ',
                templateUrl: 'rest/app/client/components/FAQ-preInsurance/FAQ-preInsurance.view.html',
                controller: 'preInsuranceFAQController'
            })
            .state('insuredPage.FAQ.windshieldFAQ', {
                url: '/windshieldFAQ',
                templateUrl: 'rest/app/client/components/FAQ-windshield/FAQ-windshield.view.html',
                controller: 'windshieldFAQController'
            })

            // inspectionPage FAQ
            .state('inspectionPage.FAQ', {
                url: '/FAQ',
                templateUrl: 'rest/app/client/components/FAQ/FAQ.view.html',
                controller: 'FAQController'
            })
            .state('inspectionPage.FAQ.preInsuranceFAQ', {
                url: '/preInsuranceFAQ',
                templateUrl: 'rest/app/client/components/FAQ-preInsurance/FAQ-preInsurance.view.html',
                controller: 'preInsuranceFAQController'
            })
            .state('inspectionPage.FAQ.windshieldFAQ', {
                url: '/windshieldFAQ',
                templateUrl: 'rest/app/client/components/FAQ-windshield/FAQ-windshield.view.html',
                controller: 'windshieldFAQController'
            })

            // profile
            .state('insuredPage.profile', {
                url: '/profile',
                templateUrl: 'rest/app/client/components/profile/profile.view.html',
                controller: 'ProfileController'
            })

            // profile
            .state('insuredPage.editProfile', {
                url: '/editProfile',
                templateUrl: 'rest/app/client/components/edit-profile/edit-profile.view.html',
                controller: 'editProfileController'
            })
            .state('insuredPage.UploadPhoto', {
                url: '/UploadPhoto',
                templateUrl: 'rest/app/client/components/UploadPhoto/UploadPhoto.view.html',
                controller: 'uploadPhotoController'
            })
            .state('insuredPage.UploadPhoto.damagePhoto', {
                url: '/damagePhoto',
                templateUrl: 'rest/app/client/components/damagePhoto/damagePhoto.view.html',
                controller: 'damagePhotoController'
            })
            .state('insuredPage.UploadPhoto.frontAndDriverSidePhotos', {
                url: '/frontAndDriverSidePhotos',
                templateUrl: 'rest/app/client/components/frontAndDriverSidePhotos/frontAndDriverSidePhotos.vie' +
                        'w.html',
                controller: 'frontAndDriverSidePhotosController'
            })
            .state('insuredPage.UploadPhoto.rearAndPassengerSidePhotos', {
                url: '/rearAndPassengerSidePhotos',
                templateUrl: 'rest/app/client/components/rearAndPassengerSidePhotos/rearAndPassengerSidePhotos' +
                        '.view.html',
                controller: 'rearAndPassengerSidePhotosController'
            })
            .state('insuredPage.UploadPhoto.EPAStickerPhotos', {
                url: '/EPAStickerPhotos',
                templateUrl: 'rest/app/client/components/EPAStickerPhotos/EPAStickerPhotos.view.html',
                controller: 'EPAStickerPhotosController'
            })

            //windshieldUploadPhotoController
            .state('insuredPage.WindshieldUploadPhoto', {
                url: '/WindshieldUploadPhoto',
                templateUrl: 'rest/app/client/components/windshield-uploadPhoto/windshield-uploadPhoto.view.ht' +
                        'ml',
                controller: 'windshieldUploadPhotoController'
            })
            .state('insuredPage.WindshieldUploadPhoto.damagePhoto', {
                url: '/windshieldDamagePhoto',
                templateUrl: 'rest/app/client/components/Windshield-damagePhoto/Windshield-damagePhoto.view.ht' +
                        'ml',
                controller: 'windshieldDamagePhotoController'
            })
            .state('insuredPage.WindshieldUploadPhoto.fullPhoto', {
                url: '/fullPhoto',
                templateUrl: 'rest/app/client/components/Windshield-fullPhoto/Windshield-fullPhoto.view.html',
                controller: 'windshieldFullPhotoController'
            })
            //windshieldUploadPhotoInspectorController
            .state('inspectionPage.WindshieldUploadPhotoInspector', {
                url: '/WindshieldUploadPhotoInspector',
                templateUrl: 'rest/app/client/components/windshield-uploadPhotoInspector/windshield-uploadPhot' +
                        'oInspector.view.html',
                controller: 'windshieldUploadPhotoInspectorController'
            })
            .state('inspectionPage.WindshieldUploadPhotoInspector.damagePhoto', {
                url: '/windshieldDamagePhoto',
                templateUrl: 'rest/app/client/components/Windshield-damagePhoto/Windshield-damagePhoto.view.ht' +
                        'ml',
                controller: 'windshieldDamagePhotoController'
            })
            .state('inspectionPage.WindshieldUploadPhotoInspector.fullPhoto', {
                url: '/fullPhoto',
                templateUrl: 'rest/app/client/components/Windshield-fullPhoto/Windshield-fullPhoto.view.html',
                controller: 'windshieldFullPhotoController'
            })
            // Dashboard
            .state('inspectionPage.dashboard', {
                url: '/dashboard',
                templateUrl: 'rest/app/client/components/dashboard/dashboard.view.html',
                controller: 'DashboardController'
            })

            // inspectionPage.newInspection
            .state('inspectionPage.newInspection', {
                url: '/newInspection',
                templateUrl: 'rest/app/client/components/new-inspection/new-inspection.view.html',
                controller: 'newInspectionController'
            })

            // profile
            .state('inspectionPage.profile', {
                url: '/profile',
                templateUrl: 'rest/app/client/components/profile/profile.view.html',
                controller: 'ProfileController'
            })

            // profile
            .state('inspectionPage.editProfile', {
                url: '/editProfile',
                templateUrl: 'rest/app/client/components/edit-profile/edit-profile.view.html',
                controller: 'editProfileController'
            })

            //inspectionPage.QRRetake
            .state('inspectionPage.QRRetake', {
                url: '/QRRetake',
                templateUrl: 'rest/app/client/components/QRRetake/QRRetake.view.html',
                controller: 'QRRetakeController'
            })
            .state('inspectionPage.QRRetake.damagePhoto', {
                url: '/damagePhoto',
                templateUrl: 'rest/app/client/components/damagePhoto/damagePhoto.view.html',
                controller: 'damagePhotoController'
            })
            .state('inspectionPage.QRRetake.frontAndDriverSidePhotos', {
                url: '/frontAndDriverSidePhotos',
                templateUrl: 'rest/app/client/components/frontAndDriverSidePhotos/frontAndDriverSidePhotos.vie' +
                        'w.html',
                controller: 'frontAndDriverSidePhotosController'
            })
            .state('inspectionPage.QRRetake.rearAndPassengerSidePhotos', {
                url: '/rearAndPassengerSidePhotos',
                templateUrl: 'rest/app/client/components/rearAndPassengerSidePhotos/rearAndPassengerSidePhotos' +
                        '.view.html',
                controller: 'rearAndPassengerSidePhotosController'
            })
            .state('inspectionPage.QRRetake.EPAStickerPhotos', {
                url: '/EPAStickerPhotos',
                templateUrl: 'rest/app/client/components/EPAStickerPhotos/EPAStickerPhotos.view.html',
                controller: 'EPAStickerPhotosController'
            })

            //wind QRRetake
            .state('inspectionPage.WindshieldQRRetake', {
                url: '/WindshieldQRRetake',
                templateUrl: 'rest/app/client/components/windshield-QRRetake/windshield-QRRetake.view.html',
                controller: 'windshieldQRRetakeController'
            })
            .state('inspectionPage.WindshieldQRRetake.damagePhoto', {
                url: '/windshieldDamagePhoto',
                templateUrl: 'rest/app/client/components/Windshield-damagePhoto/Windshield-damagePhoto.view.ht' +
                        'ml',
                controller: 'windshieldDamagePhotoController'
            })

            //uploadPhotoInspector
            .state('inspectionPage.uploadPhotoInspector', {
                url: '/uploadPhotoInspector',
                templateUrl: 'rest/app/client/components/uploadPhotoInspector/uploadPhotoInspector.view.html',
                controller: 'uploadPhotoInspectorController'
            })
            .state('inspectionPage.uploadPhotoInspector.damagePhoto', {
                url: '/damagePhoto',
                templateUrl: 'rest/app/client/components/damagePhoto/damagePhoto.view.html',
                controller: 'damagePhotoController'
            })
            .state('inspectionPage.uploadPhotoInspector.frontAndDriverSidePhotos', {
                url: '/frontAndDriverSidePhotos',
                templateUrl: 'rest/app/client/components/frontAndDriverSidePhotos/frontAndDriverSidePhotos.vie' +
                        'w.html',
                controller: 'frontAndDriverSidePhotosController'
            })
            .state('inspectionPage.uploadPhotoInspector.rearAndPassengerSidePhotos', {
                url: '/rearAndPassengerSidePhotos',
                templateUrl: 'rest/app/client/components/rearAndPassengerSidePhotos/rearAndPassengerSidePhotos' +
                        '.view.html',
                controller: 'rearAndPassengerSidePhotosController'
            })
            .state('inspectionPage.uploadPhotoInspector.EPAStickerPhotos', {
                url: '/EPAStickerPhotos',
                templateUrl: 'rest/app/client/components/EPAStickerPhotos/EPAStickerPhotos.view.html',
                controller: 'EPAStickerPhotosController'
            })

    }

]);
