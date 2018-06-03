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
                "caption": "None",
                "subcaption": "",
                "xaxisname": "",
                "yaxisname": "",
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
                start_creation_date: '',
                end_creation_date: '',
                start_finished_date: '',
                end_finished_date: '',
                start_development_date: '',
                end_development_date: '',
                type: '-1',
                from_size: '',
                to_size: '',
            };
            console.log(vm.options);
        };

        vm.removeNil = function (){
            var data_send = {};
            for (var key in vm.options) {
                // check if the property/key is defined in the object itself, not in parent
                if (vm.options.hasOwnProperty(key)) {       
                    if(vm.options[key] != '' && vm.options[key] != null && vm.options[key] != '-1'  ){
                        data_send[key] = vm.options[key];
                    }    
                }
            }
            //console.log(data_send);
            return data_send;
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
        vm.endOptions1 = {
            minDate: vm.options.start_creation_date
        };
        vm.endOptions3 = {
            minDate: vm.options.start_development_date
        };
        vm.endOptions2 = {
            minDate: vm.options.start_finished_date
        };
        vm.datesStartCreation = function () {
            vm.endOptions1.minDate =  vm.options.start_creation_date;
            if(vm.options.start_creation_date > vm.options.end_creation_date && vm.options.end_creation_date != ''){
                vm.options.end_creation_date = vm.options.start_creation_date
            }
        }
        vm.datesStartFinished = function () {
            vm.endOptions2.minDate =  vm.options.start_finished_date;
            if(vm.options.start_finished_date > vm.options.end_finished_date && vm.options.end_finished_date != ''){
                vm.options.end_finished_date = vm.options.start_finished_date
            }
        }
        vm.datesStartDevelopment = function () {
            vm.endOptions3.minDate =  vm.options.start_development_date;
            if(vm.options.start_development_date > vm.options.end_development_date && vm.options.end_development_date != ''){
                vm.options.end_development_date = vm.options.start_development_date
            }
        }
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
        vm.blockDate1 = function () {
            return (vm.options.start_finished_date == '' && vm.options.end_finished_date == '' 
                    && vm.options.start_development_date == '' && vm.options.end_development_date == '');
        };
        vm.blockDate2 = function () {
            return (vm.options.start_creation_date == '' && vm.options.end_creation_date == '' 
                    && vm.options.start_development_date == '' && vm.options.end_development_date == '');
        };
        vm.blockDate3 = function () {
            return (vm.options.start_finished_date == '' && vm.options.end_finished_date == '' 
                    && vm.options.start_creation_date == '' && vm.options.end_creation_date == '');
        };

        vm.updateGraph1 = function () {
            var newDataSource = angular.copy(vm.baseChart);
            newDataSource.chart.caption = 'Lead card time';
            newDataSource.chart.yaxisname = 'Number of days';
            newDataSource.chart.xaxisname = 'Cards';
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
            newDataSource.chart.caption = ' Numbers of cards per column';
            newDataSource.chart.yaxisname = 'Number of cards';
            newDataSource.chart.xaxisname = 'Dates';
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
            /*
            if (typeof vm.options.projects != 'undefined') {
                var newProject = [];
                for (var i = 0; i < vm.options.projects.length; i++) {
                    newProject.push(vm.options.projects[i].id);
                }

                vm.options.projects = newProject;
            }*/
            //console.log(vm.options);

            if (vm.index == 0) {
                var data_send = vm.removeNil();
                console.log(data_send);
                CardsService.getCardLeadTime(data_send).then(function (result) {
                    if (result.status === 200) {
                        // $uibModalInstance.close(result.data);
                        console.log(result);


                    }


                });
                console.log(data_send);
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
                var data_send = vm.removeNil();
                /*
                CardsService.getCardColumnTime(vm.options).then(function (result) {
                    if (result.status === 201) {
                        // $uibModalInstance.close(result.data);
                    }
                });*/
                console.log(data_send);
                var result = [  
                    {name:"Next", cart_count:[1,1,1,2,6] ,  datas:["2018-05-26T17:46:17.820309Z","2018-05-28T17:46:17.820309Z","2018-05-31T17:46:17.820309Z","2018-06-02T17:46:17.820309Z","2018-06-04T17:46:17.820309Z"]},
                    {name:"Backlog", cart_count:[6,0,9,2,3] ,  datas:["2018-05-26T17:46:17.820309Z","2018-05-28T17:46:17.820309Z","2018-05-31T17:46:17.820309Z","2018-06-02T17:46:17.820309Z","2018-06-04T17:46:17.820309Z"]},
                    {name:"Dev", cart_count:[5,3,2,2,5] ,  datas:["2018-05-26T17:46:17.820309Z","2018-05-28T17:46:17.820309Z","2018-05-31T17:46:17.820309Z","2018-06-02T17:46:17.820309Z","2018-06-04T17:46:17.820309Z"]},
                    {name:"Done", cart_count:[6,4,9,2,8] ,  datas:["2018-05-26T17:46:17.820309Z","2018-05-28T17:46:17.820309Z","2018-05-31T17:46:17.820309Z","2018-06-02T17:46:17.820309Z","2018-06-04T17:46:17.820309Z"]}
                ];
                
                var x = [];
                for (var i = 0; i < result[0].datas.length; i++) {
                    x.push({"label": formatDate(result[0].datas[i])});
                }
                var dataY = [];
                for (var j = 0; j < result.length; j++) {
                    var y = [];
                    for (var i = 0; i < result[j].cart_count.length; i++) {
                        y.push({"value": result[j].cart_count[i].toString()});
                    }
                    //dataY.push({"seriesname": result[j].name,"renderas": "area", "data":y});
                    dataY.push({"seriesname": result[j].name,"renderas": "line", "data":y});
                
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
        };
    };
    function formatDate(date) {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [day, month].join('-');
       // return [day, month,year].join('-');
    };
})();