"use strict";
(function() {
    function card($rootScope, ModalProvider) {
        return {
            scope: {
                card: '=card'
            },
            restrict: 'E',
            templateUrl: "app-directives/card/card.view.html",
            link: function($scope, element, attrs, controllers) {
                $scope.hasRole = $rootScope.hasRole;

                $scope.canEdit = ($scope.card.is_in_first_column && ($scope.hasRole('Kanban Master') || $scope.hasRole('Product Owner'))) ||
                    (!$scope.card.is_in_first_column && !$scope.hasRole('Product Owner')) &&
                    !$scope.card.is_in_last_column;
                $scope.editCard = function(card) {
                    ModalProvider.openEditCard(card).result.then(function(data){
                        $scope.card = data;
                    });
                };
            }
        }
    }

    angular
        .module('app')
        .directive('card', ['$rootScope', 'ModalProvider', card]);
})();