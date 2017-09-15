angular.module('doctorControllers')
    .controller('doctorAppointmentHistoryCtrl', function ($location, serverSv) {
        var appointmentHistory = this;
        appointmentHistory.list = [];
        appointmentHistory.convertDate = function (date) {
            return new Date(date);
        };
        appointmentHistory.init = function () {
            serverSv.request('/appointment/get/done')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data.error;
                    else appointmentHistory.list = data;
                    console.log(data);
                }).catch(function (err) {
                    $location.path('/');
                    throw err;
                }).finally(function () {

                });
        };
        appointmentHistory.init();
    });