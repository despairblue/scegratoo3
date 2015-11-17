'use strict'

// angular needs jquery globally
window.jQuery = require('jquery')
const angular = require('angular')
const ngCookies = require('angular-cookies')
const ngResource = require('angular-resource')
const ngSanitize = require('angular-sanitize')
const ngRoute = require('angular-route')
const uiBootstrap = require('angular-ui-bootstrap')

angular.module('scegratooApp', [
  ngCookies,
  ngResource,
  ngSanitize,
  ngRoute,
  uiBootstrap
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/projects'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/projects/:project/:file*', {
        templateUrl: 'views/projects/:project/x3d/:file.html',
        controller: 'ProjectsProjectX3dFileCtrl'
      })
      // .otherwise({
      //   redirectTo: '/projects'
      // });
  })

// require all ng modules, so that they register themself
// require('./controllers/project')
require('./controllers/projects')
require('./controllers/projects/:project/x3d/:file')

// needs to be required, otherwise it's registered too late,
// I guess...it's weird
require('./services/treenode')
