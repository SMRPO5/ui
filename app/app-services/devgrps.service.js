(function () {
    'use strict';

    angular
        .module('app')
        .factory('DevGrpsService', DevGrpsService);

    DevGrpsService.$inject = ['$http', 'envService', 'AuthenticationService'];

    function DevGrpsService($http, envService, AuthenticationService) {

        function getDeveloperGroups() {
            return $http.get(envService.read('apiUrl') + 'dev_groups/dev_groups/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all groups'));
        }

        function addDeveloperGroup(json) {
            return $http.post(envService.read('apiUrl') + 'dev_groups/dev_groups/', json, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating card'));
        }

        function removeDeveloperGroup(id) {
            return $http.delete(envService.read('apiUrl') + 'dev_groups/dev_groups/' + id + '/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error removing group'));
        }

        function editDeveloperGroup(id, json) {
            return $http.patch(envService.read('apiUrl') + 'dev_groups/dev_groups/' + id + '/', json, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error editing group'));
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
            getDeveloperGroups: getDeveloperGroups,
            addDeveloperGroup: addDeveloperGroup,
            removeDeveloperGroup: removeDeveloperGroup,
            editDeveloperGroup: editDeveloperGroup

        }
    }

})();
