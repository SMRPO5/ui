"use strict";
(function () {

    angular
        .module('app')
        .controller('CreateCardController', CreateCardController);

    CreateCardController.$inject = ['$rootScope', 'CardsService', 'UserService', '$uibModalInstance', 'project'];
    function CreateCardController($rootScope, CardsService, UserService, $uibModalInstance, project) {
        var vm = this;

        vm.createCard = function createCard() {
            CardsService.createCard(vm.cardData).then(function(result) {
                if (result.status === 201) {
                    $uibModalInstance.close(result.data);
                }
            });

        };
        vm.close = function() {
            $uibModalInstance.dismiss();
        };
        vm.openDeadlineDatePicker = function() {
            vm.deadlineOpened = true;
        };

        vm.cardData = {
            name: '',
            description: '',
            type: '',
            assignee: '',
            priority: '',
            deadline: '',
            size: '',
            project: project.id
        };

        vm.deadlineOptions = {
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
        CardsService.getCardTypes(project).then(function(result) {
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
    }

})();
