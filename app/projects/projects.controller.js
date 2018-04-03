(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['ProjectsService', '$rootScope', '$scope', '$location'];

    function ProjectsController(ProjectsService, $rootScope, $scope, $location) {
        var vm = this;
        getProjects();


        vm.isActive = isActive;
        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        vm.getProjects = getProjects;
        function getProjects(){
            ProjectsService.GetAll().then(function(data) {$scope.projects = data;}, function() {console.log('error')});
        }

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