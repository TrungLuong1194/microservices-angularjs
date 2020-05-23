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

        $scope.students;
        $scope.status;
        $scope.cities;
        $scope.majors;
        $scope.dorms;

        // Get all cities
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/cities',
        }).then(function successCallback(response) {
            $scope.cities = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Get all majors
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/majors',
        }).then(function successCallback(response) {
            $scope.majors = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Get all dorms
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/dorms',
        }).then(function successCallback(response) {
            $scope.dorms = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Get all students
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/students',
        }).then(function successCallback(response) {
            $scope.students = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new student
        $scope.add = function () {

            const studentData = {
                username: $scope.username,
                password: $scope.password,
                role: "USER",
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                birthday: $scope.birthday,
                classname: $scope.classname,
                address: $scope.address,
                phone: $scope.phone,
                description: $scope.description,
                email: $scope.email,
                major: $scope.major,
                dorm: $scope.dorm,
                city: $scope.city
            };

            for (let i = 0; i < $scope.students.length; i++) {
                if (($scope.students[i].username).localeCompare(studentData.username) === 0) {
                    alert(studentData.username + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.students.length; i++) {
                if (($scope.students[i].phone).localeCompare(studentData.phone) === 0) {
                    alert(studentData.phone + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.students.length; i++) {
                if (($scope.students[i].email).localeCompare(studentData.email) === 0) {
                    alert(studentData.email + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8762/students/students',
                data: studentData,
            }).then(function successCallback(response) {
                window.location.assign('http://localhost:63343/microservices-angularjs/app/studentServer/login/index.html');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new student " + response.ExceptionMessage;
            });

        };

    }]);
