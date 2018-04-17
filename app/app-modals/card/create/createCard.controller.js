(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateCardController', CreateCardController);

    CreateCardController.$inject = ['$rootScope', 'CardsService', 'UserService', '$uibModalInstance'];
    function CreateCardController($rootScope, CardsService, UserService, $uibModalInstance) {
        var vm = this;

        vm.createCard = createCard;

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

        function createCard() {
            var cardData = {
                name: vm.name,
                description: vm.description === undefined ? '': vm.description,
                priority: vm.priority,
                assignee: vm.assignee,
                type: vm.type,
                lane: vm.lane,// TODO replace this..
                deadline: vm.deadline,
                size: vm.size
            };
            vm.dataLoading = true;
            CardsService.createCard();
            $uibModalInstance.close();
        }

    }

})();
