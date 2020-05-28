var app = angular.module('myAppMajor', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/majors', {
        templateUrl: 'html/major/majorsList.html',
        controller: 'MajorCtrl'
    }).
    when('/addMajor', {
        templateUrl: 'html/major/addMajor.html',
        controller: 'MajorCtrl'
    }).
    when('/editMajor/:majorId', {
        templateUrl: 'html/major/editMajor.html',
        controller: 'MajorCtrl'
    }).
    when('/deleteMajor/:majorId', {
        templateUrl: 'html/major/deleteMajor.html',
        controller: 'MajorCtrl'
    }).
    otherwise({
        redirectTo: '/majors'
    });

});

app.controller("MajorCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams, $window) {

        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63342/microservices-angularjs/app/login.html');
        }

        $scope.majors;
        $scope.status;
        $scope.tempName;

        $scope.currentRole;

        $scope.close = function () {
            $location.path('/majors');
        };

        // Get all majors
        $http({
            method: 'GET',
            url: 'https://gateway-bmstu.herokuapp.com/students/majors',
        }).then(function successCallback(response) {
            $scope.majors = response.data;
            $scope.currentRole = $window.localStorage.getItem('role');
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new major
        $scope.add = function () {

            const majorData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.majors.length; i++) {
                if (($scope.majors[i].name).localeCompare(majorData.name) === 0) {
                    alert(majorData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'https://gateway-bmstu.herokuapp.com/students/majors',
                data: majorData,
            }).then(function successCallback(response) {
                $location.path('/majors');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new major " + response.ExceptionMessage;
            });

        };

        // Fill the major records for update
        if ($routeParams.majorId) {

            $scope.id = $routeParams.majorId;

            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/students/majors/' + $scope.id,
            }).then(function successCallback(response) {
                $scope.name = response.data.name;
                $scope.tempName = response.data.name;
            });

        }

        // Update the major records
        $scope.update = function () {

            const majorData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.majors.length; i++) {
                if ((majorData.name).localeCompare($scope.tempName) !== 0 &&
                ($scope.majors[i].name).localeCompare(majorData.name) === 0) {
                    alert(majorData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'https://gateway-bmstu.herokuapp.com/students/majors/' + $scope.id,
                data: majorData,
            }).then(function successCallback(response) {
                $location.path('/majors');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating major " + response.ExceptionMessage;
            });

        };

        // Delete the selected major from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'https://gateway-bmstu.herokuapp.com/students/majors/' + $scope.id,
            }).then(function successCallback(response) {
                $location.path('/majors');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting major " + response.ExceptionMessage;
            });

        }
}]);

