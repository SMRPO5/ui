(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateCardController', CreateCardController);

    CreateCardController.$inject = ['$rootScope', '$location', 'FlashService', 'CardsService', 'UserService'];
    function CreateCardController($rootScope, $location, FlashService, CardsService, UserService) {
        var vm = this;

        vm.createCard = createCard;
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
                console.log("Users: ", vm.users);
            }
        });

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        function createCard() {
            var cardData = {
                name: vm.name,
                description: vm.description,
                priority: vm.priority,
                assignee: vm.assignee,
                type: vm.type,
                lane: vm.lane,
                deadline: vm.deadline,
                size: vm.site
            };
            CardsService.createCard();
    }

    }

})();
