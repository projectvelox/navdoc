angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider

            //PUBLIC
            .when('/', {
                templateUrl: 'app/pages/public/home.html',
                controller: 'homeCtrl',
                controllerAs: 'home'
            })

            .when('/signup', {
                templateUrl: 'app/pages/public/home.html',
                controller: 'homeCtrl',
                controllerAs: 'home'
            })

            .when('/login', {
                templateUrl: 'app/pages/public/login.html',
                controller: 'loginCtrl',
                controllerAs: 'login'
            })

            .when('/clinic-profile/:id', {
                templateUrl: 'app/pages/public/clinic-profile.html'
                //,
                //controller: '',
                //controllerAs: ''
            })


            //USERS
            .when('/user/appointment/:id', {
                templateUrl: 'app/pages/user/appointment.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/user/appointment-history', {
                templateUrl: 'app/pages/user/appointment-history.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/user/dashboard', {
                templateUrl: 'app/pages/user/dashboard.html',
                controller: 'userDashboardCtrl',
                controllerAs: 'dashboard',
                allowedUsers: ['user']
            })

            .when('/user/doctor-profile/:id', {
                templateUrl: 'app/pages/user/doctor-profile.html'
                //,
                //controller: '',
                //controllerAs: ''
            })


            .when('/user/feedback', {
                templateUrl: 'app/pages/user/feedback.html'
                //,
                //controller: '',
                //controllerAs: ''
            })
            
            .when('/user/profile', {
                templateUrl: 'app/pages/user/profile.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/user/searched-result', {
                templateUrl: 'app/pages/user/transaction-logs.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/user/clinic-list', {
                templateUrl: 'app/pages/user/clinic-list.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .otherwise({redirectTo: '/'});
    });