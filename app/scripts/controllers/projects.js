'use strict';

angular.module('scegratooApp')
.controller('ProjectsCtrl', function ($scope, Project) {
  $scope.projects = Project.query()
})
