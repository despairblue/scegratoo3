'use strict';

angular.module('scegratooApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, Project) {
    $scope.project = Project.get({projectId: $routeParams.projectId})
  });
