var app = angular.module('myAppLogin', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    }).
    otherwise({
        redirectTo: '/login'
    });

});

app.controller("LoginCtrl", ['$scope', '$http', '$location', '$window',
    function ($scope, $http, $location, $window) {

        $scope.students;
        $scope.status;

        // $window.localStorage.clear();

        // Get all students
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/students'
        }).then(function successCallback(response) {
            $scope.students = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        $scope.add = function () {

            const loginData = {
                username: $scope.username,
                password: $scope.password,
            };

            let index = -1;

            for (let i = 0; i < $scope.students.length; i++) {
                if (($scope.students[i].username).localeCompare(loginData.username) === 0) {
                   index = i;
                   break;
                }
            }

            if (index === -1) {
                alert(loginData.username + " don't exists!");
                return false;
            }

            if (($scope.students[index].password).localeCompare(loginData.password) !== 0) {
                alert("Password wrong!");
                return false;
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8762/auth',
                data: loginData
            }).then(function successCallback(response) {
                $window.localStorage.setItem('id', $scope.students[index].id);
                $window.localStorage.setItem('username', loginData.username);
                $window.localStorage.setItem('token', response.headers('Authorization'));

                window.location.assign('http://localhost:63343/microservices-angularjs/app/homeServer/home/index.html');

                console.log($window.localStorage.getItem('username'));
                console.log($window.localStorage.getItem('token'));
            }, function errorCallback(response) {
                $scope.error = "Something wrong " + response.ExceptionMessage;
            })

        };

    }]);
