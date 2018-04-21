"use strict";
(function () {
    angular
        .module('app')
        .controller('AddBoardController', AddBoardController);

    AddBoardController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance'];
    function AddBoardController($rootScope, ProjectsService, $uibModalInstance) {
        var vm = this;

        vm.createBoard = function createBoard() {
            ProjectsService.createBoard(vm.board).then(function(response) {
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
