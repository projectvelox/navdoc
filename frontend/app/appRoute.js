angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider

            //ADMIN
            .when('/admin/dashboard', {
                templateUrl: 'app/pages/admin/dashboard.html'
                //,
                //controller: ,
                //controllerAs: 
            })

            .when('/admin/doctor-profile/:id', {
                templateUrl: 'app/pages/admin/doctor-profile.html'
                //,
                //controller: ,
                //controllerAs: 
            })

            //PUBLIC
            .when('/', {
                templateUrl: 'app/pages/public/home.html',
                controller: 'homeCtrl',
                controllerAs: 'home'
            })

            .when('/signup', {
                templateUrl: 'app/pages/public/signup.html',
                controller: 'signupCtrl',
                controllerAs: 'signup'
            })

            .when('/login', {
                templateUrl: 'app/pages/public/login.html',
                controller: 'loginCtrl',
                controllerAs: 'login'
            })

            .when('/clinic-profile/:id', {
                templateUrl: 'app/pages/public/clinic-profile.html',
                controller: 'clinicProfileCtrl',
                controllerAs: 'clinicProfile'
            })


            //USERS
            .when('/user/appointment/:id', {
                templateUrl: 'app/pages/user/appointment.html',
                controller: 'appointmentCtrl',
                controllerAs: 'appointment',
                allowedUsers: ['user']
            })

            .when('/user/appointment-history', {
                templateUrl: 'app/pages/user/appointment-history.html',
                controller: 'userAppointmentHistoryCtrl',
                controllerAs: 'userAppointmentHistory',
                allowedUsers: ['user']
            })

            .when('/user/dashboard', {
                templateUrl: 'app/pages/user/dashboard.html',
                controller: 'userDashboardCtrl',
                controllerAs: 'dashboard',
                allowedUsers: ['user']
            })

            .when('/user/doctor-profile/:id', {
                templateUrl: 'app/pages/user/doctor-profile.html',
                controller: 'userDoctorProfileCtrl',
                controllerAs: 'userDoctorProfile',
                allowedUsers: ['user']
            })


            .when('/user/feedback', {
                templateUrl: 'app/pages/user/feedback.html'
                //,
                //controller: '',
                //controllerAs: ''
            })
            
            .when('/user/profile', {
                templateUrl: 'app/pages/user/profile.html',
                controller: 'userProfileCtrl',
                controllerAs: 'userProfile',
                allowedUsers: ['user']
            })

            .when('/user/transaction-logs', {
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

            .when('/user/user-details', {
                templateUrl: 'app/pages/user/user-details.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/user/health-bot', {
                templateUrl: 'app/pages/user/health-bot.html',
                controller: 'userHealthBotCtrl',
                controllerAs: 'healthBot'//,
                //allowedUsers: ['user']
            })

            //DOCTORS
            .when('/doctor/dashboard', {
                templateUrl: 'app/pages/doctor/dashboard.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/doctor/appointment/requests', {
                templateUrl: 'app/pages/doctor/appointmentRequests.html',
                controller: 'doctorAppointmentRequestsCtrl',
                controllerAs: 'appointmentRequests'
            })

            .when('/doctor/appointment/upcoming', {
                templateUrl: 'app/pages/doctor/appointmentUpcoming.html',
                controller: 'doctorAppointmentUpcomingCtrl',
                controllerAs: 'appointmentUpcoming'
            })

            .when('/doctor/appointment/history', {
                templateUrl: 'app/pages/doctor/appointmentHistory.html',
                controller: 'doctorAppointmentHistoryCtrl',
                controllerAs: 'appointmentHistory'
            })

            .when('/doctor/settings', {
                templateUrl: 'app/pages/doctor/settings.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/doctor/appointment-details/:id', {
                templateUrl: 'app/pages/doctor/appointment.html'
                //,
                //controller: '',
                //controllerAs: ''
            })




            .when('/doctor/appointments', {
                templateUrl: 'app/pages/doctor/appointments.html'
                //,
                //controller: '',
                //controllerAs: ''
            })
            .when('/doctor/user-details', {
                templateUrl: 'app/pages/doctor/user-details.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .when('/doctor/user-profile/:id', {
                templateUrl: 'app/pages/doctor/user-profile.html'
                //,
                //controller: '',
                //controllerAs: ''
            })

            .otherwise({redirectTo: '/'});
    });