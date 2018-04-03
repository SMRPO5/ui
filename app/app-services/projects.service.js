(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectsService', ProjectsService);

    ProjectsService.$inject = ['$http'];
    function ProjectsService($http) {
        var service = {};

        service.GetAll = GetAll;

        return service;


        function GetAll() {
            return $http.get('http://localhost:8000/projects/projects/').then(handleSuccess, handleError('Error getting all groups'));
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
