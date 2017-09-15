angular.module('publicControllers')
    .controller('signupCtrl', function ($location, serverSv, appSv) {
        var signup = this;
        signup.errorMessage = undefined;
        signup.form = {};

        signup.submitForm = function () {
            if(signup.form.password != signup.form.repassword) signup.errorMessage = 'Password doesn\'t match';
            else {
                var preloader = new Dialog.preloader('Signing up...');
                signup.errorMessage = undefined;
                serverSv.auth.signUp(signup.form)
                    .then(function (response) {
                        var data = response.data;
                        if(data.error) signup.errorMessage = data.error[1];
                        else if(data.session_token) {
                            serverSv.auth.key(data.session_token);
                            $location.path(appSv.getUserPath(data.account_type) + '/dashboard');
                        }
                        else throw data;
                    })
                    .catch(function (err) {
                        signup.errorMessage = 'An unknown error occurred';
                        throw err;
                    })
                    .finally(function () {
                        preloader.destroy();
                    });
            }
        };
        signup.resetForm = function () {
            signup.form = {
                email: '',
                username: '',
                password: '',
                repassword: '',
                account_type: 'user'
            };
        };
        signup.resetForm();
    });