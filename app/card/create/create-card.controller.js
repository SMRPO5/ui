(function () {
    'use strict';

    angular
        .module('app')
        .controller('CreateCardController', CreateCardController);

    CreateCardController.$inject = ['$rootScope', '$location', 'FlashService'];
    function CreateCardController($rootScope, $location, FlashService) {
        var vm = this;

        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';
    }

})();
