angular.module('publicControllers')
    .controller('loginCtrl', function ($location, serverSv, appSv) {
        var login = this;
        login.errorMessage = undefined;
        login.form = {};
        login.rememberMe = false;
        login.redirectToDashbord = function () {
            var preloader = new Dialog.preloader('Authenticating...');
            serverSv.auth.me()
                .then(function (response) {
                    var data = response.data;
                    if(data.error) throw data;
                    else $location.path(appSv.getUserPath(data.account_type) + '/dashboard');
                })
                .catch(function (err) {
                    $location.path('/');
                })
                .finally(function () {
                    preloader.destroy();
                });
        };
        login.resetForm = function () {
            login.form = {
                email: sessionStorage.getItem('remember.Email') || '',
                password: sessionStorage.getItem('remember.Password') || ''
            };
            if(login.form.email != '' || login.form.password != '')
                login.rememberMe = true;
        };
        login.submitForm = function () {
            var preloader = new Dialog.preloader('Logging in...');
            login.errorMessage = undefined;
            serverSv.auth.login(login.form)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) login.errorMessage = data.error[1];
                    else if(data.session_token) {
                        serverSv.auth.key(data.session_token);
                        if(login.rememberMe) {
                            sessionStorage.setItem('remember.Email', login.form.email);
                            sessionStorage.setItem('remember.Password', login.form.password);
                        } else {
                            sessionStorage.removeItem('remember.Email');
                            sessionStorage.removeItem('remember.Password');
                        }
                        login.redirectToDashbord();
                    }
                    else throw data;
                })
                .catch(function (err) {
                    login.errorMessage = 'An unknown error occurred';
                    throw err;
                })
                .finally(function () {
                    preloader.destroy();
                });
        };
        login.resetForm();
    });