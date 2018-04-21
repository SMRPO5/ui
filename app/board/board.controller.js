"use strict";
(function () {

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['ProjectsService', 'ModalProvider'];

    function BoardController(ProjectsService, ModalProvider) {
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
                            cards: subcolumn.cards,
                            numberOfCardsInColumn: subcolumn.cards.length,
                            maxNumberOfCardsInColumn: 0// Force 0 as parent controls this.
                        });
                    }
                } else {
                    cardsForColumns.push({
                        column: column,
                        cards: column.cards,
                        numberOfCardsInColumn: column.cards.length,
                        maxNumberOfCardsInColumn: column.card_limit
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
                   preProcessColumns(response.data);
               }
            });
        }
    }

})();