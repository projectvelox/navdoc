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
    });