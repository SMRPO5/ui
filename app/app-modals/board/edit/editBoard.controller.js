"use strict";
(function () {
    angular
        .module('app')
        .controller('EditBoardController', EditBoardController);

    EditBoardController.$inject = ['$rootScope', '$uibModalInstance', 'ModalProvider', 'board'];
    function EditBoardController($rootScope, $uibModalInstance, ModalProvider, board) {
        var vm = this;
        var allColumns = [];
        _.each(board.columns, function(column) {
            allColumns.push(column);
            _.each(column.subcolumns, function(subcolumn) {
                allColumns.push(subcolumn);
            });
        });

        board.columns.forEach(function(column, index) {
            generateTypes(allColumns, board.columns, index);

            board.columns[index].subcolumns.forEach(function(subcolumn, subcolumnIndex) {
                generateTypes(allColumns, board.columns[index].subcolumns, subcolumnIndex);
            });
        });

        vm.board = board;

        vm.editBoard = function() {
            // TODO
        };

        vm.createColumn = function() {
            ModalProvider.openCreateColumnModal(board).result.then(function(data){
                $scope.board = data;
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

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
