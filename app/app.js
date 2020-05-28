var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'html/home/home.html',
        controller: 'HomeCtrl',
    }).otherwise({
        redirectTo: '/'
    });

});

app.controller("HomeCtrl", ['$scope', '$window',
    function ($scope, $window) {

        console.log($window.localStorage.getItem('username'));
        console.log($window.localStorage.getItem('token'));
        console.log($window.localStorage.getItem('role'));

        // Setting token
        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63342/microservices-angularjs/app/login.html');
        }

        $scope.username = $window.localStorage.getItem('username');

        $scope.add = function () {
            $window.localStorage.clear();
            window.location.assign('http://localhost:63342/microservices-angularjs/app/login.html');
        }

    }]);
