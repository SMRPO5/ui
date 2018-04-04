(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectsService', ProjectsService);

    ProjectsService.$inject = ['$http', 'envService'];
    function ProjectsService($http, envService) {
        var service = {};

        service.GetAll = GetAll;

        return service;

        // Samo za testiranje je /users/users/, ker /project/project/ API-ja še ni
        function GetAll() {
            return $http.get(envService.read('apiUrl') + 'users/users/').then(handleSuccess, handleError('Error getting all groups'));
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
