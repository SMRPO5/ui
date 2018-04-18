(function () {
    'use strict';

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['$rootScope', '$location', 'UserService', 'CardsService', 'ProjectsService', 'ModalProvider'];

    function BoardController($rootScope, $location, UserService, CardsService, ProjectsService, ModalProvider) {
        var vm = this;

        ProjectsService.getProjectsForUser(1).then(function(response) {
           if(response.status === 200) {
               vm.projects = response.data;
               vm.selectedProject = vm.projects[0].id;
               vm.onProjectChange();
           }
        });

        vm.onProjectChange = function() {
            //loadCards(vm.selectedProject);
            loadColumns(vm.selectedProject);
        };
        vm.openCreateCardModal = function() {
            ModalProvider.openCreateCardModal();
        };
        vm.editCard = function(card, index) {
            ModalProvider.openEditCard(card).result.then(function(data){
                vm.cards[index] = data;
            });
        };

        vm.getColumnClass = function(column) {
            return 'column ' + (column.subcolumns.length === 0 ? 'small': 'big');
        };
        vm.getColumnHeaderClass = function(column) {
            return column.subcolumns.length === 0 ? 'column_header_big': 'column_header';
        };


        function loadColumns(projectId) {
            ProjectsService.getColumnsForProject(projectId).then(function(response) {
               if(response.status === 200) {
                   vm.columns = response.data;
               }
            });
        }

        function loadCards(projectId) {
            CardsService.getCardsForProject(projectId).then(function(response) {
                if(response === 200) {
                    vm.cards = response.data;
                }
            });
        }
    }

})();