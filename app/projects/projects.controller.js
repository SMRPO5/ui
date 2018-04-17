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
            console.log(vm.editProject);
            ModalProvider.openEditProjectModal(ev);
        }

        vm.createProject = createProject;

        function createProject(ev){
            ModalProvider.openAddProjectModal(ev);
        }

        // TODO

    }

})();