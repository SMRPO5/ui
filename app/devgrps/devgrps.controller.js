(function () {
    'use strict';

    angular
        .module('app')
        .controller('DevGrpsController', DevGrpsController);

    DevGrpsController.$inject = ['DevGrpsService', '$rootScope', '$scope', '$location', 'ModalProvider'];

    function DevGrpsController(DevGrpsService, $rootScope, $scope, $location, ModalProvider) {
        var vm = this;

        $rootScope.helpTemplate = 'app-popovers/devGroup-help.popover.html';

        DevGrpsService.getDeveloperGroups().then(function(response) {
            if(response.status === 200) {
                vm.groups = response.data;
            }
        });

        vm.openGroupModal = openGroupModal;
        vm.createGroupModal = createGroupModal;

        function openGroupModal(ev, index){
            vm.editGroup = vm.groups[index];
            //console.log(vm.editGroup);
            ModalProvider.openEditGroupModal(ev, vm.groups[index]).result.then(function(data){
                if (data === 'del') { // Modal se je zaprl ker se grupa briše
                    vm.groups.splice(index, 1);
                }else { // Modal se je zaprl ker se grupa ureja
                    vm.groups[index] = data;
                }
            }, function(error) {

            });
        }

        function createGroupModal(ev) {
            ModalProvider.openAddGroupModal(ev).result.then(function(data){
                vm.groups[vm.groups.length] = data;
            }, function(error) {

            });
        }
    }

})();