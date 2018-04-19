﻿"use strict";
(function () {
    angular
        .module('app', ['ngRoute', 'ngCookies', 'environment', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angularMoment', 'dndLists'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', 'envServiceProvider'];
    function config($routeProvider, $locationProvider, envServiceProvider) {
        envServiceProvider.config({
            domains: {
                development: ['localhost', 'main.local', 'laptop.local', '127.0.0.1'],
                production: ['home.zivkovic.si', '192.168.42.4', 'server.local']
            },
            vars: {
                development: {
                    apiUrl: 'http://localhost:8000/'
                },
                production: {
                    apiUrl: 'https://home.zivkovic.si/api/'
                }
            }
        });

        envServiceProvider.check();

        // Uncomment bottom line to connect to production server.
        //envServiceProvider.set('production');

        console.log("ApiUrl: " + envServiceProvider.read('apiUrl'));

        var onlyLoggedIn = function($location, $q, AuthenticationService) {
            var deferred = $q.defer();
            if (AuthenticationService.isLoggedIn()) {
                deferred.resolve();
            } else {
                deferred.reject();
                AuthenticationService.logoutUser();
                $location.path('/login');
            }
            return deferred.promise;
        };

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm',
                resolve: {
                    onlyLoggedIn: ['$location', '$q', 'AuthenticationService', onlyLoggedIn]
                }
            }).when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            }).when('/board', {
                controller: 'BoardController',
                templateUrl: 'board/board.view.html',
                controllerAs: 'vm',
                resolve: {
                    onlyLoggedIn: ['$location', '$q', 'AuthenticationService', onlyLoggedIn]
                }
            }).when('/devgrps', {
                controller: 'DevGrpsController',
                templateUrl: 'devgrps/devgrps.view.html',
                controllerAs: 'vm',
                resolve: {
                    onlyLoggedIn: ['$location', '$q', 'AuthenticationService', onlyLoggedIn]
                }
            }).when('/projects', {
                controller: 'ProjectsController',
                templateUrl: 'projects/projects.view.html',
                controllerAs: 'vm',
                resolve: {
                    onlyLoggedIn: ['$location', '$q', 'AuthenticationService', onlyLoggedIn]
                }
            }).otherwise({
                redirectTo: '/'
            });
    }

    run.$inject = ['$rootScope', '$location', 'AuthenticationService', 'UserService'];
    function run($rootScope, $location, AuthenticationService, UserService) {
        $rootScope.isPathActive = function(path) {
            //console.log($location.path());
            return $location.path() === path;
        };
        $rootScope.isLoggedIn = function() {
            return AuthenticationService.isLoggedIn();
        };
        $rootScope.logoutUser = function() {
            AuthenticationService.logoutUser();
            $location.path('/login');
        };

        $rootScope.hasRole = function (string) {
            var roles = $rootScope.currentUser.allowed_roles;

            for (var i = 0 ; i < roles.length ; i++){
                if (roles[i].name === string){
                    return true;
                }
            }
            return false;
        };

        $rootScope.saveCurrentUser = function () {
            UserService.getMe().then(function (result) {
                $rootScope.currentUser = result.data[0];
            });
        };
    }

})();