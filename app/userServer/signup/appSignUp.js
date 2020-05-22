var app = angular.module('myAppSignUp', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpCtrl'
    }).
    otherwise({
        redirectTo: '/signup'
    });

});

app.controller("SignUpCtrl", ['$scope', '$http', '$location',
    function ($scope, $http, $location) {

        $scope.users;
        $scope.status;

        // Get all users
        $http({
            method: 'GET',
            url: 'http://localhost:8762/users/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new user
        $scope.add = function () {

            const userData = {
                username: $scope.username,
                password: $scope.password,
                role: "USER",
            };

            for (let i = 0; i < $scope.users.length; i++) {
                if (($scope.users[i].username).localeCompare(userData.username) === 0) {
                    alert(userData.username + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8762/users/users',
                data: userData
            }).then(function successCallback(response) {
                window.location.assign('http://localhost:63343/microservices-angularjs/app/userServer/login/index.html');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new user " + response.ExceptionMessage;
            });

        };

    }]);
