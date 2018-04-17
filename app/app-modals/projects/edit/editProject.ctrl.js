(function() {

    editProjectController.$inject = ['DevGrpsService', '$uibModalInstance'];

    function editProjectController(DevGrpsService) {
        var vm = this;

        DevGrpsService.getDeveloperGroups().then(function(result) {
            if(result.status === 200) {
                vm.devGroups = result.data;
            }
        });


        vm.hide = function() {
            //$mdDialog.hide();
        };

        vm.cancel = function() {
            //$mdDialog.cancel();
        };

        vm.editProject = function() {

            var ProjectData = {
                name: vm.name,
                productOwner: vm.owner,
                kanbanMaster: vm.kbMaster,
                developers: vm.developer
            };

            console.log("Edit Project!");
            console.log(ProjectData);
        };
    }


    angular
        .module('app')
        .controller('EditProjectController', ['DevGrpsService', editProjectController]);
})();
