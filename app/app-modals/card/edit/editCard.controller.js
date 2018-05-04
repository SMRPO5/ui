"use strict";
(function () {

    angular
        .module('app')
        .controller('EditCardController', EditCardController);

    EditCardController.$inject = ['$rootScope', '$location', 'FlashService', 'CardsService', 'UserService', 'card', 'project', 'moment', '$uibModalInstance', 'ModalProvider'];
    function EditCardController($rootScope, $location, FlashService, CardsService, UserService, card, project, moment, $uibModalInstance, ModalProvider) {
        var vm = this;
        card = card.data;
        vm.canEdit = (card.is_in_requested && ($rootScope.hasRoleForProject(project, 'Kanban Master') || $rootScope.hasRoleForProject(project, 'Product Owner'))) ||
            (!card.is_in_requested && !$rootScope.hasRoleForProject(project, 'Product Owner')) &&
            !card.is_in_done;
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
            }
        });
        UserService.getUsers().then(function(result) {
            if(result.status === 200) {
                vm.users = result.data;
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
        /*

        vm.orderByField = 'comment';
        vm.reverseSort = false;
        vm.comment_title = "comment";
        vm.emai_titlel = "emai";
        vm.date_created_title = "date_created";
        vm.setOrderByField = setOrderByField;
        function setOrderByField(name){

            console.log(name);
            vm.orderByField = name;
            vm.reverseSort = !vm.reverseSort;
            //}, function(error) {
            //});
        };*/

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.editCard = function() {
            vm.cardData.assignee = vm.cardData.assignee.id;
            CardsService.editCard(card.id, vm.cardData).then(function(response) {
                $uibModalInstance.close(response.data);
            });
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
