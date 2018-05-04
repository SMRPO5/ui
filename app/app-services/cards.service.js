(function () {
    'use strict';

    angular
        .module('app')
        .factory('CardsService', CardsService);

    CardsService.$inject = ['$http', 'envService', 'AuthenticationService'];
    function CardsService($http, envService, AuthenticationService) {

        function updateCardColumn(cardId, columnId) {
            var data = {
                column: columnId
            };
            return $http.patch(envService.read('apiUrl') + 'projects/cards/' + cardId + '/', data, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error updating column'));
        }

        function getCards() {
            return $http.get(envService.read('apiUrl') + 'projects/cards/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting all cards'));
        }

        function getCard(id) {
            return $http.get(envService.read('apiUrl') + 'projects/cards/' + id + '/', AuthenticationService.getHeaders())
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
        function removeCard(id) {
            return $http.delete(envService.read('apiUrl') + 'projects/cards/' + id + '/', AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error deleting card'));
        }

        function getCardTypes(project) {
            return $http.get(envService.read('apiUrl') + 'projects/card_types/?project=' + project.id, AuthenticationService.getHeaders());
        }
        function getCardHistory(id) {
            return $http.get(envService.read('apiUrl') + 'projects/card_history/?card=' + id, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting card history'));
        }
        function getCardWipViolations(id) {
            return $http.get(envService.read('apiUrl') + 'projects/wip_violations/?card=' + id, AuthenticationService.getHeaders())
                .then(handleSuccess, handleError('Error getting card wip violations'));
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
            updateCardColumn: updateCardColumn,
            getCard: getCard,
            getCards: getCards,
            removeCard: removeCard,
            createCard: createCard,
            getCardTypes: getCardTypes,
            editCard: editCard,
            getCardHistory: getCardHistory,
            getCardWipViolations: getCardWipViolations

        };
    }

})();
