var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "ngMessages",
    "oc.lazyLoad",
    "ngSanitize",
    "ngTagsInput"
])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $rootScope.title = toState.title;
            event.targetScope.$watch('$viewContentLoaded', function () {
                angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);
            });
        });
    }]);

MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    $controllerProvider.allowGlobals();
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout3',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);
MetronicApp.controller('PageHeadController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        // Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            //QuickSidebar.init(); // init quick sidebar
        }, 2000);
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        //  Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$compileProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $compileProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('core/login');
    $stateProvider
        //app
        .state('app', {
            abstract: true,
            url: '/app',
            controller: 'HeaderController',
            templateUrl: 'scripts/views/app.html',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'scripts/services/angular-cookies.min.js',
                            'scripts/services/logout.factory.js',
                            'assets/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
                            'scripts/controllers/HeaderController.js',
                        ]
                    });
                }]
            }
        })
        //app core pages (errors, login,signup)
        .state('core', {
            abstract: true,
            url: '/core',
            template: '<div ui-view></div>',
        })
        //login
        .state('core.login', {
            url: '/login',
            controller: 'UserCtrl',
            templateUrl: 'scripts/views/user/login.html',
            title: 'Login',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'assets/pages/css/login.min.css',
                            'scripts/services/angular-cookies.min.js',
                            'scripts/controllers/user/user.controller.js',
                        ]
                    });
                }]
            }
        })
        .state('app.admin', {
            url: '/admin',
            controller: 'AdminCtrl',
            templateUrl: 'scripts/views/admin/admin.page.html',
            title: 'Admin Page',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'scripts/controllers/admin/admin.controller.js',
                        ]
                    });
                }]
            }
        })
        .state('app.incident', {
            url: '/incident/:pageNum',
            controller: 'IncidentCtrl',
            templateUrl: 'scripts/views/incident/incident.page.html',
            title: 'Incident Page',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'scripts/controllers/incident/incident.controller.js',
                        ]
                    });
                }]
            }
        })
        .state('app.jobQueue', {
            url: '/jobQueue',
            controller: 'JobQueueCtrl',
            templateUrl: 'scripts/views/jobQueue/jobQueue.page.html',
            title: 'Job Queue Page',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'scripts/controllers/jobQueue/jobQueue.controller.js',
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$modal", function ($rootScope, settings, $state, $modal) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    $rootScope.openModal = function(message){
        $modal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            size:'large',
            controller: 'MessageModalCtrl',
            resolve:{
                message:function(){
                    return message;
                }
            }

        });
    }

}]);

MetronicApp.controller('MessageModalCtrl',
    function($state, $scope, $modalInstance,message) {
        $scope.message = message;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
    })


Array.prototype.sortOn = function(on, desc){
    this.sort(srt(on, desc));
}


function srt(on,descending) {
    on = on && on.constructor === Object ? on : {};
    return function(a,b){
        if (on.string || on.key) {
            a = on.key ? a[on.key] : a;
            a = on.string ? String(a).toLowerCase() : a;
            b = on.key ? b[on.key] : b;
            b = on.string ? String(b).toLowerCase() : b;
            // if key is not present, move to the end
            if (on.key && (!b || !a)) {
                return !a && !b ? 1 : !a ? 1 : -1;
            }
        }
        return descending ? ~~(on.string ? b.localeCompare(a) : a < b)
            : ~~(on.string ? a.localeCompare(b) : a > b);
    };
}

Array.prototype.remove = function(iterator) {
    for (var i = this.length; i >= 0; i--) {
        if (iterator && iterator(this[i]))
            this.splice(i, 1);
    }
}

