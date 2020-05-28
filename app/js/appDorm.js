var app = angular.module('myAppDorm', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/dorms', {
        templateUrl: 'html/dorm/dormsList.html',
        controller: 'DormCtrl'
    }).
    when('/addDorm', {
        templateUrl: 'html/dorm/addDorm.html',
        controller: 'DormCtrl'
    }).
    when('/editDorm/:dormId', {
        templateUrl: 'html/dorm/editDorm.html',
        controller: 'DormCtrl'
    }).
    when('/deleteDorm/:dormId', {
        templateUrl: 'html/dorm/deleteDorm.html',
        controller: 'DormCtrl'
    }).
    otherwise({
        redirectTo: '/dorms'
    });

});

app.controller("DormCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams, $window) {

        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63342/microservices-angularjs/app/login.html');
        }

        $scope.dorms;
        $scope.status;
        $scope.tempName;

        $scope.currentRole;

        $scope.close = function () {
            $location.path('/dorms');
        };

        // Get all dorms
        $http({
            method: 'GET',
            url: 'https://gateway-bmstu.herokuapp.com/students/dorms',
        }).then(function successCallback(response) {
            $scope.dorms = response.data;
            $scope.currentRole = $window.localStorage.getItem('role');
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
                url: 'https://gateway-bmstu.herokuapp.com/students/dorms',
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
                url: 'https://gateway-bmstu.herokuapp.com/students/dorms/' + $scope.id,
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
                url: 'https://gateway-bmstu.herokuapp.com/students/dorms/' + $scope.id,
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
                url: 'https://gateway-bmstu.herokuapp.com/students/dorms/' + $scope.id,
            }).then(function successCallback(response) {
                $location.path('/dorms');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting dorm " + response.ExceptionMessage;
            });

        }
}]);

