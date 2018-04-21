"use strict";
(function () {
    angular
        .module('app')
        .controller('RemoveProjectController', RemoveProjectController);

    RemoveProjectController.$inject = ['$rootScope', 'ProjectsService', '$uibModalInstance', 'project'];
    function RemoveProjectController($rootScope, ProjectsService, $uibModalInstance, project) {
        var vm = this;
        vm.project = project;
        vm.removeProject = function() {
            ProjectsService.removeProject(project.id).then(function(response) {
                if (response.status === 204) {
                    $uibModalInstance.close();
                }
            });
        };
        vm.close = function() {
            $uibModalInstance.dismiss();
        };
    }

})();
