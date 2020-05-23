var app = angular.module('myAppCity', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/cities', {
        templateUrl: 'views/citiesList.html',
        controller: 'CityCtrl'
    }).
    when('/addCity', {
        templateUrl: 'views/addCity.html',
        controller: 'CityCtrl'
    }).
    when('/editCity/:cityId', {
        templateUrl: 'views/editCity.html',
        controller: 'CityCtrl'
    }).
    when('/deleteCity/:cityId', {
        templateUrl: 'views/deleteCity.html',
        controller: 'CityCtrl'
    }).
    otherwise({
        redirectTo: '/cities'
    });

});

app.controller("CityCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams) {

        $scope.cities;
        $scope.status;
        $scope.tempName;

        $scope.close = function () {
            $location.path('/cities');
        };

        // Get all cities
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/cities',
        }).then(function successCallback(response) {
            $scope.cities = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new city
        $scope.add = function () {

            const cityData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.cities.length; i++) {
                if (($scope.cities[i].name).localeCompare(cityData.name) === 0) {
                    alert(cityData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8762/students/cities',
                data: cityData,
            }).then(function successCallback(response) {
                $location.path('/cities');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new city " + response.ExceptionMessage;
            });

        };

        // Fill the city records for update
        if ($routeParams.cityId) {

            $scope.id = $routeParams.cityId;

            $http({
                method: 'GET',
                url: 'http://localhost:8762/students/cities/' + $scope.id,
            }).then(function successCallback(response) {
                $scope.name = response.data.name;
                $scope.tempName = response.data.name;
            });

        }

        // Update the city records
        $scope.update = function () {

            const cityData = {
                name: $scope.name
            };

            for (let i = 0; i < $scope.cities.length; i++) {
                if ((cityData.name).localeCompare($scope.tempName) !== 0 &&
                ($scope.cities[i].name).localeCompare(cityData.name) === 0) {
                    alert(cityData.name + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8762/students/cities/' + $scope.id,
                data: cityData,
            }).then(function successCallback(response) {
                $location.path('/cities');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating city " + response.ExceptionMessage;
            });

        };

        // Delete the selected city from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8762/students/cities/' + $scope.id,
            }).then(function successCallback(response) {
                $location.path('/cities');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting city " + response.ExceptionMessage;
            });

        }
}]);

