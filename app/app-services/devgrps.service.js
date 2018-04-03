(function () {
    'use strict';

    angular
        .module('app')
        .factory('DevGrpsService', DevGrpsService);

    DevGrpsService.$inject = ['$http'];
    function DevGrpsService($http) {
        var service = {};

        service.GetAll = GetAll;

        return service;


        function GetAll() {
            return $http.get('http://localhost:8000/dev_groups/dev_groups/').then(handleSuccess, handleError('Error getting all groups'));
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
