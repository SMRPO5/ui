"use strict";
(function () {
    angular
        .module('app')
        .controller('EditColumnController', EditColumnController);

    EditColumnController.$inject = ['$rootScope', 'ProjectsService', 'ModalProvider', '$uibModalInstance', 'board', 'column'];
    function EditColumnController($rootScope, ProjectsService, ModalProvider, $uibModalInstance, board, column) {
        var vm = this;
        var oldCardLimit = column.card_limit;

        vm.column = column;

        vm.editColumn = function() {
            var cardLimitHasChanged = oldCardLimit !== vm.column.card_limit;
            var cardLimitReached = vm.column.card_limit !== 0 && vm.column.card_count > vm.column.card_limit;

            if(cardLimitHasChanged && cardLimitReached) {
                ProjectsService.getColumn(vm.column.id).then(function(response) {
                    var fetchedColumn = response.data;
                    var cards = fetchedColumn.cards;
                    _.each(fetchedColumn.subcolumns, function(subcolumn) {
                       cards = _.concat(cards, subcolumn.cards);
                    });

                    ModalProvider.openWIPLimitExceededEditColumnModal(cards, function() {
                        sendRequestToEditColumn();
                    }, function() {
                        // DO NOTHING
                    });
                });
            } else {
                sendRequestToEditColumn();
            }
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };

        function sendRequestToEditColumn() {
            ProjectsService.editColumn(vm.column).then(function(response) {
                if (response.status === 200) {
                    $uibModalInstance.close(response.data);
                }
            });
        }

    }

})();
