(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$window', '$timeout', 'UserService', 'envService'];
    function AuthenticationService($http, $cookies, $rootScope, $window, $timeout, UserService, envService) {
        var service = {};
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.saveJwtToken = saveJwtToken;
        service.getJwtToken = getJwtToken;

        return service;

        function Login(username, password, callback) {

            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post(envService.read('apiUrl') + 'api-token-auth/', { email: username, password: password })
            .then(function (response) {
                callback(response);
			}, function (error) {
                callback(error);
            });
        }

        function SetCredentials(username, authdata) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common.Authorization = 'JWT ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'JWT';
        }

        function saveJwtToken(jwtToken) {
            $window.localStorage.setItem('jwtToken', jwtToken);
            $rootScope.username = getJwtTokenData().email;
        }

        function getJwtToken() {
            return $window.localStorage.getItem('jwtToken');
        }

        function getJwtTokenData(){
            var token = getJwtToken();
            if(!token) {
                return null;
            }
            return JSON.parse(b64Utf8(getJwtToken().split('.')[1]));
        }

        function b64Utf8(string) {
            return decodeURIComponent(Array.prototype.map.call($window.atob(string), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''));
        }

    }

})();