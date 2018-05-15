"use strict";
(function () {
    angular
        .module('app')
        .controller('CriticalCardsController', CriticalCardsController);

    CriticalCardsController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance'];
    function CriticalCardsController($rootScope, ProjectsService, $uibModalInstance) {
        var vm = this;

        vm.submitNumber = function submitNumber() {
            $uibModalInstance.close(vm.nAttr);
        };
        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
