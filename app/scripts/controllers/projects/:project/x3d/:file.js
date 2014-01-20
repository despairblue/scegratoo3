'use strict';

angular.module('scegratooApp')
  .controller('ProjectsProjectX3dFileCtrl', function ($scope, $routeParams, Project) {
    Project.get({project: $routeParams.project, file: $routeParams.file}, function(file) {
      $scope.x3d = file.data
    })

    // x3d.get().then(function(element) {
    //   element.querySelector('inline').forEach(function(inline) {
    //     $scope.transformations.push(encapsulate(inline))
    //     inline.addEventListener('click', function(i) {
    //       $scope.currentElement = i
    //     })
    //   })
    // })

    // function encapsulate(inline) {
    //   console.log(inline)
    // }
  });
