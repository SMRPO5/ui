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
        CardsService.getCardTypes(project).then(function(result) {
            if(result.status === 200) {
                vm.cardTypes = result.data;
                if (vm.is_feature_and_kanban_master) {
                    vm.cardTypes.push(card.type);
                }
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
            vm.cardData.type = vm.cardData.type.id;
            CardsService.editCard(card.id, vm.cardData).then(function(response) {
                $uibModalInstance.close(response.data);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
        vm.openHistory = openHistory;

        function openHistory(){
            ModalProvider.openHistoryCard(vm.cardData);//.result.then(function(data){
            vm.close();
            //}, function(error) {
            //});
        };

    }

})();
