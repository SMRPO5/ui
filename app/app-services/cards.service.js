(function () {
    'use strict';

    angular
        .module('app')
        .factory('CardsService', CardsService);

    CardsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function CardsService($http, envService, AuthenticationService) {

        function getCards() {
            return $http.get(envService.read('apiUrl') + 'projects/cards/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all cards'));
        }

        function getCard(id) {
            return $http.get(envService.read('apiUrl') + 'projects/cards/' + id, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting card'));
        }

        function createCard(cardData) {
            return $http.post(envService.read('apiUrl') + 'projects/cards/', cardData, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error creating card'));
        }

        function editCard(id, cardData) {
            return $http.patch(envService.read('apiUrl') + 'projects/cards/' + id + '/', cardData, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error updating card'));
        }

        function getCardTypes() {
            return $http.get(envService.read('apiUrl') + 'projects/card_types/', AuthenticationService.getHeaders());
        }

        // private functions

        function handleSuccess(res) {
            return res;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

        return {
            getCard: getCard,
            getCards: getCards,
            createCard: createCard,
            getCardTypes: getCardTypes,
            editCard: editCard
        };
    }

})();
