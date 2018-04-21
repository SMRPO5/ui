(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$location', 'ProjectsService', 'ModalProvider'];

    function HomeController(UserService, $rootScope, $location, ProjectsService, ModalProvider) {
        var vm = this;

        UserService.getUsers().then(function(response) {
            if(response.status === 200) {
                vm.allUsers = response.data;
            }
        });

        ProjectsService.getBoards().then(function(response) {
            vm.boards = response.data;
        });

        vm.createBoard = function() {
            ModalProvider.openAddBoard().result.then(function(data) {
                 vm.boards.push(data);
            });
        };
    }

})();