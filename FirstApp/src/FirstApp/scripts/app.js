var Controllers = angular.module('Controllers', []);
var Services = angular.module('Services', []);
var Register = angular.module('Register', []);

angular.module('BasicHttpAuthExample', [
    'Controllers',
    'Services',
    'Register',
    'ngRoute',
    'ngCookies',
    'ui.router'
])

.config(['$sceDelegateProvider', '$stateProvider', '$urlRouterProvider',
        function ($sceDelegateProvider, $stateProvider, $urlRouterProvider) {

            $stateProvider
                // Home
                .state('external', {
                    abstract: true,
                    templateUrl: 'views/homelayout/homelayout.html'
                })
                .state('external.home', {
                    url: '/',
                    templateUrl: 'views/home/home.html',
                    controller: 'HomeController'
                })
                  .state('external.login', {
                      url: '/login',
                      templateUrl: 'views/login/login.html',
                      controller: 'loginController'
                  })
                  .state('external.register', {
                      url: '/register',
                      templateUrl: 'views/register/register.html',
                      controller: 'registerController'
                  })
                .state('innerlayout', {
                    abstract: true,
                    templateUrl: 'views/innerlayout/innerlayout.html'
                })
                .state('innerlayout.about', {
                    url: '/about',
                    templateUrl: 'views/about/about.html',
                    controller: 'aboutController'
                })
                 .state('innerlayout.services', {
                     url: '/services',
                     templateUrl: 'views/services/services.html',
                     controller: 'servicesController'
                 })
                 .state('innerlayout.careers', {
                     url: '/careers',
                     templateUrl: 'views/careers/careers.html',
                     controller: 'careersController'
                 })
                  .state('innerlayout.blog', {
                      url: '/blog',
                      templateUrl: 'views/blog/blog.html',
                      controller: 'blogController'
                  })
                 
            .state('register', {
                url: '/register',
                templateUrl: 'views/register/register.html',
                controller: 'registerController'
            });
            $urlRouterProvider.otherwise('/');
            //$routeProvider 
            //    .when('/login', {
            //        controller: 'LoginController',
            //        templateUrl: 'views/authentication/login.html',
            //        hideMenus: true
            //    })
            //     .when('/register', {
            //         controller: 'registerController',
            //         templateUrl: 'views/register/register.html'
            //     })
            //    .when('/', {
            //        controller: 'HomeController',
            //        templateUrl: 'views/home/home.html'
            //    })


            //    .otherwise({ redirectTo: '/login' });
        }])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        if ($location.path() === '/') {
            $rootScope.classname = "home";
        }
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            //    // redirect to login page if not logged in
            //    if ($location.path() !== '/register'&& $location.path() !== '/login' && !$rootScope.globals.currentUser) {
            //        $location.path('/login');
            //    }
            $rootScope.page = $location.path();
        });
    }]);