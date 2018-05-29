(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$location', 'ProjectsService', 'ModalProvider'];

    function HomeController(UserService, $rootScope, $location, ProjectsService, ModalProvider) {
        var vm = this;

        console.log(vm);

        $rootScope.helpTemplate = 'app-popovers/home-help.popover.html';

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

        $rootScope.$on('board_added', function(event, args) {
            vm.boards.push(args.data);
        });
    }

})();