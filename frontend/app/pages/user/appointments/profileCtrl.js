angular.module('userControllers')
    .controller('userAppointmentProfileCtrl', function ($routeParams, $location, serverSv) {
        var appointment = this;
        appointment.loading = false;
        appointment.profile = {};
        appointment.init = function () {
            serverSv.request('/appointment/get_single/' + $routeParams.id)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data;
                    else appointment.profile = data;
                    console.log(data);
                }).catch(function (err) {
                    $location.path('/');
                    throw err;
                });
        };
        appointment.init();
    });