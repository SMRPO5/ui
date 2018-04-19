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

        var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
            '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
            '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
            '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
            '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
            '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
            '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
            '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
            '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

        vm.getColor = function(column) {
            return colorArray[column.id];
        };

        vm.onProjectChange = function() {
            loadColumns(vm.selectedProject);
        };
        vm.openCreateCardModal = function() {
            ModalProvider.openCreateCardModal();
        };

        vm.getColumnClass = function(column) {
            return 'column ' + (column.subcolumns.length === 0 ? 'small': 'big');
        };
        vm.getColumnHeaderClass = function(column) {
            return column.subcolumns.length === 0 ? 'column_header_big': 'column_header';
        };

        function preProcessColumns(columns) {
            var parentColumnSizes = [];
            var parentColumns = [];
            var childColumns = [];
            var cardsForColumns = [];
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                var hasSubcolumns = column.subcolumns.length > 0;
                var parentColumnSize = hasSubcolumns ? column.subcolumns.length: 1;
                parentColumnSizes.push(parentColumnSize);
                column.rowSpan = hasSubcolumns ? 1: 2;
                column.colSpan = parentColumnSize;
                parentColumns.push(column);
                childColumns = childColumns.concat(column.subcolumns);

                if(hasSubcolumns) {
                    for (var j = 0; j < column.subcolumns.length; j++) {
                        var subcolumn = column.subcolumns[j];
                        cardsForColumns.push({
                            column: subcolumn,
                            cards: subcolumn.cards
                        });
                    }
                } else {
                    cardsForColumns.push({
                        column: column,
                        cards: column.cards
                    });
                }
            }

            vm.parentColumnSizes = parentColumnSizes;
            vm.parentColumns = parentColumns;
            vm.childColumns = childColumns;
            vm.cardsForColumns = cardsForColumns;
        }

        function loadColumns(projectId) {
            ProjectsService.getColumnsForProject(projectId).then(function(response) {
               if(response.status === 200) {
                   vm.columns = response.data;
                   console.log(vm.columns);
                   preProcessColumns(vm.columns);
               }
            });
        }

        function loadCards(projectId) {
            CardsService.getCardsForProject(projectId).then(function(response) {
                if(response.status === 200) {
                    vm.cards = response.data;
                }
            });
        }
    }

})();