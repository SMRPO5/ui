(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$location'];

    function HomeController(UserService, $rootScope, $location) {
        var vm = this;

        UserService.getUsers().then(function(response) {
            if(response.status === 200) {
                vm.allUsers = response.data;
            }
        });
    }

})();