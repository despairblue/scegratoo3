'use strict';

angular.module('scegratooApp')
  .controller('ViewDropdownCtrl', function ($scope) {
    $scope.items = [
      {
        text: 'X3D',
        href: 'x3d'
      },
      {
        text: 'Source',
        href: 'source'
      },
      {
        text: 'Tree',
        href: 'tree'
      },
      {
        text: 'Ssiml',
        href: 'ssiml'
      }
    ];
  });
