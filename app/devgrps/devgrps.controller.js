(function () {
    'use strict';

    angular
        .module('app')
        .controller('DevGrpsController', DevGrpsController);

    DevGrpsController.$inject = ['DevGrpsService', '$rootScope', '$scope', '$location'];

    function DevGrpsController(DevGrpsService, $rootScope, $scope, $location) {
        var vm = this;

        DevGrpsService.getDevelopmentGroups().then(function(response) {
            if(response.status === 200) {
                vm.groups = response.data;
            }
        });

        vm.openDevGrpModal = openDevGrpModal;

        function openDevGrpModal(index){
            alert("ToDo: Open dialog for DevGroup with id: " + index);
        }

        vm.createGroup = createGroup;

        function createGroup(){
            alert("ToDo: Open dialog for creation of a new DevGroup");
        }

        // TODO



    }

})();