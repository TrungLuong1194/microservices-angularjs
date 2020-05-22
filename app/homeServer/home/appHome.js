var app = angular.module('myAppHome', ['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider.when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
    }).otherwise({
        redirectTo: '/home'
    });

});

app.controller("HomeCtrl", ['$scope', '$window',
    function ($scope, $window) {

        // Setting token
        const AUTH_STRING = $window.localStorage.getItem('token');
        if (!AUTH_STRING) {
            window.location.assign('http://localhost:63343/microservices-angularjs/app/userServer/login/index.html');
        }

        $scope.username = $window.localStorage.getItem('username');

        $scope.add = function () {
            $window.localStorage.clear();
            window.location.assign('http://localhost:63343/microservices-angularjs/app/userServer/login/index.html');
        }

    }]);
