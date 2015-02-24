'use strict';

(function () {
    var app = angular.module('harvesterApp', ['ngRoute', 'ngAnimate', 'ngSlider', 'angularFileUpload', 'angular-loading-bar', 'ngDialog', 'xeditable']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'apiController',
                templateUrl: 'app/views/control.html'
            })
            .when('/config', {
                controller: 'apiController',
                templateUrl: 'app/views/config.html'
            })
            .when('/control', {
                controller: 'apiController',
                templateUrl: 'app/views/control.html'
            })
            .when('/jobs', {
                controller: 'jobsController',
                templateUrl: 'app/views/jobs.html'
            })
            .when('/stats', {
                controller: 'statsController',
                templateUrl: 'app/views/stats.html'
            })
            .when('/agents', {
                controller: 'agentsController',
                templateUrl: 'app/views/agents.html'
            })
            .otherwise({redirectTo: '/'});
    });


}());


