Controllers.controller('innerlayout', ['$scope', '$auth', '$navigate', function ($scope, $auth, $navigate) {
    
    if (!$auth.hasAccess()) {
        $navigate.go('/login');
        return;
    }
}]);
