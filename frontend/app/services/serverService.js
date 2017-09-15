angular.module('serverService', [])
    .factory('serverSv', function ($http) {
        var host = 'http://127.0.0.1';
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
                }
            }
        };
        return service;
    });