(function () {
    'use strict';

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['UserService', '$rootScope', '$location', 'ModalProvider'];

    function BoardController(UserService, $rootScope, $location, ModalProvider) {
        var vm = this;
        vm.openCreateCardModal = openCreateCardModal;

        function openCreateCardModal() {
            debugger;
            ModalProvider.openCreateCardModal();
        }

    }

})();