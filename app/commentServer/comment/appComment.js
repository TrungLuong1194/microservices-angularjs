var app = angular.module('myAppComment', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.when('/comments', {
        templateUrl: 'views/commentsList.html',
        controller: 'CommentCtrl'
    }).when('/addComment', {
        templateUrl: 'views/addComment.html',
        controller: 'CommentCtrl'
    }).when('/editComment/:commentId', {
        templateUrl: 'views/editComment.html',
        controller: 'CommentCtrl'
    }).when('/deleteComment/:commentId', {
        templateUrl: 'views/deleteComment.html',
        controller: 'CommentCtrl'
    }).when('/students/:studentId', {
        templateUrl: 'views/commentsListByStudentID.html',
        controller: 'CommentCtrl'
    }).when('/posts/:postId', {
        templateUrl: 'views/commentsListByPostID.html',
        controller: 'CommentCtrl'
    }).otherwise({
        redirectTo: '/comments'
    });

});

app.controller("CommentCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams, $window) {

        // Setting token
        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63342/microservices-angularjs/app/studentServer/login/index.html');
        }

        $scope.comments;
        $scope.status;
        $scope.students;
        $scope.posts;
        $scope.commentsByStudentID;
        $scope.commentsByPostID;

        $scope.currentStudent;

        // Temporary data
        $scope.tempContent;

        $scope.close = function () {
            $location.path('/comments');
        };

        // Get all students
        $http({
            method: 'GET',
            url: 'https://gateway-bmstu.herokuapp.com/students/students',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_STRING
            }
        }).then(function successCallback(response) {
            $scope.students = response.data;
        }, function errorCallback(response) {
            $scope.students = "data not found";
        });

        // Get all posts
        $http({
            method: 'GET',
            url: 'https://gateway-bmstu.herokuapp.com/posts/posts',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_STRING
            }
        }).then(function successCallback(response) {
            $scope.posts = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Get all comments
        $http({
            method: 'GET',
            url: 'https://gateway-bmstu.herokuapp.com/comments/comments',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_STRING
            }
        }).then(function successCallback(response) {
            $scope.comments = response.data;
            $scope.currentStudent = $window.localStorage.getItem('studentID');
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        if ($routeParams.studentId) {

            $scope.id = $routeParams.studentId;

            // Get all comments with StudentID
            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/students/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.commentsByStudentID = response.data;
            }, function errorCallback(response) {
                $scope.status = "data not found";
            });

        }

        if ($routeParams.postId) {

            $scope.id = $routeParams.postId;

            // Get all comments with PostID
            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/posts/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.commentsByPostID = response.data;
            }, function errorCallback(response) {
                $scope.status = "data not found";
            });
        }

        // Add new comment
        $scope.add = function () {

            const commentData = {
                student: $scope.student,
                post: $scope.post,
                content: $scope.content,
                date_create: $scope.date_create,
            };

            $http({
                method: 'POST',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments',
                data: commentData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/comments');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new comment " + response.ExceptionMessage;
            });

        };

        // Fill the comment records for update
        if ($routeParams.commentId) {

            $scope.id = $routeParams.commentId;

            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.student = response.data.student;
                $scope.post = response.data.post;
                $scope.content = response.data.content;
                $scope.date_create = response.data.date_create;
            });

        }

        // Update the comment records
        $scope.update = function () {

            const commentData = {
                student: $scope.student,
                post: $scope.post,
                content: $scope.content,
                date_create: $scope.date_create,
            };

            $http({
                method: 'PUT',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/' + $scope.id,
                data: commentData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/comments');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating post " + response.ExceptionMessage;
            });

        };

        // Delete the selected comment from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/comments');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting post " + response.ExceptionMessage;
            });

        }
    }]);
