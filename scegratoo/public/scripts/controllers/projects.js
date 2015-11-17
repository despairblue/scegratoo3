require('../services/project.js')

import angular from 'angular'

angular.module('scegratooApp')
.controller('ProjectsCtrl', function ($scope, Project) {
  $scope.projects = Project.query()
})
