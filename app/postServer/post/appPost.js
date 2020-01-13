var app = angular.module('myAppPost', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.
    when('/posts', {
        templateUrl: 'views/postsList.html',
        controller: 'PostCtrl'
    }).
    when('/posts/:postId', {
        templateUrl: 'views/postByID.html',
        controller: 'PostCtrl'
    }).
    when('/addPost', {
        templateUrl: 'views/addPost.html',
        controller: 'PostCtrl'
    }).
    when('/editPost/:postId', {
        templateUrl: 'views/editPost.html',
        controller: 'PostCtrl'
    }).
    when('/deletePost/:postId', {
        templateUrl: 'views/deletePost.html',
        controller: 'PostCtrl'
    }).
    when('/students/:studentId', {
        templateUrl: 'views/postsListByStudentID.html',
        controller: 'PostCtrl'
    }).
    otherwise({
        redirectTo: '/posts'
    });

});

app.controller("PostCtrl", ['$scope', '$http', '$location', '$routeParams',
    function ($scope, $http, $location, $routeParams) {

        $scope.posts;
        $scope.status;
        $scope.students;
        $scope.postsByStudentID;
        $scope.postById;

        // Temporary data
        $scope.tempTitle;
        $scope.tempContent;

        $scope.close = function () {
            $location.path('/posts');
        };



        // Get a post with id
        $http({
            method: 'GET',
            url: 'http://localhost:8762/posts/posts/' + $routeParams.postId
        }).then(function successCallback(response) {
            $scope.postById = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });






        // Get all students
        $http({
            method: 'GET',
            url: 'http://localhost:8762/students/students'
        }).then(function successCallback(response) {
            $scope.students = response.data;
        }, function errorCallback(response) {
            $scope.students = "data not found";
        });

        // Get all posts
        $http({
            method: 'GET',
            url: 'http://localhost:8762/posts/posts'
        }).then(function successCallback(response) {
            $scope.posts = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Get all posts with StudentID
        $http({
            method: 'GET',
            url: 'http://localhost:8762/posts/posts/students/' + $routeParams.studentId
        }).then(function successCallback(response) {
            $scope.postsByStudentID = response.data;
        }, function errorCallback(response) {
            $scope.status = "data not found";
        });

        // Add new post
        $scope.add = function () {

            const postData = {
                student: $scope.student,
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
                url: 'http://localhost:8762/posts/posts',
                data: postData
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
                url: 'http://localhost:8762/posts/posts/' + $scope.id,
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
                url: 'http://localhost:8762/posts/posts/' + $scope.id,
                data: postData
            }).then(function successCallback(response) {
                $location.path('/posts');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when updating post " + response.ExceptionMessage;
            });

        };

        // Delete the selected post from the list
        $scope.delete = function () {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8762/posts/posts/' + $scope.id
            }).then(function successCallback(response) {
                $location.path('/posts');
            }, function errorCallback(response) {
                $scope.error = "Something wrong when deleting post " + response.ExceptionMessage;
            });

        }
}]);
