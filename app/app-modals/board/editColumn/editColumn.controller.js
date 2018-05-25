"use strict";
(function () {
    angular
        .module('app')
        .controller('EditColumnController', EditColumnController);

    EditColumnController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance', 'board', 'column'];
    function EditColumnController($rootScope, ProjectsService, $uibModalInstance, board, column) {
        var vm = this;

        vm.column = column;

        vm.editColumn = function() {
            ProjectsService.editColumn(vm.column).then(function(response) {
                if (response.status === 200) {
                    $uibModalInstance.close(response.data);
                }
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
