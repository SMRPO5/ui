(function() {
    /* global angular */
    function navigation() {

        return {
            popoverTemplate: 'app-popovers/login-help.popover.html',
            templateUrl: "app-directives/navigation/navigation.view.html",
            link: function(scope, element, attrs, controllers) {
                var vm = this;
                scope.popoverTemplate = 'app-popovers/login-help.popover.html';
            }
        }
        /*
        vm.popoverTemplate = 'app-popovers/login-help.popover.html';
        vm.templateUrl = "app-directives/navigation/navigation.view.html";
        return vm;
        */
    }

    angular
        .module('app')
        .directive('navigation', [navigation]);
})();