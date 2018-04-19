(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'LocalStorage', 'AuthenticationService', 'UserService', 'FlashService'];
    function LoginController($rootScope, $location, LocalStorage, AuthenticationService, UserService, FlashService) {
        var vm = this;

        vm.login = login;
        $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';

        function login() {
            vm.dataLoading = true;
            AuthenticationService.loginUser(vm.username, vm.password, function (response) {
                if (response.status === 200) {
                    LocalStorage.saveJwtToken(response.data.token);
                    UserService.getMe().then(function(user) {
                        $location.path('/');
                    });
                } else {
                    FlashService.Error(response.data.non_field_errors[0]);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
