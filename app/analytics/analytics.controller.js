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
                project: '',
                start_column:'',
                end_column:'',
                start_creation: '',
                end_creation: '',
                start_finished: '',
                end_finished: '',
                start_development: '',
                end_development: '',
                type: -1,
                from_size: '',
                to_size: '',
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
        vm.columns = [];
        vm.getColumns= function () {
            ProjectsService.getColumnsForProject(vm.options.project).then(function (result) {
                if (result.status === 200) {
                    
                    vm.columns = result.data;
                    console.log(result.data);
                };
            });
        };
        vm.setMin = function () {
            vm.min = vm.options.from_size;
            if (vm.options.to_size < vm.min)
                vm.options.to_size = vm.min;
        };
        vm.setMax = function () {
            vm.max = vm.options.to_size;
            if (vm.options.from_size > vm.max)
                vm.options.from_size = vm.max;
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
                var result = {data : [],};
                var result2 = [  
                    {id:1 , start_data:"2018-05-20T17:46:17.820309Z",end_data:"2018-05-31T17:46:17.820309Z" } ,
                    {id:4 , start_data:"2018-05-27T17:46:17.820309Z",end_data:"2018-05-31T17:46:17.820309Z" } ,
                    {id:3 , start_data:"2018-05-24T17:46:17.820309Z",end_data:"2018-05-31T17:46:17.820309Z" } ,
                    {id:6 , start_data:"2018-05-21T17:46:17.820309Z",end_data:"2018-05-31T17:46:17.820309Z" } ,
                    {id:5 , start_data:"2018-05-25T17:46:17.820309Z",end_data:"2018-05-31T17:46:17.820309Z" } ,
                    {id:7 , start_data:"2018-05-23T17:46:17.820309Z",end_data:"2018-05-29T17:46:17.820309Z" } ,
                ];
                vm.leadTimeAvg = 0;
                var y = [];
                var x = [];
                for (var i = 0; i < result2.length; i++) {
                    var d1 = new Date( result2[i].end_data);//vm.options.end_creation);
                    var d2 = new Date( result2[i].start_data);//vm.options.start_creation);
                    
                    // get total seconds between the times
                    var delta = Math.abs(d1 - d2) / 1000;
                    
                    // calculate whole days
                    var days = Math.floor(delta / 86400);
                    //console.log(result2[i].id);
                    x.push({"label": result2[i].id.toString()});
                    y.push({"value": days.toString()});
                    vm.leadTimeAvg += days;
                }
                vm.category2 = x;
                vm.leadTimeAvg /= result2.length;
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