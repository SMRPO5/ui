"use strict";
(function () {

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['$routeParams', 'ProjectsService', 'ModalProvider'];

    function BoardController($routeParams, ProjectsService, ModalProvider) {
        var vm = this;

        vm.cardDraggable = {
            type: 'card_draggable',
            allowedTypes: ['card_draggable']
        };

        /*
         * Data calls
         */
        ProjectsService.getBoards().then(function(response) {
            if(response.status === 200) {
                vm.boards = response.data;
                vm.selectedBoard = $routeParams.boardId !== undefined? $routeParams.boardId: vm.boards[0].id;
                console.log('Successfully fetched boards!', vm.boards);
                vm.onBoardChange();
            }
        });

        vm.onBoardChange = function() {
            var board = vm.boards.find(function(board) {
                return board.id === vm.selectedBoard
            });
            preProcessBoardColumns(board);
            loadLanes(vm.selectedBoard);
        };

        vm.openCreateCardModal = function() {
            ModalProvider.openCreateCardModal();
        };

        vm.cardDraggingStarted = function(card) {
            var cardElement = angular.element('.card-id-' + card.id);
            vm.cardPlaceholderHeight = cardElement.height();
        };

        vm.getNumberOfCardsInColumn = function(column) {
            if(vm.lanes === undefined){
                return 0;
            }
            var numberOfCardsInColumn = 0;
            var hasSubColumns = column.subcolumns !== undefined && column.subcolumns.length > 0;
            var possibleColumnIds = [];

            if(hasSubColumns) {
                for(var i = 0; i < column.subcolumns.length; i++) {
                    possibleColumnIds.push(column.subcolumns[i].id);
                }
            } else {
                possibleColumnIds.push(column.id);
            }
            for(var j = 0; j < vm.lanes.length; j++) {
                var lane = vm.lanes[j];
                for(var k = 0; k < lane.cardsForColumns.length; k++) {
                    var cardsForColumn = lane.cardsForColumns[k];
                    if(possibleColumnIds.indexOf(cardsForColumn.column.id) !== -1){
                        numberOfCardsInColumn += cardsForColumn.cards.length;
                    }
                }
            }
            return numberOfCardsInColumn;
        };

        vm.checkIfCardCanBeMoved = function(index, item, column) {
            var parentColumn = column.parent !== null? vm.columns[column.parent]: undefined;
            var numberOfCardsInColumn = vm.getNumberOfCardsInColumn(parentColumn !== undefined ? parentColumn: column);
            var maxNumberOfCardsInColumn = parentColumn !== undefined ? parentColumn.card_limit: column.card_limit;
            //console.log(numberOfCardsInColumn, '|', maxNumberOfCardsInColumn);
            //console.log(index);
            //console.log(item);
            ModalProvider.openWIPLimitExceededModal();
            // TODO move only if reason is sent from modal.
            return maxNumberOfCardsInColumn === 0 || numberOfCardsInColumn < maxNumberOfCardsInColumn ? item: false;
        };

        function preProcessBoardColumns(board) {
            var numberOfColumns = 0;
            var parentColumns = [];
            var childColumns = [];
            var columnOrder = [];
            var columns = {};
            for(var i = 0; i < board.columns.length; i++) {
                var column = board.columns[i];
                var hasSubColumns = column.subcolumns.length > 0;

                columns[column.id] = column;

                column.rowSpan = hasSubColumns ? 1: 2;
                column.colSpan = hasSubColumns ? column.subcolumns.length: 1;
                parentColumns.push(column);
                childColumns = childColumns.concat(column.subcolumns);
                if(hasSubColumns) {
                    for (var j = 0; j < column.subcolumns.length; j++) {
                        var subcolumn = column.subcolumns[j];
                        columns[subcolumn.id] = subcolumn;

                    }
                    columnOrder = columnOrder.concat(column.subcolumns);
                    numberOfColumns += column.subcolumns.length;
                } else {
                    columnOrder.push(column);
                    numberOfColumns++;
                }
            }

            vm.numberOfColumns = numberOfColumns;
            vm.parentColumns = parentColumns;
            vm.childColumns = childColumns;
            vm.columnOrder = columnOrder;
            vm.columns = columns;

            generateColumnTypes(columnOrder);
        }

        function loadLanes(boardId) {
            ProjectsService.getLanesForBoard(boardId).then(function(response) {
               if(response.status === 200) {
                   vm.lanes = response.data;
                   console.log('Successfully fetched lanes!', vm.lanes);
                   filterCardsPerColumn(vm.lanes);
               }
            });
        }

        function createCardsForColumnWithCorrectColumnOrder() {
            var cardsForColumn = [];
            for(var i = 0; i < vm.columnOrder.length; i++) {
                var column = vm.columnOrder[i];
                cardsForColumn.push({
                    column: column,
                    cards: [],
                    maxNumberOfCardsInColumn: column.parent === null ? column.card_limit: 0
                })
            }
            return cardsForColumn;
        }

        function filterCardsPerColumn(lanes) {
            var lanesWithFilteredCards = [];
            for(var i = 0; i < lanes.length; i++) {
                var lane = lanes[i];
                lane.cardsForColumns = createCardsForColumnWithCorrectColumnOrder();
                for(var j = 0; j < lane.cards.length; j++) {
                    var card = lane.cards[j];
                    var cardForColumn = lane.cardsForColumns.find(function(cardsForColumn) {
                        return cardsForColumn.column.id === card.column;
                    });
                    cardForColumn.cards.push(card);
                }
                lanesWithFilteredCards.push(lane);
            }

            vm.lanes = lanesWithFilteredCards;
        }

        function getColumnForType(column) {
            return 'card_draggable_column_' + column.id;
        }

        function generateColumnTypes(columns) {
            vm.columnTypes = {};
            for(var i = 0; i < columns.length; i++) {
                var currentColumn = columns[i];
                var previousColumn = i > 0 ? columns[i - 1]: undefined;
                var nextColumn = i < columns.length ? columns[i + 1]: undefined;
                var currentColumnType = getColumnForType(currentColumn);
                var allowedColumnTypes = [];
                if(previousColumn !== undefined) {
                    allowedColumnTypes.push(getColumnForType(previousColumn));
                }
                if(nextColumn !== undefined) {
                    allowedColumnTypes.push(getColumnForType(nextColumn));
                }
                allowedColumnTypes.push(currentColumnType);
                vm.columnTypes[currentColumn.id] = {
                    type: currentColumnType,
                    allowedTypes: allowedColumnTypes
                }
            }

            console.log('Processed columnTypes!', vm.columnTypes);
        }

    }

})();