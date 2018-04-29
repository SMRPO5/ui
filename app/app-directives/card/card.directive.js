"use strict";
(function() {
    function card($rootScope, ModalProvider, CardsService) {
        return {
            scope: {
                card: '=card',
                project: '=project'
            },
            restrict: 'E',
            templateUrl: "app-directives/card/card.view.html",
            link: function($scope, element, attrs, controllers) {
                 $scope.editCard = function(card) {
                    ModalProvider.openEditCard(card, $scope.project).result.then(function(data){
                        $scope.card = data;
                    });
                };

                 $scope.getClassColor = function() {
                     if ($scope.card.type.name === 'Silver bullet') {
                         return 'silver-bullet';
                     } else {
                         return 'feature-request'
                     }
                 }
            }
        }
    }

    angular
        .module('app')
        .directive('card', ['$rootScope', 'ModalProvider', 'CardsService', card]);
})();