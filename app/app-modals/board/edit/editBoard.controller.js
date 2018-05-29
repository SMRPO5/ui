"use strict";
(function () {
    angular
        .module('app')
        .controller('EditBoardController', EditBoardController);

    EditBoardController.$inject = ['$rootScope', '$uibModalInstance', 'ModalProvider', 'ProjectsService', 'board'];
    function EditBoardController($rootScope, $uibModalInstance, ModalProvider, ProjectsService, board) {
        var vm = this;
        var allColumns = [];
        vm.board = board;

        generateAllColumnTypes(vm.board);

        vm.editBoard = function() {
            ProjectsService.editBoard(vm.board).then(function(response) {
                if(response.status === 201) {
                    $uibModalInstance.close(response.data);
                }
            });
        };

        vm.createColumn = function() {
            ModalProvider.openCreateColumnModal(vm.board).result.then(function(column){
                vm.board.columns.push(column);
                generateAllColumnTypes(vm.board);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };

        vm.editColumn = function(column) {
            ModalProvider.openEditColumnModal(vm.board, column).result.then(function(editedColumn) {
                column = editedColumn;
            });
        };

        vm.deleteColumn = function(column, isParentColumn) {
            if(!column.canDelete) {
                return;
            }
            ProjectsService.deleteColumn(column).then(function() {
                if(column.first_boundary_column || column.second_boundary_column ||
                    column.high_priority_column || column.acceptance_ready_column) {
                    ModalProvider.openSetBoundaryColumnsModal(vm.board, column).result.then(function(updatedBoard) {
                        vm.board = updatedBoard;
                    });
                }
                if(isParentColumn) {
                    _.remove(vm.board.columns, function(col){
                        return col.id === column.id;
                    });
                } else {
                    _.each(vm.board.columns, function(parentColumn, parentIndex) {
                        _.remove(vm.board.columns[parentIndex], function(col){
                            return col.id === column.id;
                        });
                    });
                }
            });
        };

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        function generateAllColumnTypes(currentBoard) {
            allColumns = [];

            _.each(currentBoard.columns, function(column) {
                allColumns.push(column);
                _.each(column.subcolumns, function(subcolumn) {
                    allColumns.push(subcolumn);
                });
            });

            currentBoard.columns.forEach(function(column, index) {
                generateTypes(allColumns, currentBoard.columns, index);

                currentBoard.columns[index].subcolumns.forEach(function(subcolumn, subcolumnIndex) {
                    generateTypes(allColumns, currentBoard.columns[index].subcolumns, subcolumnIndex);
                });
            });
        }

        function getColumnType(column) {
            return column.id + "-" + column.name;
        }

        function generateTypes(allColumns, columns, index) {
            var clonedAllCols = _.filter(allColumns, function(col) {
                return col.id !== columns[index].id;
            });
            var canDelete = columns[index].has_cards || columns[index].subcolumns.length === 0;
            columns[index].allowedTypes = _.map(clonedAllCols, function(c) {
                return getColumnType(c);
            });
            columns[index].type = getColumnType(columns[index]);
            columns[index].canDelete = canDelete;
            columns[index].tooltip = !canDelete ? 'Cards or subcolumns are present. Cannot delete!': 'Delete column.';
        }

    }

})();