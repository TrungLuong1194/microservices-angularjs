var app = angular.module('myAppStudent', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/students', {
        templateUrl: 'views/studentsList.html',
        controller: 'StudentCtrl',
    }).
    when('/addStudent', {
        templateUrl: 'views/addStudent.html',
        controller: 'StudentCtrl'
    }).
    when('/editStudent/:studentId', {
        templateUrl: 'views/editStudent.html',
        controller: 'StudentCtrl'
    }).
    when('/deleteStudent/:studentId', {
        templateUrl: 'views/deleteStudent.html',
        controller: 'StudentCtrl'
    }).
    otherwise({
        redirectTo: '/students'
    });

});

app.controller("StudentCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams, $window) {

        $scope.students;
        $scope.status;
        $scope.cities;
        $scope.majors;
        $scope.dorms;

        // Temporary data
        $scope.tempUsername;
        $scope.tempPassword;
        $scope.tempRole;
        $scope.tempFirstName;
        $scope.tempLastName;
        $scope.tempBirthday;
        $scope.tempClassname;
        $scope.tempAddress;
        $scope.tempPhone;
        $scope.tempDescription;
        $scope.tempEmail;
        $scope.tempMajor;
        $scope.tempDorm;
        $scope.tempCity;

        $scope.currentRole;
        $scope.currentStudent;

        $scope.close = function () {
            $location.path('/students');
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
            $scope.currentRole = $window.localStorage.getItem('role');
            $scope.currentStudent = $window.localStorage.getItem('studentID');
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new student
        $scope.add = function () {

            const studentData = {
                username: $scope.username,
                password: $scope.password,
                role: $scope.role,
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
                $location.path('/students');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new student " + response.ExceptionMessage;
            });

        };

        // Fill the student records for update
        if ($routeParams.studentId) {

            $scope.id = $routeParams.studentId;

            $http({
                method: 'GET',
                url: 'http://localhost:8762/students/students/' + $scope.id,
            }).then(function successCallback(response) {
                $scope.username = response.data.username;
                $scope.password = response.data.password;
                $scope.role = response.data.role;
                $scope.firstname = response.data.firstname;
                $scope.lastname = response.data.lastname;
                $scope.birthday = new Date(response.data.birthday);
                $scope.classname = response.data.classname;
                $scope.address = response.data.address;
                $scope.phone = response.data.phone;
                $scope.description = response.data.description;
                $scope.email = response.data.email;
                $scope.major = response.data.major;
                $scope.dorm = response.data.dorm;
                $scope.city = response.data.city;

                $scope.tempUsername = response.data.username;
                $scope.tempPassword = response.data.password;
                $scope.tempRole = response.data.role;
                $scope.tempFirstName = response.data.firstname;
                $scope.tempLastname = response.data.lastname;
                $scope.tempBirthday = response.data.birthday;
                $scope.tempClassname = response.data.classname;
                $scope.tempAddress = response.data.address;
                $scope.tempPhone = response.data.phone;
                $scope.tempDescription = response.data.description;
                $scope.tempEmail = response.data.email;
                $scope.tempMajor = response.data.major;
                $scope.tempDorm = response.data.dorm;
                $scope.tempCity = response.data.city;
            });

        }

        // Update the student records
        $scope.update = function () {

            const studentData = {
                username: $scope.username,
                password: $scope.password,
                role: $scope.role,
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
                if ((studentData.username).localeCompare($scope.tempUsername) !== 0 &&
                    ($scope.students[i].username).localeCompare(studentData.username) === 0) {
                    alert(studentData.username + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.students.length; i++) {
                if ((studentData.email).localeCompare($scope.tempEmail) !== 0 &&
                ($scope.students[i].email).localeCompare(studentData.email) === 0) {
                    alert(studentData.email + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.students.length; i++) {
                if ((studentData.phone).localeCompare($scope.tempPhone) !== 0 &&
                    ($scope.students[i].phone).localeCompare(studentData.phone) === 0) {
                    alert(studentData.phone + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8762/students/students/' + $scope.id,
                data: studentData,
            }).then(function successCallback(response) {
                $location.path('/students');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating student " + response.ExceptionMessage;
            });

        };

        // Delete the selected student from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8762/students/students/' + $scope.id,
            }).then(function successCallback(response) {
                $location.path('/students');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting student " + response.ExceptionMessage;
            });

        }
}]);

