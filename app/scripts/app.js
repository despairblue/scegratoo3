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
      .when('/projects/:project/x3d/:file*', {
        templateUrl: 'views/projects/:project/x3d/:file.html',
        controller: 'ProjectsProjectX3dFileCtrl'
      })
      // .otherwise({
      //   redirectTo: '/projects'
      // });
  });
