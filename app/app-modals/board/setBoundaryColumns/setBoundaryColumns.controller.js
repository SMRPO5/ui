"use strict";
(function () {
    angular
        .module('app')
        .controller('SetBoundaryColumnsController', SetBoundaryColumnsController);

    SetBoundaryColumnsController.$inject = ['$q', 'ProjectsService', '$uibModalInstance', 'board', 'deletedColumn'];
    function SetBoundaryColumnsController($q, ProjectsService, $uibModalInstance, board, deletedColumn) {
        var vm = this;

        vm.columns = board.columns;
        _.each(board.columns, function(column) {
            vm.columns = vm.columns.concat(column.subcolumns);
        });

        if(deletedColumn.first_boundary_column) {
            vm.showFirstBoundaryColumnSelector = true;
        }
        if(deletedColumn.second_boundary_column) {
            vm.showSecondBoundaryColumnSelector = true;
        }
        if(deletedColumn.high_priority_column) {
            vm.showHighPriorityColumnSelector = true;
        }
        if(deletedColumn.acceptance_ready_column) {
            vm.showAcceptanceReadyColumnSelector = true;
        }

        vm.setBoundaryColumns = function() {
            var promises = [];
            if(vm.showFirstBoundaryColumnSelector) {
                var column = vm.first_boundary_column;
                column.first_boundary_column = true;
                promises.push(ProjectsService.editColumn(column));
            }
            if(vm.showSecondBoundaryColumnSelector) {
                var column = vm.second_boundary_column;
                column.second_boundary_column = true;
                promises.push(ProjectsService.editColumn(column));
            }
            if(vm.showHighPriorityColumnSelector) {
                var column = vm.high_priority_column;
                column.high_priority_column = true;
                promises.push(ProjectsService.editColumn(column));
            }
            if(vm.showAcceptanceReadyColumnSelector) {
                var column = vm.acceptance_ready_column;
                column.acceptance_ready_column = true;
                promises.push(ProjectsService.editColumn(column));
            }

            $q.all(promises).then(function() {
                $uibModalInstance.close(board);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
