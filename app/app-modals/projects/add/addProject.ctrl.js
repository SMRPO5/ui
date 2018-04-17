(function() {

    function addProjectController(DevGrpsService, ProjectsService, $uibModalInstance) {
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

        vm.addProject = function() {

            var projectData = {
                name: vm.name,
                buyer_name: vm.customer,
                start_date: vm.startDate,
                estimated_end_date: vm.deadline,
                dev_group: vm.devGroup,
                is_active: true
            };
            console.log("Add project!");
            console.log(projectData);


            ProjectsService.addProject(projectData);

            $uibModalInstance.close(projectData);

        };
    }


    angular
        .module('app')
        .controller('AddProjectController', ['DevGrpsService', 'ProjectsService', '$uibModalInstance', addProjectController]);
})();
