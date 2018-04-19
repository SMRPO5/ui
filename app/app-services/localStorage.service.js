(function() {
    'use strict';

    angular
        .module('app')
        .factory('LocalStorage', LocalStorage);

    LocalStorage.$inject = ['$window'];
    function LocalStorage($window) {

        function saveJwtToken(jwtToken) {
            $window.localStorage.setItem('jwtToken', jwtToken);
        }

        function getJwtToken() {
            return $window.localStorage.getItem('jwtToken');
        }

        function saveUser(user) {
            $window.localStorage.setItem('user', JSON.stringify(user));
        }

        function getUser() {
            return JSON.parse($window.localStorage.getItem('user'));
        }

        function clear() {
            $window.localStorage.removeItem('jwtToken');
            $window.localStorage.removeItem('user');
        }

        return {
            saveJwtToken: saveJwtToken,
            getJwtToken: getJwtToken,
            saveUser: saveUser,
            getUser: getUser,
            clear: clear
        };
    }

})();
