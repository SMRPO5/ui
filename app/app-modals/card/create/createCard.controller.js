"use strict";
(function () {

    angular
        .module('app')
        .controller('CreateCardController', CreateCardController);

    CreateCardController.$inject = ['$rootScope', 'CardsService', 'ProjectsService', 'UserService', '$uibModalInstance', 'project'];
    function CreateCardController($rootScope, CardsService, ProjectsService, UserService, $uibModalInstance, project) {
        var vm = this;
        ProjectsService.getBoard(project.board).then(function(response) {
            vm.silverBulletExists = response.data.has_silver_bullet && $rootScope.hasRoleForProject(project, 'Kanban Master');
            vm.isKanabanMasterOnly = $rootScope.hasOnlyRoleForProject(project, 'Kanban Master');
        });

        vm.createCard = function createCard() {
            vm.cardData.type = vm.cardData.type.id;
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
        vm.changed = function() {
            console.log(vm.cardData.type);
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
        vm.users = project.dev_group.members;

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';
    }

})();
