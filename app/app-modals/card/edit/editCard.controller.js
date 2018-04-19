(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditCardController', EditCardController);

    EditCardController.$inject = ['$rootScope', '$location', 'FlashService', 'CardsService', 'UserService', 'card', 'moment', '$uibModalInstance'];
    function EditCardController($rootScope, $location, FlashService, CardsService, UserService, card, moment, $uibModalInstance) {
        var vm = this;
        vm.cardData = card;
        vm.cardData.deadline = moment(vm.cardData.deadline).toDate();
        vm.title = vm.cardData.name;
        vm.dataLoading = false;
        vm.deadline_options = {
            minDate: new Date()
        };
        vm.priorities = [
            {
                number: 4,
                name: 'Low'
            },
            {
                number: 3,
                name: 'Average'
            },
            {
                number: 2,
                name: 'High'
            },
            {
                number: 1,
                name: 'Critical'
            }
        ];
        CardsService.getCardTypes().then(function(result) {
            if(result.status === 200) {
                vm.cardTypes = result.data;
            }
        });
        UserService.getUsers().then(function(result) {
            if(result.status === 200) {
                vm.users = result.data;
            }
        });

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.editCard = function() {
            vm.cardData.assignee = vm.cardData.assignee.id;
            CardsService.editCard(card.id, vm.cardData).then(function(response) {
                $uibModalInstance.close(response.data);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        }

    }

})();
