(function () {
    'use strict';

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['UserService', '$rootScope', '$location', 'CardsService', 'ModalProvider'];

    function BoardController(UserService, $rootScope, $location, CardsService, ModalProvider) {
        var vm = this;

        CardsService.getCards().then(function(cards){
            vm.cards = cards.data;
        });
        vm.openCreateCardModal = function() {
            ModalProvider.openCreateCardModal();
        };
        vm.editCard = function(card, index) {
            ModalProvider.openEditCard(card).result.then(function(data){
                vm.cards[index] = data;
            }, function(error) {
            });
        }
    }

})();