(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectsService', ProjectsService);

    ProjectsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function ProjectsService($http, envService, AuthenticationService) {

        function getProjects() {
            return $http.get(envService.read('apiUrl') + 'projects/projects/', AuthenticationService.getHeaders())
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
            getProjects: getProjects
        }
    }

})();
