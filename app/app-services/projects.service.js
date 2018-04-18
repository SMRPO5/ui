(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectsService', ProjectsService);

    ProjectsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function ProjectsService($http, envService, AuthenticationService) {

        function getProjects() {
            return $http.get(envService.read('apiUrl') + 'projects/projects/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all projects'));
        }

        function getProjectsForUser(userId) {
            // TODO
            return getProjects();
        }

        function addProject(json) {
            $http.post(envService.read('apiUrl') + 'projects/projects/', json, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating card'));
        }

        function getColumnsForProject(projectId) {
            return $http.get(envService.read('apiUrl') + 'projects/columns/?lane__project=' + projectId, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting columns'));
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
            getProjects: getProjects,
            getProjectsForUser: getProjectsForUser,
            addProject: addProject,
            getColumnsForProject: getColumnsForProject
        }
    }

})();
