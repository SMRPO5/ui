"use strict";
(function () {

    angular
        .module('app')
        .controller('HistoryCardController', HistoryCardController);

    HistoryCardController.$inject = ['$rootScope', '$location', 'FlashService', 'CardsService', 'UserService', 'card', 'moment', '$uibModalInstance','ModalProvider'];
    function HistoryCardController($rootScope, $location, FlashService, CardsService, UserService, card, moment, $uibModalInstance,ModalProvider) {
        var vm = this;
        vm.cardData = card;
        vm.title = "History of " + vm.cardData.name;
        vm.dataLoading = false;
        vm.orderByField = 'comment';
        vm.reverseSort = false;
        vm.comment_title = "comment";
        vm.emai_titlel = "emai";
        vm.date_created_title = "date_created";
        CardsService.getCardTypes(card.project).then(function(result) {
            if(result.status === 200) {
                vm.cardTypes = result.data;
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

                console.log(vm.cardWipViolations);
            }
        });
        UserService.getUsers().then(function(result) {
            if(result.status === 200) {
                vm.users = result.data;
            }
        });
        vm.setOrderByField = setOrderByField;
        function setOrderByField(name){

            console.log(name);
            vm.orderByField = name;
            vm.reverseSort = !vm.reverseSort;
            //}, function(error) {
            //});
        };
        vm.openEdit = openEdit;
        function openEdit(){
            ModalProvider.openEditCard(vm.cardData);//.result.then(function(data){
            vm.close();
            //}, function(error) {
            //});
        };
        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';


        vm.close = function() {
            $uibModalInstance.dismiss();
        }

    }

})();
