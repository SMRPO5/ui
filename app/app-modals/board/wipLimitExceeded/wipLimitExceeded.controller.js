"use strict";
(function () {
    angular
        .module('app')
        .controller('WIPLimitExceededBoardController', WIPLimitExceededBoardController);

    WIPLimitExceededBoardController.$inject = ['$rootScope', '$uibModalInstance', 'ProjectsService', 'data'];
    function WIPLimitExceededBoardController($rootScope, $uibModalInstance, ProjectsService, data) {
        var vm = this;
        vm.reason = '';

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.sendReasonForViolatingWip = function() {
            ProjectsService.sendReasonForWipViolation(data.item.id, data.movedToColumn.id, vm.reason).then(function(response) {
               if(response.status === 201) {
                    data.callback();
                    console.log('Reason for violating WIP sent!');
                    $uibModalInstance.close(response.data);
               }
            });
        };

        vm.close = function() {
            data.cancelCallback();
            $uibModalInstance.dismiss();
        }

    }

})();
