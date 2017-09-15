angular.module('userControllers')
    .controller('userDoctorProfileCtrl', function ($routeParams, $location, serverSv) {
        var userDoctorProfile = this;
        userDoctorProfile.loading  = false;
        userDoctorProfile.profile = {};
        userDoctorProfile.init = function () {
            userDoctorProfile.loading  = true;
            serverSv.request('/account/doctors/get/' + $routeParams.id)
                .then(function (response) {
                    var data = response.data;
                    if(data.error)throw  data.error;
                    else userDoctorProfile.profile = data;
                }).catch(function (err) {
                    $location.path('/');
                    console.log(err);
                }).finally(function () {
                    userDoctorProfile.loading  = false;
                });
        };
        userDoctorProfile.init();

        userDoctorProfile.appointmentForm = {};
        userDoctorProfile.resetAppointmentForm = function () {
            userDoctorProfile.appointmentForm = {
                purpose: '',
                date: new Date()
            };
        };
        userDoctorProfile.submitAppointmentForm = function () {
            var preloader = new Dialog.preloader('Creating an appointment');
            var form = {
                doctor: userDoctorProfile.profile.uid,
                purpose: userDoctorProfile.appointmentForm.purpose,
                date: [userDoctorProfile.appointmentForm.date.getTime()]
            };
            serverSv.request('/appointment/request', {
                method: 'POST',
                data: form
            }).then(function (response) {
                var data = response.data;
                if(data.error) Dialog.alert('Unable to Create an appointment', data.error[1]);
                else {
                    Dialog.alert('Appointment Created', 'You have successfully created an appointment');
                    userDoctorProfile.resetAppointmentForm();
                }
            }).catch(function (err) {
                Dialog.alert('Unable to Create an appointment', 'An unknown error occurred');
            }).finally(function () {
                preloader.destroy();
            });
        };
    });