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
            maxDate: new Date()
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

        vm.addProject = function() {

            var projectData = {
                name: vm.name,
                codename: vm.code,
                buyer_name: vm.customer,
                start_date: vm.startDate,
                estimated_end_date: vm.deadline,
                dev_group: vm.devGroup,
                is_active: true
            };
            //console.log("Add project!");
            //console.log(projectData);

            ProjectsService.addProject(projectData).then(function (result) {
                if (result.status === 201) {
                    $uibModalInstance.close(result.data);
                }
            });

        };
    }


    angular
        .module('app')
        .controller('AddProjectController', ['DevGrpsService', 'ProjectsService', '$uibModalInstance', addProjectController]);
})();
