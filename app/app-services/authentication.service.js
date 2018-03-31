(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {

            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('http://home.zivkovic.si/api/api-token-auth/', { email: username, password: password })
            $http.post(' http://127.0.0.1:8000/api-token-auth/', { email: username, password: password })
            .then(function (response) {
                //console.log(response);
                callback(response);
                
			}, function (error) {
                //console.log(error);
                callback(error);           
            });

        }

        function SetCredentials(username, authdata) {
          console.log(authdata);
                
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    //authdata: authdata
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
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

})();