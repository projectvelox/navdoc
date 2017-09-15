angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider

            //PUBLIC
            .when('/', {
                templateUrl: 'app/pages/public/home.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/signup', {
                templateUrl: 'app/pages/public/signup.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/login', {
                templateUrl: 'app/pages/public/login.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            //USERS
            .when('/user/dashboard', {
                templateUrl: 'app/pages/user/dashboard.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .otherwise({redirectTo: '/'});
    });