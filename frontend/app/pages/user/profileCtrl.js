angular.module('userControllers')
    .controller('userProfileCtrl', function ($location, serverSv) {
        var userProfile = this;
        userProfile.loading = false;
        userProfile.profile = {};
        userProfile.pendingAppointments = [];
        userProfile.upcomingAppointments = [];
        userProfile.convertDate = function (d) {
            return new Date(d);
        };

        userProfile.loadProfile = function (callback) {
            serverSv.auth.me()
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Cannot Get Data', data.error[1]);
                    else userProfile.profile = data;
                }).catch(function (err) {
                    Dialog.alert('Cannot Get Data', 'An unknown error occurred');
                    $location.path('/');
                }).finally(function () {
                    callback();
                });
        };
        userProfile.loadPendingAppointments = function (callback) {
            serverSv.request('/appointment/get/pending')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Cannot Get Data', data.error[1]);
                    else userProfile.pendingAppointments = data;
                }).catch(function (err) {
                    Dialog.alert('Cannot Get Data', 'An unknown error occurred');
                    $location.path('/');
                }).finally(function () {
                    callback();
                });
        };
        userProfile.loadUpcomingAppointments = function (callback) {
            serverSv.request('/appointment/get/approved')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Cannot Get Data', data.error[1]);
                    else userProfile.upcomingAppointments = data;
                }).catch(function (err) {
                    Dialog.alert('Cannot Get Data', 'An unknown error occurred');
                    $location.path('/');
                }).finally(function () {
                    callback();
                });
        };

        userProfile.init = function () {
            userProfile.loading = true;
            userProfile.loadProfile(function () {
                userProfile.loadPendingAppointments(function () {
                    userProfile.loadUpcomingAppointments(function () {
                        userProfile.loading = false;
                    });
                });
            });
        };
        userProfile.init();
    });