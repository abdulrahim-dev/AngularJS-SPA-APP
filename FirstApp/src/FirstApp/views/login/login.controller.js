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