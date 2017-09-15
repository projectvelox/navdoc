angular.module('doctorControllers')
    .controller('doctorAppointmentRequestsCtrl', function ($location, serverSv) {
        var appointmentRequests = this;
        appointmentRequests.loading = false;
        appointmentRequests.list = [];
        appointmentRequests.convertDate = function (date) {
            return new Date(date);
        };
        appointmentRequests.init = function () {
            appointmentRequests.loading = true;
            serverSv.request('/appointment/get/pending')
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data.error;
                    else appointmentRequests.list = data;
                    console.log(data);
                }).catch(function (err) {
                    $location.path('/');
                    throw err;
                }).finally(function () {
                    appointmentRequests.loading = false;
                });
        };
        appointmentRequests.createTransaction = function(appointment){
            serverSv.request('/transaction/create', {
                method: 'POST',
                data: {
                    source: appointment.uid,
                    amount: appointment.doctor.rate,
                    description: 'Consultation Fee',
                    trans_type: appointment.trans_type
                }
            }).then(function (response) {
                 var data = response.data;
                 console.log(data);
            });
        };
        appointmentRequests.accept = function (index) {
            var preloader = new Dialog.preloader('Accepting patient');
            serverSv.request('/appointment/accept/' + appointmentRequests.list[index].uid)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Unable to Proceed', data.error[1]);
                    else {
                        appointmentRequests.createTransaction(appointmentRequests.list[index]);
                        Dialog.alert('Accepted', 'Transaction accepted');
                        appointmentRequests.list.splice(index, 1);
                    }
                }).catch(function (err) {
                    Dialog.alert('Unable to Proceed', 'An unknown error occurred');
                }).finally(function () {
                    preloader.destroy();
                });
        };
        appointmentRequests.decline = function (index) {
            var preloader = new Dialog.preloader('Declining patient');
            serverSv.request('/appointment/decline/' + appointmentRequests.list[index].uid)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Unable to Proceed', data.error[1]);
                    else{
                        appointmentRequests.list.splice(index, 1);
                        Dialog.alert('Accepted', 'Transaction accepted');
                    }
                }).catch(function (err) {
                    Dialog.alert('Unable to Proceed', 'An unknown error occurred');
                }).finally(function () {
                var preloader = new Dialog.preloader('Accepting patient');
                    preloader.destroy();
                });
        };
        appointmentRequests.init();
    });