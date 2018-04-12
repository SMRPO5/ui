(function() {
    /* global angular */
    function navigation() {

        return {
            templateUrl: "app-directives/navigation/navigation.view.html",
            link: function(scope, element, attrs, controllers) {
                // $rootScope.helpTemplate must be set in controllers...
                // Example:
                // $rootScope.helpTemplate = 'app-popovers/login-help.popover.html';
                //console.log("2", scope.helpTemplate);
                //console.log("3", scope.$root.helpTemplate)
            }
        }
    }

    angular
        .module('app')
        .directive('navigation', [navigation]);
})();