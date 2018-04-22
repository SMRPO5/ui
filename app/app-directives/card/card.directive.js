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
            }
        }
    }

    angular
        .module('app')
        .directive('card', ['$rootScope', 'ModalProvider', card]);
})();