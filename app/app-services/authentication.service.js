(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$window', '$timeout', 'envService'];
    function AuthenticationService($http, $cookies, $rootScope, $window, $timeout, envService) {

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
            $window.localStorage.removeItem('jwtToken');
        }

        function saveJwtToken(jwtToken) {
            $window.localStorage.setItem('jwtToken', jwtToken);
            $rootScope.user = getUser();
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

        function getUser(){
            var jwtTokenData = getJwtTokenData();
            return {
                id: jwtTokenData.user_id,
                email: jwtTokenData.email
            };
        }

        function isLoggedIn(){
            var jwtToken = getJwtToken();
            if (jwtToken) {
                $rootScope.user = getUser();
                var expiryDate = getJwtTokenData().exp;
                return expiryDate > Date.now() / 1000;
            } else {
                return false;
            }
        }

        function getHeaders() {
            return {
                headers: {
                    Authorization: 'JWT ' + getJwtToken()
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
            saveJwtToken: saveJwtToken,
            getJwtToken: getJwtToken,
            isLoggedIn: isLoggedIn,
            getHeaders: getHeaders
        };

    }

})();