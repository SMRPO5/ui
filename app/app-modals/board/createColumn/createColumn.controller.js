"use strict";
(function () {
    angular
        .module('app')
        .controller('CreateColumnController', CreateColumnController);

    CreateColumnController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance', 'board'];
    function CreateColumnController($rootScope, ProjectsService, $uibModalInstance, board) {
        var vm = this;
        var order = angular.isUndefined(board.columns[board.columns.length - 1]) ? 0 : board.columns[board.columns.length - 1].order + 1

        vm.column = {
            name: "",
            board: board.id,
            order: order,
            card_limit: 0,
            first_boundary_column: false,
            second_boundary_column: false,
            high_priority_column: false,
            acceptance_ready_column: false
        };

        vm.createColumn = function() {
            ProjectsService.createColumn(vm.column).then(function(response) {
                if (response.status === 201) {
                    $uibModalInstance.close(response.data);
                }
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
