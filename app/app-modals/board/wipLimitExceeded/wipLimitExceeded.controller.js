(function () {
    'use strict';

    angular
        .module('app')
        .controller('WIPLimitExceededBoardController', WIPLimitExceededBoardController);

    WIPLimitExceededBoardController.$inject = ['$rootScope', '$uibModalInstance'];
    function WIPLimitExceededBoardController($rootScope, $uibModalInstance) {
        var vm = this;
        vm.reason = '';

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        vm.sendReasonForViolatingWip = function() {
            // TODO
        };

        vm.close = function() {
            $uibModalInstance.dismiss();
            // TODO move card back
        }

    }

})();
