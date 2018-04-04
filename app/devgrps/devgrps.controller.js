﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('DevGrpsController', DevGrpsController);

    DevGrpsController.$inject = ['DevGrpsService', '$rootScope', '$scope', '$location'];

    function DevGrpsController(DevGrpsService, $rootScope, $scope, $location) {
        var vm = this;
        getGroups();






        vm.isActive = isActive;
        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        vm.getGroups = getGroups;
        function getGroups(){
            DevGrpsService.GetAll().then(function(data) {$scope.groups = data;}, function() {console.log('error')});
        }

        vm.openDevGrpModal = openDevGrpModal;

        function openDevGrpModal(index){
            alert("ToDo: Open dialog for DevGroup with id: " + index);
        }

        vm.createGroup = createGroup;

        function createGroup(){
            alert("ToDo: Open dialog for creation of a new DevGroup");
        }

        // TODO



    }

})();