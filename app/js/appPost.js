var app = angular.module('myAppPost', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/posts', {
        templateUrl: 'html/post/postsList.html',
        controller: 'PostCtrl'
    }).
    when('/posts/:postId', {
        templateUrl: 'html/post/postByID.html',
        controller: 'PostCtrl'
    }).
    when('/addPost', {
        templateUrl: 'html/post/addPost.html',
        controller: 'PostCtrl'
    }).
    when('/editPost/:postId', {
        templateUrl: 'html/post/editPost.html',
        controller: 'PostCtrl'
    }).
    when('/deletePost/:postId', {
        templateUrl: 'html/post/deletePost.html',
        controller: 'PostCtrl'
    }).
    when('/students/:studentId', {
        templateUrl: 'html/post/postsListByStudentID.html',
        controller: 'PostCtrl'
    }).

    when('/addComment', {
        templateUrl: 'html/post/addComment.html',
        controller: 'PostCtrl'
    }).
    when('/editComment/:commentId', {
        templateUrl: 'html/post/editComment.html',
        controller: 'PostCtrl'
    }).
    when('/deleteComment/:commentId', {
        templateUrl: 'html/post/deleteComment.html',
        controller: 'PostCtrl'
    }).

    otherwise({
        redirectTo: '/posts'
    });

});

app.controller("PostCtrl", ['$scope', '$http', '$location', '$routeParams', '$window',
    function ($scope, $http, $location, $routeParams, $window) {

        // Setting token
        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63342/microservices-angularjs/app/login.html');
        }

        $scope.posts;
        $scope.status;
        $scope.students;
        $scope.postsByStudentID;
        $scope.postById;
        $scope.commentsByPostID;

        $scope.currentStudent;

        // Temporary data
        $scope.tempTitle;
        $scope.tempContent;

        $scope.close = function () {
            $location.path('/posts/' + $routeParams.postId);
        };

        if ($routeParams.postId) {

            $scope.id = $routeParams.postId;

            // Get a post with id
            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.postById = response.data;
                $scope.currentStudent = $window.localStorage.getItem('studentID');
                $window.localStorage.setItem('currentPost', $scope.id);
            }, function errorCallback(response) {
                $scope.status = "data not found";
            });

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

        if ($routeParams.studentId) {

            $scope.id = $routeParams.studentId;
            // Get all posts with StudentID
            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts/students/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.postsByStudentID = response.data;
            }, function errorCallback(response) {
                $scope.status = "data not found";
            });

        }

        // Add new post
        $scope.add = function () {

            const postData = {
                // student: $scope.student,
                student: $window.localStorage.getItem('studentID'),
                title: $scope.title,
                content: $scope.content,
                date_create: $scope.date_create,
            };

            for (let i = 0; i < $scope.posts.length; i++) {
                if (($scope.posts[i].title).localeCompare(postData.title) === 0) {
                    alert(postData.title + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.posts.length; i++) {
                if (($scope.posts[i].content).localeCompare(postData.content) === 0) {
                    alert(postData.content + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'POST',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts',
                data: postData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/posts');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when adding new post " + response.ExceptionMessage;
            });

        };

        // Fill the post records for update
        if ($routeParams.postId) {

            $scope.id = $routeParams.postId;

            $http({
                method: 'GET',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $scope.student = response.data.student;
                $scope.title = response.data.title;
                $scope.content = response.data.content;
                $scope.date_create = response.data.date_create;

                $scope.tempTitle = response.data.title;
                $scope.tempContent = response.data.content;
            });

        }

        // Update the post records
        $scope.update = function () {

            const postData = {
                student: $scope.student,
                title: $scope.title,
                content: $scope.content,
                date_create: $scope.date_create,
            };

            for (let i = 0; i < $scope.posts.length; i++) {
                if ((postData.title).localeCompare($scope.tempTitle) !== 0 &&
                ($scope.posts[i].title).localeCompare(postData.title) === 0) {
                    alert(postData.title + " already exists!");
                    return false;
                }
            }

            for (let i = 0; i < $scope.posts.length; i++) {
                if ((postData.content).localeCompare($scope.tempContent) !== 0 &&
                    ($scope.posts[i].content).localeCompare(postData.content) === 0) {
                    alert(postData.content + " already exists!");
                    return false;
                }
            }

            $http({
                method: 'PUT',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts/' + $scope.id,
                data: postData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/posts/' + $routeParams.postId);
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating post " + response.ExceptionMessage;
            });

        };

        // Delete the selected post from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'https://gateway-bmstu.herokuapp.com/posts/posts/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/posts');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting post " + response.ExceptionMessage;
            });

        };

        //---------------------------------------------------------------------------------------------
        // For comment

        $scope.closeComment = function () {
            $location.path('/posts/' + $scope.post);
        };

        $scope.back = function () {
            window.history.back();
        };

        // Add new comment
        $scope.addComment = function () {

            const commentData = {
                student: $window.localStorage.getItem('studentID'),
                post: $window.localStorage.getItem('currentPost'),
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
                $location.path('/posts/' + $window.localStorage.getItem('currentPost'));
                $window.localStorage.removeItem('currentPost');
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
        $scope.updateComment = function () {

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
                $location.path('/posts/' + $scope.post);
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating post " + response.ExceptionMessage;
            });

        };

        // Delete the selected comment from the list
        $scope.deleteComment = function () {

            $http({
                method: 'DELETE',
                url: 'https://gateway-bmstu.herokuapp.com/comments/comments/' + $scope.id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_STRING
                }
            }).then(function successCallback(response) {
                $location.path('/posts/' + $scope.post);
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting post " + response.ExceptionMessage;
            });

        }
}]);
