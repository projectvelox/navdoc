angular.module('userControllers')
    .controller('userHistoryAppointmentsCtrl', function ($location, serverSv) {
        var appointments = this;
        appointments.list = [];
        appointments.loading = false;
        appointments.convertDate = function (date) {
            return new Date(date);
        };
        appointments.init = function () {
            appointments.loading = true;
            serverSv.request('/appointment/get/done')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data.error;
                    else appointments.list = data;
                    console.log(data);
                }).catch(function (err) {
                $location.path('/');
                throw err;
            }).finally(function () {
                appointments.loading = false;
            });
        };
        appointments.init();
    });