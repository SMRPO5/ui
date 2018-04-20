(function () {

        function editGroupController(UserService, DevGrpsService, $uibModalInstance, group) {


            var vm = this;
            vm.name = group.name;

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

                    var devList = [];


                    // Iskanje id-ja obstoječega ownerja (WIP)
                    for (var i = 0; i < group.members.length; i++) {
                        //console.log(group);
                        var member = group.members[i];
                        for (var j = 0; j < member.role.length; j++) {
                            if (member.role[j] === vm.productOwnerID) {
                                for (var k = 0; k < allUsers.length; k++) {
                                    if (member.user === allUsers[k].email) {
                                        vm.owner = allUsers[k].email;
                                        //console.log(vm.owner);
                                    }
                                }
                            } else if (member.role[j] === vm.kbMasterID) {
                                for (var k = 0; k < allUsers.length; k++) {
                                    if (member.user === allUsers[k].email) {
                                        vm.kbMaster = allUsers[k].email;
                                        //console.log(vm.owner);
                                    }
                                }
                            } else if (member.role[j] === vm.developerID) {
                                for (var k = 0; k < allUsers.length; k++) {
                                    if (member.user === allUsers[k].email) {
                                        devList.push(allUsers[k]);
                                    }
                                }
                            }
                        }
                    }
                    //console.log(devList); // Seznam developerjev na projektu
                    vm.developer = devList;
                }
            });


            vm.editGroup = function () {
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

                    console.log("Urejam devGroupo (id \'" + group.id + "\')... Podatki:")
                    console.log(groupData);

                    DevGrpsService.editDeveloperGroup(group.id, groupData).then(function (result) {
                        $uibModalInstance.close(result.data);
                        if (result.status === 201) {
                        }
                    });

                    //$uibModalInstance.close(groupData);
                }
            };

            vm.deleteGroup = function () {
                DevGrpsService.removeDeveloperGroup(group.id).then(function (result) {
                    $uibModalInstance.close('del', group.id);
                    if (result.status === 200) {

                    }
                });
            };
        }


        angular
            .module('app')
            .controller('EditGroupController', ['UserService', 'DevGrpsService', '$uibModalInstance', 'group', editGroupController]);
    }

)();
