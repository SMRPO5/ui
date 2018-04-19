(function() {
    /* global angular */
    function modalProvider($uibModal, $document) {
        function openAddGroupModal(ev) {
            return $uibModal.open({
                controller: 'AddGroupController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/add/addGroup.view.html',


                size: 'lg',

                /*resolve: {
                    group: function () {
                        return groupData;
                    }
                }*/
            });
        }

        function openEditGroupModal(ev, groupData) {
            return $uibModal.open({
                controller: 'EditGroupController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/devgroups/edit/editGroup.view.html',


                size: 'lg',

                resolve: {
                    group: function () {
                        return groupData;
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
                size: 'lg'
                /*
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    }
                }*/
            });
        }

        function openEditProjectModal(ev, projectData) {
            return $uibModal.open({
                controller: 'EditProjectController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app-modals/projects/edit/editProject.view.html',


                size: 'lg',

                resolve: {
                    project: function () {
                        return projectData;
                    }
                }
            });
        }

        function openEditCard(card) {
            return $uibModal.open({
                controller: 'EditCardController',
                controllerAs: 'vm',
                appendTo: angular.element(document.body),
                templateUrl: 'app-modals/card/edit/editCard.view.html',
                resolve: {
                    card: function () {
                        return card;
                    }
                }
            });
        }

        function openCreateCardModal() {
            return $uibModal.open({
                templateUrl: 'app-modals/card/create/createCard.view.html',
                controller: 'CreateCardController',
                controllerAs: 'vm',
                appendTo: angular.element($document[0].querySelector('.modal_container'))
            });
        }

        return {
            openAddGroupModal: openAddGroupModal,
            openEditGroupModal: openEditGroupModal,
            openAddProjectModal: openAddProjectModal,
            openEditProjectModal: openEditProjectModal,
            openCreateCardModal: openCreateCardModal,
            openEditCard: openEditCard
        }
    }


    angular
        .module('app')
        .service('ModalProvider', ['$uibModal', '$document', modalProvider]);
})();
