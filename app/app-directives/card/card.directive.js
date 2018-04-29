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
                 $scope.editCard = function(card) {
                    ModalProvider.openEditCard(card).result.then(function(data){
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
        .directive('card', ['$rootScope', 'ModalProvider', card]);
})();