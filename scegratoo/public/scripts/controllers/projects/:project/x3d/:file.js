require('../../../../services/project')
require('../../../../directives/sgt-x3d')
require('../../../../directives/sgt-navigation-bar')

import angular from 'angular'

angular.module('scegratooApp')
  .controller('ProjectsProjectX3dFileCtrl', function ($scope, $routeParams, Project) {
    Project.get({
      project: $routeParams.project,
      file: $routeParams.file
    }, function (file) {
      $scope.x3d = file.data
      const tree = document.createElement('div')
      tree.innerHTML = file.data
      $scope.tree = tree.children[0]
    })
  })
