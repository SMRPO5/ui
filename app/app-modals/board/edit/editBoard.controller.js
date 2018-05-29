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
                        _.remove(vm.board.columns[parentIndex].subcolumns, function(col){
                            return col.id === column.id;
                        });
                    });
                }
            });
        };

        vm.columnMoved = function(column, subcolumn, index) {
            if(subcolumn === undefined) {
                vm.board.columns.splice(index, 1);
            } else {
                column.subcolumns.splice(index, 1);
                subcolumn.parent = null;
            }
            // Bottom code makes sure that column.canDelete updates for column and subcolumn after every move...
            _.each(vm.board.columns, function(column) {
                recheckIfColumnCanBeDeleted(column);
                _.each(column.subcolumns, function(subcolumn) {
                    recheckIfColumnCanBeDeleted(subcolumn);
                });
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
            columns[index].allowedTypes = _.map(clonedAllCols, function(c) {
                return getColumnType(c);
            });
            columns[index].type = getColumnType(columns[index]);
            recheckIfColumnCanBeDeleted(columns[index]);
        }

        function recheckIfColumnCanBeDeleted(column) {
            var canDelete = !column.has_cards && ((column.subcolumns.length === 0 && column.parent === null) || column.parent !== null);
            column.canDelete = canDelete;
            column.tooltip = !canDelete ? 'Cards or subcolumns are present. Cannot delete!': 'Delete column.';
        }

    }

})();
