var app = angular.module('myAppDorm', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/dorms', {
        templateUrl: 'views/dormsList.html',
        controller: 'DormCtrl'
    }).
    when('/addDorm', {
        templateUrl: 'views/addDorm.html',
        controller: 'DormCtrl'
    }).
    when('/editDorm/:dormId', {
        templateUrl: 'views/editDorm.html',
        controller: 'DormCtrl'
    }).
    when('/deleteDorm/:dormId', {
        templateUrl: 'views/deleteDorm.html',
        controller: 'DormCtrl'
    }).
    otherwise({
        redirectTo: '/dorms'
    });

});

app.controller("DormCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams) {

        $scope.dorms;
        $scope.status;
        $scope.tempName;

        $scope.close = function () {
            $location.path('/dorms');
        };

        // Get all dorms
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/dorms',
        }).then(function successCallback(response) {
            $scope.dorms = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new dorm
        $scope.add = function () {

            const dormData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.dorms.length; i++) {
                if (($scope.dorms[i].name).localeCompare(dormData.name) === 0) {
                    alert(dormData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8762/students/dorms',
                data: dormData,
            }).then(function successCallback(response) {
                $location.path('/dorms');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new dorm " + response.ExceptionMessage;
            });

        };

        // Fill the dorm records for update
        if ($routeParams.dormId) {

            $scope.id = $routeParams.dormId;

            $http({
                method: 'GET',
                url: 'http://localhost:8762/students/dorms/' + $scope.id,
            }).then(function successCallback(response) {
                $scope.name = response.data.name;
                $scope.tempName = response.data.name;
            });

        }

        // Update the dorm records
        $scope.update = function () {

            const dormData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.dorms.length; i++) {
                if ((dormData.name).localeCompare($scope.tempName) !== 0 &&
                ($scope.dorms[i].name).localeCompare(dormData.name) === 0) {
                    alert(dormData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8762/students/dorms/' + $scope.id,
                data: dormData,
            }).then(function successCallback(response) {
                $location.path('/dorms');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating dorm " + response.ExceptionMessage;
            });

        };

        // Delete the selected dorm from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8762/students/dorms/' + $scope.id,
            }).then(function successCallback(response) {
                $location.path('/dorms');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting dorm " + response.ExceptionMessage;
            });

        }
}]);

