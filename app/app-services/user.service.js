(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http','envService'];
    function UserService($http,envService) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(envService.read('apiUrl') + 'users/users/').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(envService.read('apiUrl') +'/users/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(envService.read('apiUrl') + '/users/user/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post(envService.read('apiUrl') + '/users/user/', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put(envService.read('apiUrl') + '/users/user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(envService.read('apiUrl') + '/users/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
