"use strict";
(function () {
    angular
        .module('app')
        .controller('CardDeleteReasonController', CardDeleteReasonController);

    CardDeleteReasonController.$inject = ['$rootScope', '$uibModalInstance', 'ProjectsService', 'data'];
    function CardDeleteReasonController($rootScope, $uibModalInstance, ProjectsService, data) {
        var vm = this;
        vm.reason = '';

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.sendReasonForDeletingCard = function() {
            /*
            ProjectsService.sendReasonForWipViolation(data.item.id, data.movedToColumn.id, vm.reason).then(function(response) {
               if(response.status === 201) {
                    data.callback();
                    console.log('Reason for violating WIP sent!');
                    $uibModalInstance.close(response.data);
               }
            });
            */

            $uibModalInstance.close();
        };

        vm.close = function() {
            data.cancelCallback();
            $uibModalInstance.dismiss();
        }

    }

})();
