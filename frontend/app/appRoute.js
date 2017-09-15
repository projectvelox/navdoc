angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider
            .otherwise({redirectTo: '/'});
    });