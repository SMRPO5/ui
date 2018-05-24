"use strict";
(function() {
    function boardDirective($rootScope, $location, ModalProvider) {
        return {
            scope: {
                board: '=board'
            },
            restrict: 'E',
            templateUrl: "app-directives/board-preview/board-preview.view.html",
            link: function($scope, element, attrs, controllers) {
                $scope.hasRole = $rootScope.hasRole;
                $scope.actionsOpened = false;
                $scope.toggleActions = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.actionsOpened = !$scope.actionsOpened;
                };

                $scope.editBoard = function($event, board) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    ModalProvider.openEditBoardModal(board).result.then(function(data){
                        //$scope.board = data;
                    });
                };

                $scope.createProject = function($event, board) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    ModalProvider.createProject(board).result.then(function(data) {
                        $scope.board.projects.push(data);
                    });
                };

                $scope.editProject = function($index, project) {
                    ModalProvider.openEditProjectModal(project).result.then(function(data) {
                        $scope.board.projects[$index] = data;
                    }, function(error){});
                };

                $scope.removeProject = function($event, $index, project) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    ModalProvider.removeProjectModal(project).result.then(function() {
                        $scope.board.projects.splice($index, 1);
                    }, function(error){});
                };

                $scope.openBoard = function($event, board) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $location.path('/board/' + board.id);
                }
            }
        }
    }

    angular
        .module('app')
        .directive('boardPreview', ['$rootScope', '$location', 'ModalProvider', boardDirective]);
})();