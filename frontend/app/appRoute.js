angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider

            //PUBLIC
            .when('/', {
                templateUrl: 'app/pages/public/home.html'
            })

            //PUBLIC
            .when('/signup', {
                templateUrl: 'app/pages/public/signup.html'
            })


            .otherwise({redirectTo: '/'});
    });