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