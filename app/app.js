(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'environment', 'ui.bootstrap'])
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

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .when('/board', {
                controller: 'BoardController',
                templateUrl: 'board/board.view.html',
                controllerAs: 'vm'
            })

            .when('/devgrps', {
                controller: 'DevGrpsController',
                templateUrl: 'devgrps/devgrps.view.html',
                controllerAs: 'vm'
            })

            .when('/projects', {
                controller: 'ProjectsController',
                templateUrl: 'projects/projects.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common.Authorization = 'JWT ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {



            // ZAČASNO : Potrebno spremeniti (Klemen)
            var location = $location.path();

            if (location === '/login'){
                document.getElementById("board").setAttribute("class", "ng-hide");
                document.getElementById("devgrps").setAttribute("class", "ng-hide");
                document.getElementById("projects").setAttribute("class", "ng-hide");
                document.getElementById("logout").setAttribute("class", "ng-hide");
                document.getElementById("brand").setAttribute("href", "");
            } else if (location === '/') {
                document.getElementById("board").setAttribute("class", "");
                document.getElementById("devgrps").setAttribute("class", "");
                document.getElementById("projects").setAttribute("class", "");
                document.getElementById("logout").setAttribute("class", "");
            } else if (location === '/board') {
                document.getElementById("board").setAttribute("class", "active");
                document.getElementById("devgrps").setAttribute("class", "");
                document.getElementById("projects").setAttribute("class", "");
                document.getElementById("logout").setAttribute("class", "");
            } else if (location === '/devgrps') {
                document.getElementById("board").setAttribute("class", "");
                document.getElementById("devgrps").setAttribute("class", "active");
                document.getElementById("projects").setAttribute("class", "");
                document.getElementById("logout").setAttribute("class", "");
            } else if (location === '/projects') {
                document.getElementById("board").setAttribute("class", "");
                document.getElementById("devgrps").setAttribute("class", "");
                document.getElementById("projects").setAttribute("class", "active");
                document.getElementById("logout").setAttribute("class", "");
            }
            //END ZAČASNO


            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();