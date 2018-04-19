(function () {

    function addGroupController(UserService, DevGrpsService, ModalProvider, $uibModalInstance, $scope) {
        var vm = this;

        UserService.getUsers().then(function (result) {
            if (result.status === 200) {
                var allUsers = result.data;

                var kbMastersList = [];
                var productOwnersList = [];
                var developersList = [];


                // Koda za popravit, začasna rešitev (popravljeno na hitro)
                for (var i = 0; i < allUsers.length; i++) {
                    var roles = allUsers[i].allowed_roles
                    for (var j = 0; j < roles.length; j++) {
                        if (roles[j].name === "Kanban Master") {
                            vm.kbMasterID = roles[j].id;
                            kbMastersList.push(allUsers[i]);
                        }
                        if (roles[j].name === "Product Owner") {
                            vm.productOwnerID = roles[j].id;
                            productOwnersList.push(allUsers[i]);
                        }
                        if (roles[j].name === "Developer") {
                            vm.developerID = roles[j].id;
                            developersList.push(allUsers[i]);
                        }
                    }
                }
                vm.kbMasters = kbMastersList;
                vm.developers = developersList;
                vm.productOwners = productOwnersList;
            }

        });

        vm.addGroup = function () {
            if (typeof vm.developer != 'undefined') {

                var members = [];

                //console.log(vm.owner);

                if (vm.owner === vm.kbMaster) {
                    members.push({
                        user: vm.owner,
                        role: [vm.productOwnerID, vm.kbMasterID]
                    });
                } else {
                    members.push({
                        user: vm.owner,
                        role: [vm.productOwnerID]
                    });
                    members.push({
                        user: vm.kbMaster,
                        role: [vm.kbMasterID]
                    });
                }

                for (var i = 0; i < vm.developer.length; i++) {
                    var existing = false;
                    for (var j = 0; j < members.length; j++) {
                        var member = members[j];
                        if (member.user === vm.developer[i].email) {
                            existing = true;
                            members[j].role.push(vm.developerID);
                            continue;
                        }
                    }
                    if (!existing) {
                        members.push({
                            user: vm.developer[i].email,
                            role: [vm.developerID]
                        });
                    }
                }

                var groupData = {
                    name: vm.name,
                    members: members
                };

                console.log("Ustvarjam novo devGroupo... Podatki:")
                console.log(groupData);


                DevGrpsService.addDeveloperGroup(groupData).then(function (result) {
                    if (result.status === 201) {
                        $uibModalInstance.close(result.data);
                    }
                });

                // ToDo: Alert user that the group was created.
            }
        };
    }


    angular
        .module('app')
        .controller('AddGroupController', ['UserService', 'DevGrpsService', 'ModalProvider', '$uibModalInstance', '$scope', addGroupController]);


})();
