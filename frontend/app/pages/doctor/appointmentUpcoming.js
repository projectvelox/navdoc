angular.module('doctorControllers')
    .controller('doctorAppointmentUpcomingCtrl', function ($location, serverSv) {
        var appointmentUpcoming = this;
        appointmentUpcoming.loading = false;
        appointmentUpcoming.list = [];
        appointmentUpcoming.convertDate = function (date) {
            return new Date(date);
        };
        appointmentUpcoming.init = function () {
            serverSv.request('/appointment/get/approved')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data.error;
                    else appointmentUpcoming.list = data;
                    console.log(data);
                }).catch(function (err) {
                    $location.path('/');
                    throw err;
                }).finally(function () {

                });
        };
        appointmentUpcoming.acknowledgeTransaction = function (appointment) {
            serverSv.request('/transaction/appt_ack/' + appointment.uid)
                .then(function (response) {
                     var data = response.data;
                     console.log(data);
                }).catch(function () {

                });
        };
        appointmentUpcoming.acknowledge = function (index) {
            var preloader = new Dialog.preloader('Acknowledging Transaction');
            serverSv.request('/appointment/finish/' + appointmentUpcoming.list[index].uid)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Failed to acknowledge',data.error[1]);
                    else {
                        appointmentUpcoming.acknowledgeTransaction(appointmentUpcoming.list[index]);
                        appointmentUpcoming.list.splice(index, 1);
                        Dialog.alert('Transaction Success', 'Transaction acknowledged.');
                    }
                }).catch(function (err) {
                    Dialog.alert('Failed to acknowledge', 'An unknown error occurred');
                }).finally(function () {
                    preloader.destroy();
                });
        };
        appointmentUpcoming.init();
    });