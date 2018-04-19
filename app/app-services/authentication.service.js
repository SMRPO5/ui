(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$window', 'envService', 'LocalStorage'];
    function AuthenticationService($http, $window, envService, LocalStorage) {

        function loginUser(username, password, callback) {
            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post(envService.read('apiUrl') + 'api-token-auth/', { email: username, password: password })
            .then(function (response) {
                callback(response);
			}, function (error) {
                callback(error);
            });
        }

        function logoutUser(){
            LocalStorage.clear();
        }

        function getJwtTokenData(){
            var token = LocalStorage.getJwtToken();
            if(!token) {
                return null;
            }
            return JSON.parse(b64Utf8(token.split('.')[1]));
        }

        function isLoggedIn(){
            var jwtToken = LocalStorage.getJwtToken();
            if (jwtToken) {
                var expiryDate = getJwtTokenData().exp;
                return expiryDate > Date.now() / 1000;
            } else {
                return false;
            }
        }

        function getHeaders() {
            return {
                headers: {
                    Authorization: 'JWT ' + LocalStorage.getJwtToken()
                }
            }
        }

        function b64Utf8(string) {
            return decodeURIComponent(Array.prototype.map.call($window.atob(string), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''));
        }

        return {
            loginUser: loginUser,
            logoutUser: logoutUser,
            isLoggedIn: isLoggedIn,
            getHeaders: getHeaders
        };

    }

})();