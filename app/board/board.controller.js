"use strict";
(function () {

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['$routeParams', 'ProjectsService', 'CardsService', 'ModalProvider', '$rootScope'];

    function BoardController($routeParams, ProjectsService, CardsService, ModalProvider, $rootScope) {
        var vm = this;

        $rootScope.helpTemplate = 'app-popovers/board-help.popover.html';

        /*
         * Data calls
         */
        ProjectsService.getBoards().then(function (response) {
            if (response.status === 200) {
                vm.boards = response.data;
                vm.selectedBoard = $routeParams.boardId !== undefined ? $routeParams.boardId : vm.boards[0].id;
                console.log('Successfully fetched boards!', vm.boards);
                vm.onBoardChange();
            }
        });

        vm.onBoardChange = function () {
            var board = vm.boards.find(function (board) {
                return board.id === parseInt(vm.selectedBoard);
            });
            preProcessBoardColumns(board);
            loadLanes(vm.selectedBoard);
        };

        vm.openCreateCardModal = function (project) {
            ModalProvider.openCreateCardModal(project).result.then(function (card) {
                project.has_silver_bullet = true;
                vm.addCardToAppropriateColumn(card);
            }, function () {
            });
        };

        vm.openShowCriticalCardsModal = function (board) {
            ModalProvider.openShowCriticalCardsModal().result.then(function (data) {
                console.log('Showing critical cards (' + data + ' days)...');

                var date = new Date();
                date.setDate(date.getDate() + data);

                var bool = false;

                for (var i = 0; i < vm.lanes.length; i++) {
                    var kartice = vm.lanes[i].cards;
                    for (var j = 0; j < kartice.length; j++) {
                        var myEl = angular.element(document.querySelector('.card-id-' + kartice[j].id));
                        if (!kartice[j].is_in_done && new Date(kartice[j].deadline) < date) {
                            bool = true;
                            myEl.addClass('borderBlink');
                        } else {
                            myEl.removeClass('borderBlink');
                        }
                    }
                }

                if (!bool) {
                    alert("No critical cards found.")
                } else {
                    vm.showStartEvent = !vm.showStartEvent;
                }

            }, function (error) {

            });
        };

        vm.cancelShowCriticalCards = function () {
            vm.showStartEvent = !vm.showStartEvent;
            for (var i = 0; i < vm.lanes.length; i++) {
                var kartice = vm.lanes[i].cards;
                for (var j = 0; j < kartice.length; j++) {
                    var myEl = angular.element(document.querySelector('.card-id-' + kartice[j].id));
                    myEl.removeClass('borderBlink');
                }
            }
        };

        vm.sendMail = function () {
            //console.log(vm);

            for (var k = 0; k < vm.boards.length; k++) {
                if (vm.boards[k].id === vm.selectedBoard) {

                    var tabla = vm.boards[k];

                    // Iskanje vseh KBMastrov, ki imajo projekte na tej tabli

                    var kbMastri = [];
                    var projekti = [];

                    for (var l = 0; l < tabla.projects.length; l++) {
                        var grupa = tabla.projects[l].dev_group.members;

                        for (var m = 0; m < grupa.length; m++) {
                            var clan = grupa[m];
                            for (var n = 0; n < clan.role.length; n++) {
                                if (clan.role[n].name === 'Kanban Master') {
                                    var exists = false;
                                    for (var q = 0; q < kbMastri.length; q++) {
                                        if (kbMastri[q] === clan.user) {
                                            exists = true;
                                            projekti[q].push(tabla.projects[l].id);
                                            break;
                                        }
                                    }
                                    if (!exists) {
                                        kbMastri.push(clan.user);
                                        projekti.push([tabla.projects[l].id]);
                                    }
                                }
                            }
                        }
                    }

                    //console.log(kbMastri);
                    //console.log(projekti);


                    var dAttr = tabla.dAttr;

                    var date = new Date();
                    date.setDate(date.getDate() + dAttr);

                    for (var o = 0; o < kbMastri.length; o++) {
                        var bool = false;

                        var html = [];

                        html.push(
                            "<html>",
                            "<body>",
                            "<p>The following cards have deadlines in the next " + dAttr + " days:</p>");

                        for (var i = 0; i < vm.lanes.length; i++) {
                            var kartice = vm.lanes[i].cards;
                            for (var j = 0; j < kartice.length; j++) {
                                var kartica = kartice[j];
                                var belongs = false;

                                for (var p = 0 ; p < projekti[o].length ; p++){
                                    if (kartica.project === projekti[o][p]){
                                        belongs = true;
                                    }
                                }

                                if (belongs && !kartica.is_in_done && new Date(kartica.deadline) < date) {
                                    bool = true;

                                    //console.log(kartica);

                                    html.push("<h1>" + kartica.name + "</h1>");

                                    html.push("<ul>");

                                    html.push("<li>Description: " + kartica.description + "</li>");
                                    html.push("<li>Type: " + kartica.type.name + "</li>");
                                    html.push("<li>Project: " + vm.lanes[i].project.name + "</li>");
                                    html.push("<li>Current column: " + vm.columns[kartica.column].name + "</li>");

                                    if (kartica.priority === 1) {
                                        html.push("<li>Priority: Critical</li>");
                                    } else if (kartica.priority === 2) {
                                        html.push("<li>Priority: High</li>");
                                    } else if (kartica.priority === 3) {
                                        html.push("<li>Priority: Average</li>");
                                    } else if (kartica.priority === 4) {
                                        html.push("<li>Priority: Low</li>");
                                    }

                                    html.push("<li>Assignee: " + kartica.assignee.first_name + " " + kartica.assignee.last_name + "</li>");
                                    html.push("<li>Size: " + kartica.size + "</li>");
                                    html.push("<li>Created: " + new Date(kartica.created_at).toLocaleDateString() + "</li>");
                                    html.push("<li>Deadline: " + new Date(kartica.deadline).toLocaleDateString() + "</li>");

                                    html.push("</ul>");
                                }
                            }
                        }

                        if (!bool) {
                            alert("No critical cards found.")
                        } else {
                            html.push(
                                "</body>",
                                "</html>"
                            );
                            var body = html.join("");
                            console.log('Sending mail to: ' + kbMastri[o]);
                            console.log(body);

                            // Uncomment bottom line to actually sent eMails to those addresses
                            CardsService.sendMail(kbMastri[o], body);
                        }
                    }
                }
            }
        };

        vm.addCardToAppropriateColumn = function (card) {
            var lane = _.find(vm.lanes, function (lane) {
                return lane.project.id === card.project
            });
            var column = _.find(lane.cardsForColumns, function (column) {
                return column.column.id === card.column
            });
            if (column.cards.length >= column.maxNumberOfCardsInColumn && column.maxNumberOfCardsInColumn !== 0) {
                ModalProvider.openWIPLimitExceededModal(0, card, column.column, function () {
                    column.cards.push(card);
                }, function () {
                    CardsService.removeCard(card.id);
                });
            } else {
                column.cards.push(card);
            }
        };

        vm.addCardToFirstColumn = function (card) {
            var lane = _.find(vm.lanes, function (lane) {
                return lane.project.id === card.project
            });
            lane.cardsForColumns[0].cards.push(card);
        };

        vm.cardDraggingStarted = function (card) {
            var cardElement = angular.element('.card-id-' + card.id);
            vm.cardPlaceholderHeight = cardElement.height();
        };

        vm.getNumberOfCardsInColumn = function (column) {
            if (vm.lanes === undefined) {
                return 0;
            }
            var numberOfCardsInColumn = 0;
            var hasSubColumns = column.subcolumns !== undefined && column.subcolumns.length > 0;
            var possibleColumnIds = [];

            if (hasSubColumns) {
                for (var i = 0; i < column.subcolumns.length; i++) {
                    possibleColumnIds.push(column.subcolumns[i].id);
                }
            } else {
                possibleColumnIds.push(column.id);
            }
            for (var j = 0; j < vm.lanes.length; j++) {
                var lane = vm.lanes[j];
                for (var k = 0; k < lane.cardsForColumns.length; k++) {
                    var cardsForColumn = lane.cardsForColumns[k];
                    if (possibleColumnIds.indexOf(cardsForColumn.column.id) !== -1) {
                        numberOfCardsInColumn += cardsForColumn.cards.length;
                    }
                }
            }
            return numberOfCardsInColumn;
        };

        vm.checkIfCardCanBeMoved = function (index, item, column) {
            var parentColumn = column.parent !== null ? vm.columns[column.parent] : undefined;
            var itemParentColumn = item.parent !== null ? vm.columns[vm.columns[item.column].parent] : undefined;
            var numberOfCardsInColumn = vm.getNumberOfCardsInColumn(parentColumn !== undefined ? parentColumn : column);
            var maxNumberOfCardsInColumn = parentColumn !== undefined ? parentColumn.card_limit : column.card_limit;
            var wipLimitExceeded = maxNumberOfCardsInColumn !== 0 && numberOfCardsInColumn >= maxNumberOfCardsInColumn;
            var movingToSameColumn = item.column === column.id;
            var condition = true;
            if (parentColumn !== undefined && itemParentColumn !== undefined) {
                condition = wipLimitExceeded && parentColumn.id !== itemParentColumn.id;
            } else {
                condition = wipLimitExceeded && !movingToSameColumn;
            }
            if (condition) {
                ModalProvider.openWIPLimitExceededModal(index, item, column, function () {
                    moveCardToColumn(index, item, column)
                }, function () {
                });
                return false;
            }
            item.column = column.id;// Sets new column id
            CardsService.updateCardColumn(item.id, column.id).then(function (response) {
            });
            return item;
        };

        function moveCardToColumn(newIndex, card, movedToColumn) {
            for (var i = 0; i < vm.lanes.length; i++) {
                var lane = vm.lanes[i];
                var oldCardForColumn = lane.cardsForColumns.find(function (cardsForColumn) {
                    return cardsForColumn.column.id === card.column;
                });
                var newCardForColumn = lane.cardsForColumns.find(function (cardsForColumn) {
                    return cardsForColumn.column.id === movedToColumn.id;
                });
                var oldColumnCardIndex = -1;
                for (var j = 0; j < oldCardForColumn.cards.length; j++) {
                    var oldCard = oldCardForColumn.cards[j];
                    if (oldCard.id === card.id) {
                        oldColumnCardIndex = j;
                        break;
                    }
                }
                card.column = movedToColumn.id;
                oldCardForColumn.cards.splice(oldColumnCardIndex, 1);
                newCardForColumn.cards.splice(newIndex, 0, card);
                CardsService.updateCardColumn(card.id, movedToColumn.id).then(function (response) {
                })
            }
        }

        function preProcessBoardColumns(board) {
            var numberOfColumns = 0;
            var parentColumns = [];
            var childColumns = [];
            var columnOrder = [];
            var columns = {};
            for (var i = 0; i < board.columns.length; i++) {
                var column = board.columns[i];
                var hasSubColumns = column.subcolumns.length > 0;

                columns[column.id] = column;

                column.rowSpan = hasSubColumns ? 1 : 2;
                column.colSpan = hasSubColumns ? column.subcolumns.length : 1;
                parentColumns.push(column);
                childColumns = childColumns.concat(column.subcolumns);
                if (hasSubColumns) {
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
        }

        function loadLanes(boardId) {
            ProjectsService.getLanesForBoard(boardId).then(function (response) {
                if (response.status === 200) {
                    vm.lanes = response.data;
                    console.log('Successfully fetched lanes!', vm.lanes);
                    generateColumnTypesForLanes(vm.lanes);
                    filterCardsPerColumn(vm.lanes);
                }
            });
        }

        function createCardsForColumnWithCorrectColumnOrder() {
            var cardsForColumn = [];
            for (var i = 0; i < vm.columnOrder.length; i++) {
                var column = vm.columnOrder[i];
                cardsForColumn.push({
                    column: column,
                    cards: [],
                    maxNumberOfCardsInColumn: column.parent === null ? column.card_limit : 0
                })
            }
            return cardsForColumn;
        }

        function filterCardsPerColumn(lanes) {
            var lanesWithFilteredCards = [];
            for (var i = 0; i < lanes.length; i++) {
                var lane = lanes[i];
                lane.cardsForColumns = createCardsForColumnWithCorrectColumnOrder();
                for (var j = 0; j < lane.cards.length; j++) {
                    var card = lane.cards[j];
                    var cardForColumn = lane.cardsForColumns.find(function (cardsForColumn) {
                        return cardsForColumn.column.id === card.column;
                    });
                    cardForColumn.cards.push(card);
                }
                lanesWithFilteredCards.push(lane);
            }

            vm.lanes = lanesWithFilteredCards;
        }

        function generateColumnTypesForLanes(lanes) {
            vm.columnTypes = {};
            for (var i = 0; i < lanes.length; i++) {
                var lane = lanes[i];
                vm.columnTypes[lane.project.id] = {};
                generateColumnTypes(lane, vm.columnOrder);
            }
            console.log('Processed columnTypes!', vm.columnTypes);
        }

        function getColumnForType(lane, column) {
            return 'card_draggable_project_' + lane.project.id + '_column_' + column.id;
        }

        function generateColumnTypes(lane, columns) {

            for (var i = 0; i < columns.length; i++) {
                var currentColumn = columns[i];
                var previousColumn = i > 0 ? columns[i - 1] : undefined;
                var nextColumn = i < columns.length ? columns[i + 1] : undefined;
                var currentColumnType = getColumnForType(lane, currentColumn);
                var allowedColumnTypes = [];
                if (previousColumn !== undefined) {
                    allowedColumnTypes.push(getColumnForType(lane, previousColumn));
                }
                if (nextColumn !== undefined) {
                    allowedColumnTypes.push(getColumnForType(lane, nextColumn));
                }
                allowedColumnTypes.push(currentColumnType);
                vm.columnTypes[lane.project.id][currentColumn.id] = {
                    type: currentColumnType,
                    allowedTypes: allowedColumnTypes
                }
            }
        }

    }

})();