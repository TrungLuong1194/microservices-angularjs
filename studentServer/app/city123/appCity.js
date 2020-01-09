var app = angular.module('listApp', []);

app.controller("listCtrl", function($scope, $http) {

    /**
     * $http Get function
     * List all cities
     */
    $http({
        method: 'GET',
        url: 'http://localhost:8762/students/cities'
    }).then(function successCallback(response) {
        $scope.cities = response.data;
    }, function errorCallback(response) {
        alert("Error. Try Again!");
    });

    /**
     * $http DELETE function
     * Delete City
     */
    $scope.deleteCity = function(city) {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8762/students/cities/' + city.id
        }).then(function successCallback(response) {
            alert("City has deleted successfully!");
            var index = $scope.cities.indexOf(city);
            $scope.cities.splice(index, 1);
        }, function errorCallback(response) {
            alert("Error while deleting city123. Try Again!");
        });

    };




    $scope.detailsCity = function(city) {

        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/cities/' + city.id
        }).then(function successCallback(response) {
            $scope.city = response.data;
        }, function errorCallback(response) {
            alert("Error. Try Again!");
        });

    };





});

var app = angular.module('detailsApp', []);

app.controller('detailsCtrl', function($scope, $http) {

    // $http({
    //     method: 'GET',
    //     url: 'http://localhost:8762/students/cities/23'
    // }).then(function successCallback(response) {
    //     $scope.city123 = response.data;
    // }, function errorCallback(response) {
    //     alert("Error. Try Again!");
    // });

    $scope.city = app.detailsCity();
});
