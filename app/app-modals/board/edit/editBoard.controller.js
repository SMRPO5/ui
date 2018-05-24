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
                if(response.status === 200) {
                    $uibModalInstance.close(response.data);
                }
            });
        };

        vm.createColumn = function() {
            ModalProvider.openCreateColumnModal(vm.board).result.then(function(column){
                debugger;
                vm.board.columns.push(column);
                generateAllColumnTypes(vm.board);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
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
        }

    }

})();
