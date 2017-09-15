angular.module('appService', [])
    .factory('appSv', function () {
        var userPaths = {
            user: '/user',
            doctor: '/doctor'
        };
        return {
            getUserPath: function (account_type) {
                return userPaths[account_type];
            }
        };
    });