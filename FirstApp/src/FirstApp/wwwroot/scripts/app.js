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
var options = {
    baseURL: '',
    debug: true,
    isApp: false
};

/* Setup the Config from the default Options */
Services.factory('$config', function () {
    return {
        /* App Version */
        version: '1.0.0',
        isApp: options.isApp,

        /* Url's for the App */
        baseURL: options.baseURL,
        host: 'http://25.0.0.12:8089/',
        serviceURL: 'http://25.0.0.12:8089/api/',
       
        /* Storage Timeout */
        expire: (60 * 60 * 1000),

        /* Auth */
        userExpire: (24 * 60 * 60 * 1000),
        
        /* Debugging and Logging */
        debug: options.debug,
        log: function () {
            this.debug && console.log.apply(console, arguments);
        }
    };
});


/**
 * Local Storage
 * 
 * Local Storage management system
 * 
 * @param {object} $window  DOM Window
 */
Services.service('$storage', ['$window', '$config',
    function ($window, $config) {
        /* Default Methods */
        var $storage = {
            save: function () { },
            load: function () {
                return false;
            },
            clear: function () { },
            reset: function () { },
            expired: function (time) {
                var timeNow = (new Date()).getTime();
                if ((timeNow - time) > $config.expire) {
                    return true;
                }

                return false;
            }
        };

        /* Check for Local Storage */
        if (typeof $window.localStorage !== 'undefined') {
            /**
             * Save
             * 
             * Save data to Local Storage
             * 
             * @param {string} id   Identifier for the data
             * @param {mixed} data  Data to store
             */
            $storage.save = function (id, data) {
                /* Store data as a JSON String */
                try {
                    $window.localStorage[id] = JSON.stringify(data);
                } catch (e) {
                }
            };

            /**
             * Load
             * 
             * Load data from Local Storage
             * 
             * @param {string} id  Identifier for the data
             * @returns {mixed}
             */
            $storage.load = function (id) {
                /* Get data by id */
                var data = $window.localStorage[id];

                if (data === null || !data) {
                    /* No data found */
                    return null;
                }

                /* Convert data from a JSON String */
                return JSON.parse(data);
            };

            /**
             * Clear
             * 
             * Clear data from Local Storage
             * 
             * @param {string} id  Identifier for the data
             */
            $storage.clear = function (id) {
                try {
                    /* Try set data to null */
                    $window.localStorage[id] = null;
                } catch (e) { }
            };

            /**
             * Reset
             * 
             * Reset the Local Storage
             */
            $storage.reset = function () {
                /* Clear everything from Local Storage */
                $window.localStorage.clear();
            };
        }

        /* Return the Methods */
        return $storage;
    }
]);

/**
 * Navigate
 * 
 * Navigation management system
 * 
 * @param {object} $rootScope  Root Scope
 * @param {object} $route      Router Module
 * @param {object} $location   Location Module
 */
Services.service('$navigate', ['$rootScope', '$route', '$location', '$state', '$urlMatcherFactory',
    function ($rootScope, $route, $location, $state, $urlMatcherFactory) {
        var $navigate = this;

        /* Flag for Go Navigation or Browser */
        $navigate._goChange = false;
        /* Stores the Navigation History */
        $navigate._history = [];
        $navigate.local = {
            back: false,
            home: false
        };

        /**
         * Manage History
         * 
         * Manages the History for a smoother UX
         * 
         * @param {object} routeFrom  Route Object - Referrer
         * @param {object} routeTo    Route Object - Destination
         */
        $navigate._manageHistory = function (routeFrom, routeTo) {
            /* Rules for Navigation */
            var rules = [
                {
                    from: '*', to: 'home',
                    then: function () {
                        $navigate._history = [];
                    }
                },
                {
                    from: '*', to: '*',
                    then: function () {
                        $navigate._history = [];
                        $navigate._history.push('/');
                    }
                }
            ];

            var from = (routeFrom) ? routeFrom.page : false;
            var to = routeTo.page;

            for (var r = 0; r < rules.length; r++) {
                var rule = rules[r];

                /* Test Rulesets against the URL */
                if (((rule.from instanceof Array && rule.from.indexOf(from) !== -1) || rule.from === '*' || rule.from === from)
                        && ((rule.to instanceof Array && rule.to.indexOf(to) !== -1) || rule.to === '*' || rule.to === to)) {
                    rule.then.apply($navigate, []);
                    break;
                }
            }

            /* Check History and Enable Back/Home buttons */
            if ($navigate._history.length === 1) {
                $navigate.local.back = true;
                $navigate.local.home = false;
            } else if (this._history.length > 1) {
                $navigate.local.back = true;
                $navigate.local.home = true;
            } else {
                $navigate.local.back = false;
                $navigate.local.home = false;
            }
        };

        /**
         * Route Changed Event
         * 
         * Fires when the Route changes
         * 
         * @param {object} current         Route Object - Destination
         * @param {object|false} previous  Route Object - Referrer | False
         */
        $navigate._routeChanged = function (current, previous) {
            /* Browser Navigated so check the History */
            if ($navigate._goChange === false) {
                previous = previous || null;
                $navigate._manageHistory(previous, current);
            }

            /* Reset Navigator Flag */
            $navigate._goChange = false;
        };

        /**
         * Get Route Object
         * 
         * Look through the set Routes and pull out the one that matches the current URL
         * 
         * @param {string} url  Destination URL
         * @returns {$route.routes|null}  A Route Object | NULL
         */
        $navigate._getRoute = function (url) {
            var routeObj = null;
            var routes = $state.get();

            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                if (route.hasOwnProperty('url')) {
                    var urlMatcher = $urlMatcherFactory.compile(route.url);
                    if (url.match(urlMatcher.regexp)) {
                        routeObj = route;
                        break;
                    }
                }
            }

            return routeObj;
        };

        /**
         * Go
         * 
         * Go to a URL and handle the History
         * 
         * @param {string} url    Destination URL
         * @param {string} event  Navigation Event
         */
        $navigate._go = function (url, event) {
            /* Back Flag */
            var back = (url === 'back');
            if (back && !$navigate._history.length) {
                if (navigator && navigator.app) {
                    navigator.app.exitApp();
                }
            } else {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                url = (back) ? $navigate._history[($navigate._history.length - 1)] : url;

                var routeObj = $navigate._getRoute(url);
                if (routeObj) {
                    //$navigate._manageHistory($route.current, routeObj, back);
                    $navigate._goChange = true;
                    $location.path(url);
                }
            }
        };

        return {
            local: $navigate.local,

            getState: function () {
                return $state.current.name || null;
            },

            /**
             * Get the current Page
             * 
             * @returns {String} $route.current.page  Current Page
             */
            getPage: function () {
                var state = $state.current.name || '';

                return state.split('.').pop();
            },

            /**
             * Get Route Params
             * 
             * @returns {object} $route.current.params  Route Params
             */
            getParams: function () {
                return $state.params || {};
            },

            /**
             * Get Route Menu
             * 
             * @returns {object} $route.current.view  Route Menu
             */
            getView: function () {
                var state = $state.current.view || $state.current.name || '';

                return state.split('.').shift();
            },

            /**
             * Go
             * 
             * Relay to the service
             * 
             * @param {string} url    Destination URL
             * @param {string} event  Navigation Event
             */
            go: function (url, event) {
                $navigate._go(url, event);
            },

            /**
             * Route Changed
             * 
             * Relay to the service
             * 
             * @param {object} current         Route Object - Destination
             * @param {object|false} previous  Route Object - Referrer | False
             */
            routeChanged: function (current, previous) {
                $navigate._routeChanged(current, previous);
            }
        };
    }
]);

Services.service('$auth', ['$storage', '$api', '$q', '$config', '$rootScope',
    function ($storage, $api, $q, $config, $rootScope) {
        var $auth = {
            get: function () {
                return $storage.load('auth');
            },
            set: function (auth) {
                $storage.save('auth', auth);
            },
            hasAccess: function () {
                if ($auth.get()) {
                    return true;
                }

                return false;
            },
            remembered: function () {
                var auth = $auth.get();
                if (auth && auth.remember === true) {
                    return true;
                }

                return false;
            },
            expired: function () {
                var auth = $auth.get();
                var time = (new Date()).getTime();
                if (auth) {
                    if (auth.remember === true) {
                        auth.expire = (new Date()).getTime() + $config.userExpire;
                        $auth.set(auth);

                        return false;
                    } else if (auth.expire > time) {
                        return false;
                    }
                }

                return true;
            },
            logout: function () {
                var deferred = $q.defer();
                $storage.clear('auth');
                return deferred.promise;
            },
            resetPassword: function (data) {
                var deferred = $q.defer();

                $api.post('forgotpassword/forgotpassword', data).then(function (response) {
                    deferred.resolve(response);
                }, function (errorMessage) {
                    deferred.reject(errorMessage);
                });

                return deferred.promise;
            },
            setNewPassword: function (data) {
                var deferred = $q.defer();
                $api.post('resetpassword/reset', data).then(function (response) {
                    deferred.resolve(response);
                },
                function (errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;

            },
            save: function (userName, data, remember) {
                //******Abdul
                if (data.access_token && data.userName) {
                    var auth = $auth.get() || {};

                    auth.access_token = data.access_token;
                    auth.token_type = data.token_type;
                    auth.expires_in = data.expires_in;
                    auth.userName = userName;
                    auth.remember = remember || false;
                    //auth.expire = (new Date()).getTime() + $config.userExpire;
                    auth.issued = data.issued;
                    auth.expires = data.expires;

                    $storage.save('auth', auth);

                    //$storage.save('app', {
                    //    contents: data || {}
                    //});

                    return true;
                }

                return false;
            },
            reset: function () {
                $storage.clear('auth');
            },
            //token: function (time) {
            //    /**
            //     * create token using username+privatekey+currenttime[02:28 PM] Abdul Rahim: 
            //     * send token ,currenttime for create the token and public key in next request as header values
            //     */
            //    var auth = $auth.get();
            //    if (auth) {
            //        return $crypt.sha1(auth.username + auth.privateKey + time);
            //    }

            //    return false;
            //},
            headers: function () {
                var auth = $auth.get();
                var time = (new Date().getTime());

                var headers = {
                    token: $auth.token(time),
                    time: time,
                    username: auth.username,
                    publicKey: auth.publicKey
                };

                return headers;
            }
        };

        return $auth;
    }
]);

Services.service('$api', ['$q', '$http', '$config', '$timeout', '$rootScope', '$navigate',
    function ($q, $http, $config, $timeout, $rootScope, $navigate) {
        var request = function (request) {
            var deferred = $q.defer();

            var timeoutPromise = $timeout(function () {
                deferred.reject('Request timed out');
            }, 30000);

            //var pagetitle = $rootScope.pageTitle;
           // $rootScope.pageTitle = pagetitle || "Emirates Group Staff Platinum Card Programme";
            $http(request, { timeout: deferred.promise }).then(function (response) {
                //if (response.data.error && response.data.errorDetails.code === 401) {
                //    $rootScope.meta.title = response.data.errorDetails.message;
                //    $navigate.go('/login');
                //    return;
                //}
                if (response && response.constructor === ({}).constructor) {
                    var status = response.status || 500;
                    var data = response.data || {};

                    if (status === 200 && (data.Status === 200)) {
                        
                        //if (typeof response.data.bannerImage !== 'undefined') {
                        //    if ($rootScope.view === 'external') {
                        //        $rootScope.superExternalHeader.background = response.data.bannerImage;
                        //    } else {
                        //        $rootScope.superHeader.background = response.data.bannerImage;
                        //    }
                        //}

                        deferred.resolve(response.data);
                    } else {
                        var message = response.data.StatusMessage || 'Invalid response';

                        deferred.reject(message);
                    }
                } else {
                    deferred.reject('Invalid response');
                }

                $timeout.cancel(timeoutPromise);
            }, function () {
                deferred.reject('Invalid response');

                $timeout.cancel(timeoutPromise);
            });
            return deferred.promise;
        };

        return {
            get: function (url, data, headers) {
                headers = headers || {};
                headers['content-type'] = "application/json";

                var query = '';
                if (data) {
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            query = (query === '') ? '?' : query + '&';
                            query += i + '=' + data[i];
                        }
                    }
                }

                return request({
                    method: 'GET',
                    url: $config.serviceURL + url + query,
                    headers: headers
                });
            },
            post: function (url, data, headers) {
                headers = headers || {};
                headers['content-type'] = "application/json";

                return request({
                    method: 'POST',
                    url: $config.serviceURL + url,
                    data: JSON.stringify(data || {}),
                    headers: headers
                });
            },
            put: function (url, headers) {
                headers = headers || {};
                headers['content-type'] = "application/json";

                return request({
                    method: 'PUT',
                    url: $config.serviceURL + url,
                    headers: headers
                });
            },
            'delete': function (url, headers) {
                headers = headers || {};
                headers['content-type'] = "application/json";

                return request({
                    method: 'DELETE',
                    url: $config.serviceURL + url,
                    headers: headers
                });
            }
        };
    }
]);


//Authentication.controller('LoginController',
//    ['$scope', '$rootScope', '$location', 'AuthenticationService',
//    function ($scope, $rootScope, $location, AuthenticationService) {
//        // reset login status
//        AuthenticationService.ClearCredentials();
 
//        $scope.login = function () {
//            $scope.dataLoading = true;
//            AuthenticationService.Login($scope.username, $scope.password, function(response) {
//                if(response.success) {
//                    AuthenticationService.SetCredentials($scope.username, $scope.password);
//                    $location.path('/');
//                } else {
//                    $scope.error = response.message;
//                    $scope.dataLoading = false;
//                }
//            });
//        };
//    }]);
//Authentication.factory('AuthenticationService',
//    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
//    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
//        var service = {};

//        service.Login = function (username, password, callback) {

//            /* Dummy authentication for testing, uses $timeout to simulate api call
//             ----------------------------------------------*/
//            $timeout(function(){
//                var response = { success: username === 'test' && password === 'test' };
//                if(!response.success) {
//                    response.message = 'Username or password is incorrect';
//                }
//                callback(response);
//            }, 1000);


//            /* Use this for real authentication
//             ----------------------------------------------*/
//            //$http.post('/api/authenticate', { username: username, password: password })
//            //    .success(function (response) {
//            //        callback(response);
//            //    });

//        };
 
//        service.SetCredentials = function (username, password) {
//            var authdata = Base64.encode(username + ':' + password);
 
//            $rootScope.globals = {
//                currentUser: {
//                    username: username,
//                    authdata: authdata
//                }
//            };
 
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
//            $cookieStore.put('globals', $rootScope.globals);
//        };
 
//        service.ClearCredentials = function () {
//            $rootScope.globals = {};
//            $cookieStore.remove('globals');
//            $http.defaults.headers.common.Authorization = 'Basic ';
//        };
 
//        return service;
//    }])
 
//.factory('Base64', function () {
//    /* jshint ignore:start */
 
//    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
//    return {
//        encode: function (input) {
//            var output = "";
//            var chr1, chr2, chr3 = "";
//            var enc1, enc2, enc3, enc4 = "";
//            var i = 0;
 
//            do {
//                chr1 = input.charCodeAt(i++);
//                chr2 = input.charCodeAt(i++);
//                chr3 = input.charCodeAt(i++);
 
//                enc1 = chr1 >> 2;
//                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
//                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
//                enc4 = chr3 & 63;
 
//                if (isNaN(chr2)) {
//                    enc3 = enc4 = 64;
//                } else if (isNaN(chr3)) {
//                    enc4 = 64;
//                }
 
//                output = output +
//                    keyStr.charAt(enc1) +
//                    keyStr.charAt(enc2) +
//                    keyStr.charAt(enc3) +
//                    keyStr.charAt(enc4);
//                chr1 = chr2 = chr3 = "";
//                enc1 = enc2 = enc3 = enc4 = "";
//            } while (i < input.length);
 
//            return output;
//        },
 
//        decode: function (input) {
//            var output = "";
//            var chr1, chr2, chr3 = "";
//            var enc1, enc2, enc3, enc4 = "";
//            var i = 0;
 
//            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
//            var base64test = /[^A-Za-z0-9\+\/\=]/g;
//            if (base64test.exec(input)) {
//                window.alert("There were invalid base64 characters in the input text.\n" +
//                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
//                    "Expect errors in decoding.");
//            }
//            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
//            do {
//                enc1 = keyStr.indexOf(input.charAt(i++));
//                enc2 = keyStr.indexOf(input.charAt(i++));
//                enc3 = keyStr.indexOf(input.charAt(i++));
//                enc4 = keyStr.indexOf(input.charAt(i++));
 
//                chr1 = (enc1 << 2) | (enc2 >> 4);
//                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
//                chr3 = ((enc3 & 3) << 6) | enc4;
 
//                output = output + String.fromCharCode(chr1);
 
//                if (enc3 != 64) {
//                    output = output + String.fromCharCode(chr2);
//                }
//                if (enc4 != 64) {
//                    output = output + String.fromCharCode(chr3);
//                }
 
//                chr1 = chr2 = chr3 = "";
//                enc1 = enc2 = enc3 = enc4 = "";
 
//            } while (i < input.length);
 
//            return output;
//        }
//    };
 
//    /* jshint ignore:end */
//});
Controllers.controller('blogController', ['$scope', function ($scope) {
    
}]);
Controllers.controller('careersController',['$scope',function($scope) {
    
}]);
Controllers.controller('HomeController',
    ['$scope',
    function ($scope) {
      
    }]);
Controllers.controller('innerlayout', ['$scope', '$auth', '$navigate', function ($scope, $auth, $navigate) {
    
    if (!$auth.hasAccess()) {
        $navigate.go('/login');
        return;
    }
}]);

Controllers.controller('Internal', ['$scope', function ($scope) { }]);

Controllers.controller('loginController', ['$scope', '$rootScope', '$navigate', 'loginService', '$auth', function ($scope, $rootScope, $navigate, loginService, $auth) {
    $(".login .input").focusin(function () {
        $(this).find("span").animate({ "opacity": "0" }, 200);
    });

    $(".login .input").focusout(function () {
        $(this).find("span").animate({ "opacity": "1" }, 300);
    });

    if ($auth.hasAccess()) {
        $navigate.go('/about');
        return;
    }

    $scope.username = "test";
    $scope.password = "Password@123";

    // reset login status
    //loginService.ClearCredentials();
    $auth.reset();

    $scope.login = function () {
        $scope.dataLoading = true;
        var data = { UserName: $scope.username, Password: $scope.password };
        loginService.Login(data).then(function (response) {
            if (response.access_token !== "" && response.access_token !== undefined && response.access_token !== null) {
                //loginService.SetCredentials($scope.username, $scope.password);
                $navigate.go('/about');
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        });
    };
}]);


Controllers.controller('logoutController', [
    '$scope', '$navigate', '$auth', function ($scope, $navigate, $auth) {
        $scope.logout = function () {
            $auth.logout();
            $navigate.go('/');
        };
    }
]);
Services.factory('loginService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', '$config', '$api', '$q', '$auth',
    function (Base64, $http, $cookieStore, $rootScope, $timeout, $config, $api, $q, $auth) {
        var service = {};

        service.Login = function (data) {
            var deferred = $q.defer();
           debugger
            var data1 = "grant_type=password&username=" + data.UserName + "&password=" + data.Password;
            $http.post($config.host + 'token', data1, { headers: { 'content-type': 'application/x-www-form-urlencoded'} })
             .success(function (response) {
                 if ($auth.save(response.userName, response, false)) {
                     deferred.resolve(response);
                 } else {
                     deferred.reject('Unable to Login. Please try again.');
                 }
                
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;

            //$http.post($config.serviceURL + 'Account/Login', { UserName: username, Password: password })
            // .success(function (response) {
            //     callback(response);
            // });

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            //$timeout(function () {
            //    var response = { success: username === 'test' && password === 'test' };
            //    if (!response.success) {
            //        response.message = 'Username or password is incorrect';
            //    }
            //    callback(response);
            //}, 1000);


            /* Use this for real authentication
             ----------------------------------------------*/
         

        };

        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
    }])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});
//Register.controller('registerController', ['$scope', function ($scope) { }]);

Register.controller('registerController', ['$scope', '$registerService', '$timeout', function ($scope, $registerService, $timeout) {
    $scope.successMessage = "";

    function setValues(response) {
        $scope.dataLoading = false;
        $scope.successMessage = response;
        $timeout(function () {
            $scope.successMessage = "";
        }, 2000);
    }

    $scope.register = function () {
        $scope.dataLoading = true;
        var data = { UserName: $scope.userName, Email: $scope.email, Password: $scope.password, FirstName: $scope.firstName, LastName: $scope.lastName };
        $registerService.save(data).then(function (response) {
            setValues(response);
        }, function (errorMessage) {
            setValues(errorMessage);
        });
    };
}]);
/**
 * Register
 * 
 * @param {object} $window  DOM Window
 */
Services.service('$registerService', ['$window', '$config','$q','$api',
    function ($window, $config, $q, $api) {
        /* Default Methods */
        var $register = {
            save: function () { }
        };

      
            /**
             * Save
             * 
             * Save member
             * 
             * 
             * @param {mixed} data  Data to store
             */
        $register.save = function (data) {
            /* Store data as a JSON String */
            var deferred = $q.defer();
                try {
                    $api.post('Account/Registration', data).then(function (response) {
                        //var auth = $storage.load('auth');
                        //auth.firstName = data.firstName;
                        //$storage.save('auth', auth);

                        deferred.resolve('User Created.');
                    }, function (errorMessage) {
                        deferred.reject(errorMessage);
                    });
                } catch (e) {
                    deferred.reject('Unable to Register. Please try again.');
                }
                return deferred.promise;
            };
           
        

        /* Return the Methods */
        return $register;
    }
]);
Controllers.controller('servicesController',['$scope',function ($scope){}]);

Controllers.controller('aboutController', ['$scope', function ($scope) { }]);