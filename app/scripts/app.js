'use strict';

angular.module('scegratooApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .otherwise({
        redirectTo: '/projects'
      });
  });
