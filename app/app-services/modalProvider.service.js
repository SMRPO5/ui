"use strict";
(function() {
    /* global angular */
    function modalProvider($uibModal, $document, CardsService) {

        function openAddGroupModal(ev) {
            return $uibModal.open({
                controller: 'AddGroupController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/add/addGroup.view.html',
                size: 'lg',
                /*resolve: {
                    group: function () {
                        return groupData;
                    }
                }*/
            });
        }

        function openEditGroupModal(ev, groupData) {
            return $uibModal.open({
                controller: 'EditGroupController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/edit/editGroup.view.html',
                size: 'lg',
                resolve: {
                    group: function () {
                        return groupData;
                    }
                }
            });
        }

        function openAddProjectModal() {
            return $uibModal.open({
                controller: 'AddProjectController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                templateUrl: 'app-modals/projects/add/addProject.view.html',
                size: 'lg'
            });
        }

        function createProject(board) {
            return $uibModal.open({
                controller: 'AddProjectController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                templateUrl: 'app-modals/projects/add/addProject.view.html',
                size: 'lg',
                resolve: {
                    board: function() {
                        return board;
                    }
                }
            });
        }
        function removeProjectModal(project) {
            return $uibModal.open({
                controller: 'RemoveProjectController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                templateUrl: 'app-modals/projects/remove/removeProject.view.html',
                resolve: {
                    project: function() {
                        return project;
                    }
                }
            });
        }

        function openEditProjectModal(projectData) {
            return $uibModal.open({
                controller: 'EditProjectController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                templateUrl: 'app-modals/projects/edit/editProject.view.html',
                size: 'lg',
                resolve: {
                    project: function () {
                        return projectData;
                    }
                }
            });
        }

        function openEditCard(card, project) {
            return $uibModal.open({
                controller: 'EditCardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                templateUrl: 'app-modals/card/edit/editCard.view.html',
                resolve: {
                    card: CardsService.getCard(card.id),
                    project: function() {
                        return project;
                    }
                }
            });
        }
        function openCreateCardModal(project) {
            return $uibModal.open({
                templateUrl: 'app-modals/card/create/createCard.view.html',
                controller: 'CreateCardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                resolve: {
                    project: function() {
                        return project;
                    }
                }
            });
        }

        function openWIPLimitExceededModal(index, item, column, callback, cancelCallback) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/wipLimitExceeded/wipLimitExceeded.view.html',
                controller: 'WIPLimitExceededBoardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                resolve: {
                    data: {
                        index: index,
                        item: item,
                        movedToColumn: column,
                        callback: callback,
                        cancelCallback: cancelCallback
                    }
                }
            });
        }

        function openWIPLimitExceededEditColumnModal(cards, callback, cancelCallback) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/wipLimitExceededEditColumn/wipLimitExceededEditColumn.view.html',
                controller: 'WIPLimitExceededEditColumnController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                resolve: {
                    data: {
                        cards: cards,
                        callback: callback,
                        cancelCallback: cancelCallback
                    }
                }
            });
        }

        function openAddBoard() {
            return $uibModal.open({
                templateUrl: 'app-modals/board/add/addBoard.view.html',
                controller: 'AddBoardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container'))
            });
        }

        function openShowCriticalCardsModal() {
            return $uibModal.open({
                templateUrl: 'app-modals/board/criticalCards/criticalCards.view.html',
                controller: 'CriticalCardsController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                size: 'small'
            });
        }

        function openEditBoardModal(board) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/edit/editBoard.view.html',
                controller: 'EditBoardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                windowClass: 'large-modal',
                resolve: {
                    board: board
                }
            });
        }

        function openCreateColumnModal(board) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/createColumn/createColumn.view.html',
                controller: 'CreateColumnController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                size: 'medium',
                resolve: {
                    board: board
                }
            });
        }

        function openEditColumnModal(board, column) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/editColumn/editColumn.view.html',
                controller: 'EditColumnController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                size: 'medium',
                resolve: {
                    board: board,
                    column: column
                }
            });
        }

        function openSetBoundaryColumnsModal(board, column) {
            return $uibModal.open({
                templateUrl: 'app-modals/board/setBoundaryColumns/setBoundaryColumns.view.html',
                controller: 'SetBoundaryColumnsController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                backdrop: 'static',
                keyboard: false,
                size: 'medium',
                resolve: {
                    board: board,
                    deletedColumn: column
                }
            });
        }

        function openCardDeleteReasonModal(index, item, column, callback, cancelCallback) {
            return $uibModal.open({
                templateUrl: 'app-modals/card/deleteReason/deleteCardReason.view.html',
                controller: 'CardDeleteReasonController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container')),
                resolve: {
                    data: {
                        index: index,
                        item: item,
                        movedToColumn: column,
                        callback: callback,
                        cancelCallback: cancelCallback
                    }
                }
            });
        }

        return {
            openAddGroupModal: openAddGroupModal,
            openEditGroupModal: openEditGroupModal,
            openAddProjectModal: openAddProjectModal,
            openEditProjectModal: openEditProjectModal,
            openCreateCardModal: openCreateCardModal,
            openEditCard: openEditCard,
            openWIPLimitExceededModal: openWIPLimitExceededModal,
            openWIPLimitExceededEditColumnModal: openWIPLimitExceededEditColumnModal,
            openAddBoard: openAddBoard,
            createProject: createProject,
            removeProjectModal: removeProjectModal,
            openShowCriticalCardsModal: openShowCriticalCardsModal,
            openEditBoardModal: openEditBoardModal,
            openCreateColumnModal: openCreateColumnModal,
            openEditColumnModal: openEditColumnModal,
            openSetBoundaryColumnsModal: openSetBoundaryColumnsModal,
            openCardDeleteReasonModal: openCardDeleteReasonModal
        }
    }

    angular
        .module('app')
        .service('ModalProvider', ['$uibModal', '$document', 'CardsService', modalProvider]);
})();
