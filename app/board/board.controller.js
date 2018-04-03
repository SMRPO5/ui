(function () {
    'use strict';

    angular
        .module('app')
        .controller('BoardController', BoardController);

    BoardController.$inject = ['UserService', '$rootScope', '$location'];

    function BoardController(UserService, $rootScope, $location) {
        var vm = this;
        vm.isActive = isActive;

        // TODO

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

    }

})();