angular.module('serverService', [])
    .factory('serverSv', function ($http) {
        var host = 'http://192.168.43.126:2162';
        var service = {
            getHost: function () {
                return host;
            },
            request: function (path, config) {
                config = config || {};
                config.url = host + path;
                config.method = config.method || 'GET';
                config.responseType = config.responseType || 'json';
                config.timeout = config.timeout || 30000;
                config.headers = config.headers || {
                    'Content-Type': 'application/json',
                    'Session-Token': service.auth.key()
                };
                return $http(config);
            },
            auth: {
                key: function (newKey) {
                    if(newKey) sessionStorage.setItem('authKey', newKey);
                    else return sessionStorage.getItem('authKey');
                },
                signUp: function (data) {
                    return service.request('/account/register', {
                        method: 'POST',
                        data: data
                    });
                },
                login: function (data) {
                    return service.request('/account/login', {
                        method: 'POST',
                        data: data
                    });
                },
                logout: function () {
                    return service.request('/account/logout');
                },
                me: function () {
                    return service.request('/account/me');
                }
            }
        };
        return service;
    });