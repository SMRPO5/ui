"use strict";
(function () {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$scope', '$rootScope', '$location', 'ProjectsService', 'ModalProvider'];

    function HomeController(UserService, $scope, $rootScope, $location, ProjectsService, ModalProvider) {
        var vm = this;

        $rootScope.helpTemplate = 'app-popovers/home-help.popover.html';

        UserService.getUsers().then(function(response) {
            if(response.status === 200) {
                vm.allUsers = response.data;
            }
        });

        ProjectsService.getUnassignedProjects().then(function(response) {
            vm.projects = response.data;
        });

        vm.createProject = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            ModalProvider.createProject({id: null}).result.then(function(data) {
                vm.projects.push(data);
            });
        };

        vm.editProject = function($index, project) {
            ModalProvider.openEditProjectModal(project).result.then(function(data) {
                vm.projects[$index] = data;
            }, function(error){});
        };

        ProjectsService.getBoards().then(function(response) {
            vm.boards = response.data;
        });

        vm.createBoard = function() {
            ModalProvider.openAddBoard().result.then(function(data) {
                 vm.boards.push(data);
            });
        };

        $rootScope.$on('board_added', function(event, args) {
            vm.boards.push(args.data);
        });
    }

})();