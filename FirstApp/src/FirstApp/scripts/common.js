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

