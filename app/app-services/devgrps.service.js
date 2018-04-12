(function () {
    'use strict';

    angular
        .module('app')
        .factory('DevGrpsService', DevGrpsService);

    DevGrpsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function DevGrpsService($http, envService, AuthenticationService) {

        function getDevelopmentGroups() {
            return $http.get(envService.read('apiUrl') + 'dev_groups/dev_groups/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all groups'));
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
            getDevelopmentGroups: getDevelopmentGroups
        }
    }

})();
