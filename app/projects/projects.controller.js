(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['ProjectsService', '$rootScope', '$scope', '$location', 'ModalProvider'];

    function ProjectsController(ProjectsService, $rootScope, $scope, $location, ModalProvider) {
        var vm = this;

        ProjectsService.getProjects().then(function(result) {
            if(result.status === 200) {
                vm.projects = result.data;
            }
        });

        vm.openProjectModal = openProjectModal;

        function openProjectModal(ev, index){
            vm.editProject = vm.projects[index];
            //console.log(vm.editProject);
            ModalProvider.openEditProjectModal(ev, vm.projects[index]).result.then(function(data){
                if (data === 'del') { // Modal se je zaprl ker se projekt briše
                    vm.projects.splice(index, 1);
                }else { // Modal se je zaprl ker se projekt ureja
                    vm.projects[index] = data;
                }
            }, function(error) {

            });
        }

        vm.createProject = createProject;

        function createProject(ev){
            ModalProvider.openAddProjectModal(ev).result.then(function(data){
                vm.projects[vm.projects.length] = data;
            }, function(error) {

            });
        }



    }

})();