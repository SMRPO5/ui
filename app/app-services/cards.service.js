(function () {
    'use strict';

    angular
        .module('app')
        .factory('CardsService', CardsService);

    CardsService.$inject = ['$http', 'envService'];
    function CardsService($http, envService) {
        var service = {};

        service.getCards = getCards;
        service.getCard = getCard;
        service.createCard = createCard;

        return service;

        function getCards() {
            return $http.get(envService.read('apiUrl') + 'cards/cards/').then(handleSuccess, handleError('Error getting all cards'));
        }

        function getCard(id) {
            return $http.get(envService.read('apiUrl') + 'cards/cards/' + id).then(handleSuccess, handleError('Error getting card'));
        }

        function createCard(cardData) {
            return $http.post(envService.read('apiUrl') + 'cards/cards/', cardData).then(handleSuccess, handleError('Error creating card'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
