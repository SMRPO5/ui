"use strict";
(function () {
    angular
        .module('app')
        .controller('CreateColumnController', CreateColumnController);

    CreateColumnController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance', 'board'];
    function CreateColumnController($rootScope, ProjectsService, $uibModalInstance, board) {
        var vm = this;

        vm.column = {
            name: "",
            board: board.id,
            order: 0,
            card_limit: 0,
            first_boundary_column: false,
            second_boundary_column: false,
            high_priority_column: false,
            acceptance_ready_column: false
        };

        vm.createColumn = function() {

            console.log("Creating column");
            console.log(vm.column);

            ProjectsService.createColumn(vm.column).then(function(response) {
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
