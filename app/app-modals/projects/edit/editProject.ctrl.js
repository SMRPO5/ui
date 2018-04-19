(function() {

    function editProjectController(DevGrpsService, ProjectsService, $uibModalInstance, project) {
        var vm = this;

        vm.name = project.name;
        vm.customer = project.buyer_name;
        vm.devGroup = project.dev_group;
        vm.startDate = new Date(project.start_date);
        vm.deadline = new Date(project.estimated_end_date);

        //vm.startDate = project.start_date;
        //vm.deadline = project.end_date;

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



        vm.openDeadlineDatePicker = function() {
            vm.deadlineOpened = true;
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        vm.deadlineOptions = {
            minDate: tomorrow
        };

        vm.openStartDateDatePicker = function() {
            vm.startDateOpened = true;
        };

        vm.startDateOptions = {
            minDate: new Date()
        };

        vm.startDateChanged = function() {

            //console.log(vm.deadline);

            if (typeof vm.deadline === 'undefined'){
                // uporabnik še ni izbral deadline-a

            } else {
                // uporabnik je izbral deadline in je sedaj spremenil še start date
                if (vm.deadline <= vm.startDate) {
                    vm.deadline = null;
                }
            }

            var currentDate = new Date(vm.startDate);
            currentDate.setDate(currentDate.getDate() + 1);

            vm.deadlineOptions.minDate = currentDate;
        };

        vm.deadlineChanged = function() {
            //console.log(vm.deadline);
        };

        vm.editProject = function() {

            var projectData = {
                name: vm.name,
                buyer_name: vm.customer,
                start_date: vm.startDate,
                estimated_end_date: vm.deadline,
                dev_group: vm.devGroup,
                is_active: true
            };

            //console.log("Edit Project!");
            //console.log(projectData);

            ProjectsService.editProject(project.id, projectData).then(function (result) {
                $uibModalInstance.close(result.data);
                if (result.status === 201) {
                }
            });
        };

        vm.deleteProject = function(){
            ProjectsService.removeProject(project.id).then(function (result) {
                $uibModalInstance.close('del', project.id);
                if (result.status === 200) {

                }
            });
        };
    }


    angular
        .module('app')
        .controller('EditProjectController', ['DevGrpsService', 'ProjectsService', '$uibModalInstance', 'project', editProjectController]);
})();
