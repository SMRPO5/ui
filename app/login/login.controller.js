(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'AuthenticationService', 'FlashService'];
    function LoginController($rootScope, $location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;
        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        function login() {
            vm.dataLoading = true;
            AuthenticationService.loginUser(vm.username, vm.password, function (response) {
                if (response.status === 200) {
                    AuthenticationService.saveJwtToken(response.data.token);
                    $location.path('/');

                    $rootScope.saveCurrentUser();
                } else {
                    FlashService.Error(response.data.non_field_errors[0]);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
