"use strict";
(function () {

    angular
        .module('app')
        .controller('EditCardController', EditCardController);

    EditCardController.$inject = ['$rootScope', '$location', 'FlashService', 'CardsService', 'UserService', 'card', 'project', 'moment', '$uibModalInstance', 'ModalProvider'];
    function EditCardController($rootScope, $location, FlashService, CardsService, UserService, card, project, moment, $uibModalInstance, ModalProvider) {
        var vm = this;
        card = card.data;
        vm.canEdit = (card.is_in_requested && ($rootScope.hasRoleForProject(project, 'Kanban Master') || $rootScope.hasRoleForProject(project, 'Product Owner') && card.type.name !== 'Silver bullet')) ||
            (!card.is_in_requested && !$rootScope.hasRoleForProject(project, 'Product Owner')) &&
            !card.is_in_done;
        debugger;
        vm.is_feature_and_kanban_master = (card.type.name === 'Feature request' && $rootScope.hasRoleForProject(project, 'Kanban Master'));
        vm.is_developer = $rootScope.hasRoleForProject(project, 'Developer');
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

        vm.users = project.dev_group.members;

        CardsService.getCardTypes(project).then(function(result) {
            if(result.status === 200) {
                vm.cardTypes = result.data;
                if (vm.is_feature_and_kanban_master || vm.is_developer) {
                    vm.cardTypes.push(card.type);
                }
            }
        });
        CardsService.getCardHistory(card.id).then(function(response) {
            if(response.status === 200) {
                vm.cardHistory = response.data;
                //console.log(vm.cardHistory);
            }
        });
        CardsService.getCardWipViolations(card.id).then(function(response) {
            if(response.status === 200) {
                vm.cardWipViolations = response.data;

                //console.log(vm.cardWipViolations);
            }
        });

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.editCard = function() {
            vm.cardData.assignee = vm.cardData.assignee.id;
            vm.cardData.type = vm.cardData.type.id;
            CardsService.editCard(card.id, vm.cardData).then(function(response) {
                $uibModalInstance.close(response.data);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
