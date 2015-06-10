'use strict';

angular.module('scegratooApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, Project) {
    $scope.project = Project.get({project: $routeParams.project}, function(project) {
      // save projectId to url concatenation in the view
      $scope.projectName = $routeParams.project

      // convert each file into an object
      project.files.forEach(function(file, index, list) {
        list[index] = {path: file, view: ''}
      })

      // find file extension to decide what view to use
      project.files.forEach(function(file) {
        var fileExtension = file.path.match(/.[^.]*$/)[0]

        switch (fileExtension) {
          case '.js':
            file.view = 'source'
            break
          case '.x3d':
            file.view = 'x3d'
            break
          case '.sdf':
            file.view = 'ssiml'
        }
      })
    })
  });
