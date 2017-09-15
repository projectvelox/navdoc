angular.module('mainController', [])
    .controller('mainCtrl', function ($scope, $location, serverSv, appSv) {
        var main = this;
        main.pageLoading = false;
        main.getUserPath = function () {
            if(main.user) return appSv.getUserPath(main.user.account_type);
            return '';
        };
        main.logout = function () {
            var preloader = new Dialog.preloader('Logging out...');
            serverSv.auth.logout()
                .then(function (response) {
                    var data = response.data;
                    if(data.error) Dialog.alert('Logout Failed', data.error[1]);
                    else {
                        $location.path('/');
                        main.user = undefined;
                    }
                })
                .catch(function (err) {
                    Dialog.alert('Logout Failed', 'An unknown error occurred');
                })
                .finally(function () {
                    preloader.destroy();
                });
        };
        $scope.$on('$routeChangeStart', function (event, next) {
            var isAuthorized = function () {
                if(!next.allowedUsers) return true;
                else if(!main.user) return false;
                else return next.allowedUsers.indexOf(main.user.account_type) > -1;
            };
            if(!next.redirectTo){
                if(main.pageLoading) event.preventDefault();
                else {
                    main.pageLoading = true;
                    serverSv.auth.me()
                        .then(function (response) {
                            var data = response.data;
                            if (data.error) throw data;
                            else main.user = data;
                        }).catch(function () {
                            main.user = undefined;
                        }).finally(function () {
                            main.pageLoading = false;
                            if (!isAuthorized()) $location.path('/');
                            $scope.$broadcast('pageValidated', {});
                        });
                }
            }
        });
    });