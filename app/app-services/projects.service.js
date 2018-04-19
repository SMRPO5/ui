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
            return $http.post(envService.read('apiUrl') + 'projects/projects/', json, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating card'));
        }

        function removeProject(id) {
            return $http.delete(envService.read('apiUrl') + 'projects/projects/' + id + '/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error removing project'));
        }

        function editProject(id, json) {
            return $http.patch(envService.read('apiUrl') + 'projects/projects/' + id + '/', json, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error editing group'));
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
            getColumnsForProject: getColumnsForProject,
            removeProject: removeProject,
            editProject: editProject
        }
    }

})();

