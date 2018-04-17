(function () {
    'use strict';

    angular
        .module('app')
        .controller('DevGrpsController', DevGrpsController);

    DevGrpsController.$inject = ['DevGrpsService', '$rootScope', '$scope', '$location', 'ModalProvider'];

    function DevGrpsController(DevGrpsService, $rootScope, $scope, $location, ModalProvider) {
        var vm = this;

        DevGrpsService.getDeveloperGroups().then(function(response) {
            if(response.status === 200) {
                vm.groups = response.data;
            }
        });

        vm.openGroupModal = openGroupModal;
        vm.createGroupModal = createGroupModal;

        function openGroupModal(ev, index){
            vm.editGroup = vm.groups[index];
            console.log(vm.editGroup);
            ModalProvider.openEditGroupModal(ev);
        }

        function createGroupModal(ev) {
            ModalProvider.openAddGroupModal(ev);
        }
    }

})();