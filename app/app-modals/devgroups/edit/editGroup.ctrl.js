(function() {

    function editGroupController(UserService, DevGrpsService, $uibModalInstance, $mdDialog) {
        var vm = this;

        UserService.getUsers().then(function (result) {
            if (result.status === 200) {
                var allUsers = result.data;

                var kbMastersList = [];
                var productOwnersList = [];
                var developersList = [];

                for (var i = 0; i < allUsers.length; i++) {
                    var roles = allUsers[i].allowed_roles
                    for (var j = 0; j < roles.length; j++) {
                        if (roles[j].name === "Kanban Master") {
                            kbMastersList.push(allUsers[i]);
                        }
                        if (roles[j].name === "Product Owner") {
                            productOwnersList.push(allUsers[i]);
                        }
                        if (roles[j].name === "Developer") {
                            developersList.push(allUsers[i]);
                        }
                    }
                }
                vm.kbMasters = kbMastersList;
                vm.developers = developersList;
                vm.productOwners = productOwnersList;
            }
        });

        vm.editGroup = function() {

            var GroupData = {
                name: vm.name,
                productOwner: vm.owner,
                kanbanMaster: vm.kbMaster,
                developers: vm.developer
            };

            console.log("Edit group!");
            console.log(GroupData);
        };
    }


    angular
        .module('app')
        .controller('EditGroupController', ['UserService', 'DevGrpsService', 'ModalProvider', '$uibModalInstance', editGroupController]);
})();
