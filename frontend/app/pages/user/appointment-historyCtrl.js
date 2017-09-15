angular.module('userControllers')
    .controller('userAppointmentHistoryCtrl', function ($location, serverSv) {
        var userAppointmentHistory = this;
        userAppointmentHistory.loading = false;
        userAppointmentHistory.doneAppointments = [];

        userAppointmentHistory.init = function () {
            userAppointmentHistory.loading = true;
            serverSv.request('/appointment/get/done')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Cannot Get Data', data.error[1]);
                    else userAppointmentHistory.doneAppointments = data;
                }).catch(function (err) {
                    Dialog.alert('Cannot Get Data', 'An unknown error occurred');
                    $location.path('/');
                }).finally(function () {
                userAppointmentHistory.loading = false;
                });
        };
        userAppointmentHistory.init();
    });