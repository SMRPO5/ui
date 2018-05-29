"use strict";
(function () {

    angular
        .module('app')
        .factory('ProjectsService', ProjectsService);

    ProjectsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function ProjectsService($http, envService, AuthenticationService) {

        function getBoards() {
            return $http.get(envService.read('apiUrl') + 'projects/boards/', AuthenticationService.getHeaders());
        }

        function getBoard(boardId) {
            return $http.get(envService.read('apiUrl') + 'projects/boards/' + boardId + '/', AuthenticationService.getHeaders());
        }

        function copyBoard(boardId) {
            return $http.post(envService.read('apiUrl') + 'projects/board_copy/' + boardId + '/', {}, AuthenticationService.getHeaders());
        }

        function getLanesForBoard(boardId) {
            return $http.get(envService.read('apiUrl') + 'projects/lanes/?project__board=' + boardId, AuthenticationService.getHeaders());
        }
        function createBoard(board) {
            return $http.post(envService.read('apiUrl') + 'projects/boards/', board, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting boards'));
        }

        function editBoard(board) {
            var data = {
                board: board.id,
                board_name: board.name,
                columns: board.columns
            };
            return $http.post(envService.read('apiUrl') + 'projects/board_update/', data, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error editing board'));
        }

        function sendReasonForWipViolation(cardId, columnId, reason) {
            var data = {
                card: cardId,
                column: columnId,
                reason: reason
            };
            return $http.post(envService.read('apiUrl') + 'projects/wip_violations/', data, AuthenticationService.getHeaders());
        }

        function getProjects() {
            return $http.get(envService.read('apiUrl') + 'projects/projects/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all projects'));
        }
        function getProject(id) {
            return $http.get(envService.read('apiUrl') + 'projects/projects/' + id + '/', AuthenticationService.getHeaders())
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
            return $http.get(envService.read('apiUrl') + 'projects/columns/?parent_only=True&ordering=order&lane__project=' + projectId, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting columns'));
        }

        function createColumn(column) {
            return $http.post(envService.read('apiUrl') + 'projects/columns/', column, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating column'));
        }

        function editColumn(column) {
            var columnData = Object.assign({}, column);
            delete columnData.subcolumns;// Subcolumns must not be present!
            return $http.patch(envService.read('apiUrl') + 'projects/columns/' + column.id + '/', columnData, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating column'));
        }

        function deleteColumn(column) {
            return $http.delete(envService.read('apiUrl') + 'projects/columns/' + column.id + '/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating column'));
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
            getBoards: getBoards,
            getBoard: getBoard,
            getLanesForBoard: getLanesForBoard,
            sendReasonForWipViolation: sendReasonForWipViolation,
            getProjects: getProjects,
            getProject: getProject,
            getProjectsForUser: getProjectsForUser,
            addProject: addProject,
            getColumnsForProject: getColumnsForProject,
            removeProject: removeProject,
            editProject: editProject,
            createBoard: createBoard,
            createColumn: createColumn,
            deleteColumn: deleteColumn,
            editColumn: editColumn,
            editBoard: editBoard,
            copyBoard: copyBoard
        }
    }

})();

