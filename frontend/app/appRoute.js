angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider

            //PUBLIC
            .when('/', {
                templateUrl: 'app/pages/public/home.html'
            })

            .when('/signup', {
                templateUrl: 'app/pages/public/signup.html'
            })

            .when('/login', {
                templateUrl: 'app/pages/public/login.html'
            })


            .otherwise({redirectTo: '/'});
    });