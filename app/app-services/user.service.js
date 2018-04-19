(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$q', 'envService', 'LocalStorage', 'AuthenticationService'];
    function UserService($http, $q, envService, LocalStorage, AuthenticationService) {

        function getUsers() {
            return $http.get(envService.read('apiUrl') + 'users/users/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all users'));
        }

        function getMe() {
            var me = LocalStorage.getUser();
            if(me !== null) {
                return $q.when(me);
            }
            return $http.get(envService.read('apiUrl') + 'users/me/', AuthenticationService.getHeaders())
                .then(function(result) {
                    if(result.status === 200) {
                        var user = result.data[0];
                        LocalStorage.saveUser(user);
                        return user;
                    }
                }
            );
        }

        function getUserById(id) {
            return $http.get(envService.read('apiUrl') +'/users/user/' + id, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting user by id'));
        }

        function getUserByUsername(username) {
            return $http.get(envService.read('apiUrl') + '/users/user/' + username, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting user by username'));
        }

        function createUser(user) {
            return $http.post(envService.read('apiUrl') + '/users/user/', user, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating user'));
        }

        function updateUser(user) {
            return $http.put(envService.read('apiUrl') + '/users/user/' + user.id, user, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error updating user'));
        }

        function deleteUser(id) {
            return $http.delete(envService.read('apiUrl') + '/users/user/' + id, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

        return {
            getUsers: getUsers,
            getMe: getMe,
            getUserById: getUserById,
            getUserByUsername: getUserByUsername,
            createUser: createUser,
            updateUser: updateUser,
            deleteUser: deleteUser
        };
    }

})();
