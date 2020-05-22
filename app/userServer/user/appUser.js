var app = angular.module('myAppUser', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/users', {
        templateUrl: 'views/usersList.html',
        controller: 'UserCtrl'
    }).
    when('/addUser', {
        templateUrl: 'views/addUser.html',
        controller: 'UserCtrl'
    }).
    when('/editUser/:userId', {
        templateUrl: 'views/editUser.html',
        controller: 'UserCtrl'
    }).
    when('/deleteUser/:userId', {
        templateUrl: 'views/deleteUser.html',
        controller: 'UserCtrl'
    }).
    otherwise({
        redirectTo: '/users'
    });

});

app.controller("UserCtrl", ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams, $window) {

        $scope.users;
        $scope.status;
        $scope.tempUsername;
        $scope.tempPassword;
        $scope.tempRole;

        $scope.close = function () {
            $location.path('/users');
        };

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
                role: $scope.role,
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
                $location.path('/users');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new user " + response.ExceptionMessage;
            });

        };

        // Fill the user records for update
        if ($routeParams.userId) {

            $scope.id = $routeParams.userId;

            $http({
                method: 'GET',
                url: 'http://localhost:8762/users/users/' + $scope.id,
            }).then(function successCallback(response) {
                $scope.username = response.data.username;
                $scope.password = response.data.password;
                $scope.role = response.data.role;

                $scope.tempUsername = response.data.username;
                $scope.tempPassword = response.data.password;
                $scope.tempRole = response.data.role;
            });

        }

        // Update the user records
        $scope.update = function () {

            const userData = {
                username: $scope.username,
                password: $scope.password,
                role: $scope.role,
            };

            for (let i = 0; i < $scope.users.length; i++) {
                if ((userData.username).localeCompare($scope.tempUsername) !== 0 &&
                    ($scope.users[i].name).localeCompare(userData.username) === 0) {
                    alert(userData.username + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8762/users/users/' + $scope.id,
                data: userData
            }).then(function successCallback(response) {
                $location.path('/users');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating user " + response.ExceptionMessage;
            });

        };

        // Delete the selected user from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8762/users/users/' + $scope.id
            }).then(function successCallback(response) {
                $location.path('/users');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting user " + response.ExceptionMessage;
            });

        }

    }]);
