(function() {
    /* global angular */
    function modalProvider($uibModal) {
        function openAddGroupModal(ev) {
            return $uibModal.open({
                controller: 'AddGroupController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/add/addGroup.view.html',


                size: 'lg',
                /*
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    }
                }*/
            });
        }

        function openEditGroupModal(ev) {
            return $uibModal.open({
                controller: 'EditGroupController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/edit/editGroup.view.html',


                size: 'lg',

                resolve: {
                    items: function () {
                        return "asd";
                    }
                }
            });
        }

        function openAddProjectModal(ev) {
            return $uibModal.open({
                controller: 'AddProjectController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/projects/add/addProject.view.html',


                size: 'lg',
                /*
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    }
                }*/
            });
        }

        function openEditProjectModal(ev) {
            return $uibModal.open({
                controller: 'EditProjectController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/projects/edit/editProject.view.html',


                size: 'lg',
                /*
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    }
                }*/
            });
        }
        
        function openEditExamModal(ev, exam) {
            return $mdDialog.show({
                controller: 'EditExamController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: '../common/modals/editExam/editExam.view.html',
                clickOutsideToClose: true,
                locals: { exam: exam },
                bindToController: true,
            });
        }
        
        function openRemoveExamModal(ev, exam) {
            // return $mdDialog.show($mdDialog.confirm()
            // .title('Ali Res želiš izbrisata izpitni rok?')
            // .textContent('Vsi študetnje bodo odjavljeni iz izpita')
            // .ariaLabel('Delete Exam')
            // .targetEvent(ev)
            // .clickOutsideToClose(true)
            // .ok('DA')
            // .cancel('NE'));
            return $mdDialog.show({
                controller: 'RemoveExamController',
                controllerAs: 'vm',
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: '../common/modals/removeExam/removeExam.view.html',
                clickOutsideToClose: true,
                locals: { exam: exam },
                bindToController: true,
            });
        }

        return {
            openAddGroupModal: openAddGroupModal,
            openEditGroupModal: openEditGroupModal,
            openAddProjectModal: openAddProjectModal,
            openEditProjectModal: openEditProjectModal
        }
    }


    angular
        .module('app')
        .service('ModalProvider', ['$uibModal', modalProvider]);
})();
