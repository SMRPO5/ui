(function () {
    'use strict';

    angular
        .module('app')
        .controller('AnalyticsController', AnalyticsController);

    AnalyticsController.$inject = ['ProjectsService', 'CardsService', '$rootScope', '$scope', '$location', 'ModalProvider'];

    function AnalyticsController(ProjectsService, CardsService, $rootScope, $scope, $location, ModalProvider) {
        var vm = this;
        vm.labels = [];
        vm.cardLeadTime = [];
        vm.leadTimeAvg = 0;
        ProjectsService.getProjects().then(function (result) {
            if (result.status === 200) {
                vm.projects = result.data;
            }
        });
        CardsService.getAllCardTypes().then(function (result) {
            if (result.status === 200) {
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
            }
            ,
            "categories": [
                {
                    "category": {
                        "label": "1"
                    }
                }
            ],
            "dataset": [{
                "seriesname": "None",
                "renderas": "area",
                "data": [
                    {
                        "value": "0"
                    }]
            }]
        };

        vm.dataSource = angular.copy(vm.baseChart);
        vm.dataSource2 = angular.copy(vm.baseChart);
        vm.reset = function () {
            vm.min = 0;
            vm.max = 100;
            vm.options = {
                projects: '',
                startCreation: '',
                endCreation: '',
                startFinished: '',
                endFinished: '',
                startDevelopment: '',
                endDevelopment: '',
                type: -1,
                fromSize: '',
                toSize: ''
            };
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
        vm.setMin = function () {
            vm.min = vm.options.fromSize;
            if (vm.options.toSize < vm.min)
                vm.options.toSize = vm.min;
        };
        vm.setMax = function () {
            vm.max = vm.options.toSize;
            if (vm.options.fromSize > vm.max)
                vm.options.fromSize = vm.max;
        };
        vm.updateGraph1 = function () {
            var newDataSource = angular.copy(vm.baseChart);
            newDataSource.caption = 'Lead card time';
            newDataSource.dataset = vm.dataset2;
            newDataSource.categories[0].category = vm.category2;
            newDataSource.trendlines = [
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
            ];
            vm.dataSource = newDataSource;
        };
        vm.updateGraph2 = function () {
            var newDataSource = angular.copy(vm.baseChart);
            newDataSource.caption = 'Column card time';
            newDataSource.dataset = vm.dataset3;
            newDataSource.categories[0].category = vm.category3;
            vm.dataSource2 = newDataSource;

        };
        /*
        FusionCharts['debugger'].outputTo(function (message) {
            console.log(message);
        });
        FusionCharts['debugger'].enable(true);
        */
        vm.setIndex = function (index) {
            vm.index = index;
        };
        vm.getCardTime = function () {
            if (typeof vm.options.projects != 'undefined') {
                var newProject = [];
                for (var i = 0; i < vm.options.projects.length; i++) {
                    newProject.push(vm.options.projects[i].id);
                }

                vm.options.projects = newProject;
            }
            console.log(vm.options);

            if (vm.index == 0) {
                /*CardsService.getCardLeadTime(vm.options).then(function (result) {
                    if (result.status === 201) {
                        // $uibModalInstance.close(result.data);
                    }

                });*/
                var result = {data : []};
                vm.leadTimeAvg = 0;
                result.data = [12,41,13,5,6,7,11,88,9,33,21];
                var y = [];
                var x = [];
                for (var i = 0; i < result.data.length; i++) {
                    vm.leadTimeAvg += result.data[i];
                    x.push({"label": i.toString()});
                    y.push({"value": result.data[i].toString()});
                }
               
                vm.category2 = x;
                vm.leadTimeAvg /= result.data.length;
                vm.dataset2 = 
                [{
                    "seriesname": "Lead card time",
                    "data": y
                }];
                console.log(vm.dataset2);
                vm.updateGraph1();

            } else if (vm.index == 1) {
                /*
                CardsService.getCardColumnTime(vm.options).then(function (result) {
                    if (result.status === 201) {
                        // $uibModalInstance.close(result.data);
                    }
                });*/

                var result = {data : [],name : [],projects:[]};
                vm.leadTimeAvg = 0;
                result.projects = ["nproject1","project2"]
                result.data = [[12,41,13,5,6,7,11,88,9,33,21],[33,11,55,56,6,88,99,88,4,66,0]];
                result.name = ['fss','fss2','fss3','fss4','fss5','fss6','fss7','fss8','fss9','fss11','fss12'];
                
                var x = [];
                for (var i = 0; i < result.name.length; i++) {
                    x.push({"label": result.name[i]});
                }
                var dataY = [];
                for (var j = 0; j < result.data.length; j++) {
                    var y = [];
                    for (var i = 0; i < result.data[j].length; i++) {
                        y.push({"value": result.data[j][i].toString()});
                    }
                    dataY.push({"seriesname": result.projects[j],"renderas": "line", "data":y});
                }
               
                vm.category3 = x;
                vm.dataset3 = dataY;
                console.log(vm.dataset3);
                vm.updateGraph2();

            } else if (vm.index == 2) {

                console.log(vm.options);
                /*CardsService.getCardColumnTime(vm.options).then(function (result) {
                    if (result.status === 201) {
                        // $uibModalInstance.close(result.data);
                    }
                });*/
            }
/*
            vm.labels = [];
            vm.cardLeadTime = [];
            vm.cardLeadTime2 = [];
            vm.cardLeadTime3 = [];
            vm.leadTimeAvg = 0;
            for (var i = 0; i < 10; i++) {
                vm.labels.push({"label": i.toString()});
                var tmp = Math.floor(Math.random() * 15) + 1;
                vm.cardLeadTime.push({"value": tmp.toString()});
                vm.leadTimeAvg += tmp;
                tmp = Math.floor(Math.random() * 15) + 1;
                vm.cardLeadTime2.push({"value": tmp.toString()});
                tmp = Math.floor(Math.random() * 15) + 1;
                vm.cardLeadTime3.push({"value": tmp.toString()});

            }

            vm.leadTimeAvg = vm.leadTimeAvg / vm.cardLeadTime.length;
            vm.category = vm.labels;

            vm.dataset2 = [
                {
                    "seriesname": "Profit",
                    "renderas": "area",
                    "showvalues": "0",
                    "data": vm.cardLeadTime
                },
                {
                    "seriesname": "Actual Revenue",
                    "data": vm.cardLeadTime
                },
                {
                    "seriesname": "Projected Revenue",
                    "renderas": "line",
                    "showvalues": "0",
                    "data": vm.cardLeadTime
                }
            ];
            vm.dataset2.push({"seriesname": "stolpec", "renderas": "line", "data": vm.cardLeadTime2});
            vm.dataset2.push({"seriesname": "stolpec", "renderas": "line", "data": vm.cardLeadTime3});
            vm.updateGraph1();
            */
        };
    }
})();