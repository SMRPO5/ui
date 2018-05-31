"use strict";
(function () {
    angular
        .module('app')
        .controller('WIPLimitExceededEditColumnController', WIPLimitExceededEditColumnController);

    WIPLimitExceededEditColumnController.$inject = ['$rootScope', '$uibModalInstance', '$q', 'ProjectsService', 'data'];
    function WIPLimitExceededEditColumnController($rootScope, $uibModalInstance, $q, ProjectsService, data) {
        var vm = this;
        vm.reason = '';

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.sendReasonForViolatingWip = function() {
            var promises = [];
            _.each(data.cards, function(card) {
                promises.push(
                    ProjectsService.sendReasonForWipViolation(card.id, card.column, 'Change of card_limit property!').then(function(response) {
                        console.log('Reason for violating WIP sent!');
                    })
                );
            });
            $q.all(promises).then(function() {
                data.callback();
                console.log('All reasons for violating WIP sent!');
                $uibModalInstance.close();
            });
        };

        vm.close = function() {
            data.cancelCallback();
            $uibModalInstance.dismiss();
        }

    }

})();
