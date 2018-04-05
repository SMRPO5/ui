(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;
        vm.popoverTemplate = 'app-popovers/login-help.popover.html';

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.status == 200) {
                    AuthenticationService.SetCredentials(vm.username, response.data.token);
                    $location.path('/');
                } else {
                    FlashService.Error(response.data.non_field_errors[0]);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
