(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['ProjectsService', '$rootScope', '$scope', '$location'];

    function ProjectsController(ProjectsService, $rootScope, $scope, $location) {
        var vm = this;

        ProjectsService.getProjects().then(function(response) {
            if(response === 200) {
                vm.projects = response.data;
            }
        });

        vm.openProjectModal = openProjectModal;

        function openProjectModal(index){
            alert("ToDo: Open dialog for Project with id: " + index);
        }

        vm.createProject = createProject;

        function createProject(){
            alert("ToDo: Open dialog for creation of a new Project");
        }

        // TODO

    }

})();