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