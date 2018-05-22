(function () {
    'use strict';

    angular
        .module('app')
        .controller('AnalyticsController', AnalyticsController);

    AnalyticsController.$inject = ['ProjectsService','CardsService', '$rootScope', '$scope', '$location', 'ModalProvider'];

    function AnalyticsController(ProjectsService,CardsService, $rootScope, $scope, $location, ModalProvider) {
        var vm = this;
        vm.labels = [];
        vm.cardLeadTime = [];
        vm.leadTimeAvg = 0;
        ProjectsService.getProjects().then(function(result) {
            if(result.status === 200) {
                vm.projects = result.data;
            }
        });

        CardsService.getAllCardTypes().then(function(result) {
            if(result.status === 200) {
                vm.cardTypes = result.data;
            }
        });

        vm.baseChart = { 
            "chart": {
                "caption": "Card lead time",
                "subcaption": "",
                "xaxisname": "Cards",
                "yaxisname": "Days",
                "numberprefix": ""
            },
            "categories": [
                {
                    "category":{
                        "label": "1"
                    }
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": vm.leadTimeAvg.toString(),
                            "color": "FF0000",
                            "displayvalue": "Avg",
                            "thickness": "3"
                        }
                    ]
                }
            ],
            "dataset":[{
                "seriesname": "None",
                "renderas": "area",
                "data": [
                    {
                        "value": "1"
                    }]
            }]
        };/*
        vm.category= [{
            "label": "1"
        }];
        vm.dataset2 = [{
            "seriesname": "Actual Revenue",
            "renderas": "area",
            "data": [
                {
                    "value": "1"
                }]
        }];*/
        vm.reset = function(){
            //vm.options=vm.defOptions;
            //$scope.formAnalytics.$setPristine();
            vm.mix = 0;
            vm.max = 100;
            vm.options={
                projects: '',
                startCreation: '',
                endCreation: '',
                startFinished: '',
                endFinished: '',
                startDevelopment: '',
                endDevelopment: '',
                type:-1,
                fromSize: '',
                toSize:''
            };
            vm.dataSource = angular.copy(vm.baseChart);
            vm.dataSource2 = angular.copy(vm.baseChart);
            console.log(vm.options);
        };
        vm.reset();
        vm.defOptions = angular.copy(vm.options);
        vm.popup = {
             open1: false,
             open2: false,
             open3: false,
             open4: false,
             open5: false,
             open6: false
        };
        
        
        vm.startOptions = {
            maxDate: new Date()
        };
        vm.endOptions = {
            minDate: new Date()
        };
       vm.updateGraph1 = function(){
            var newDataSource = angular.copy(vm.baseChart); 
            newDataSource.dataset =vm.dataset2;
            newDataSource.categories[0].category =vm.category;
            newDataSource.trendlines[0].line[0].startvalue=vm.leadTimeAvg.toString();
            vm.dataSource = newDataSource;
        };
        vm.updateGraph2 = function(){
            vm.dataSource = angular.copy(vm.baseChart);
            
        };
        /*
        FusionCharts['debugger'].outputTo(function (message) {
            console.log(message);
        });
        FusionCharts['debugger'].enable(true);
        */
       vm.alertMe = function(index){
        vm.index=index;
        console.log(index);
       };
        vm.getCardTime = function() {
            if(typeof vm.options.projects != 'undefined'){
                var newProject = [];
                for (var i = 0; i < vm.options.projects.length; i++) {
                    newProject.push(vm.options.projects[i].id);
                }
            
                vm.options.projects = newProject;
            }
            console.log(vm.options);
            /*
            if(vm.index==0){
            CardsService.getCardLeadTime(vm.options).then(function(result) {
                if (result.status === 201) {
                   // $uibModalInstance.close(result.data);
                }
            }else if(vm.index==1){
            CardsService.getCardColumnTime(vm.options).then(function(result) {
                if (result.status === 201) {
                   // $uibModalInstance.close(result.data);
                }
            });
            }
            */
            vm.labels = [];
            vm.cardLeadTime = [];
            vm.cardLeadTime2 = [];
            vm.cardLeadTime3 = [];
            vm.leadTimeAvg = 0;
            for (var i = 0; i < 10; i++) {
                vm.labels.push({"label":  i.toString() });
                var tmp = Math.floor(Math.random() * 15) + 1 ;
                vm.cardLeadTime.push({"value":  tmp.toString() });
                vm.leadTimeAvg += tmp;
                tmp = Math.floor(Math.random() * 15) + 1 ;
                vm.cardLeadTime2.push({"value":  tmp.toString() });
                tmp = Math.floor(Math.random() * 15) + 1 ;
                vm.cardLeadTime3.push({"value":  tmp.toString() });
                
            }
            
            vm.leadTimeAvg = vm.leadTimeAvg / vm.cardLeadTime.length;
            vm.category= vm.labels;
            vm.dataset2 = [
                {            
                    "seriesname": "Profit",
                    "renderas": "area",
                    "showvalues": "0",
                    "data": vm.cardLeadTime
                },
                {
                    "seriesname": "Actual Revenue",
                    "data":vm.cardLeadTime
                },
                {
                    "seriesname": "Projected Revenue",
                    "renderas": "line",
                    "showvalues": "0",
                    "data": vm.cardLeadTime
                }
            ];
            vm.dataset2.push({"seriesname": "stolpec","renderas": "line","data": vm.cardLeadTime2});
            vm.dataset2.push({"seriesname": "stolpec","renderas": "line","data": vm.cardLeadTime3});
            vm.updateGraph1();
        };
    }
})();