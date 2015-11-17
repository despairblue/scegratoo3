require('./treeview')

import angular from 'angular'
import React from 'react'

angular.module('scegratooApp')
  .directive('treeview', function (TreeView) {
    return {
      // template: '',
      restrict: 'AE',
      scope: {
        data: '=',
        id: '@'
      },
      link: function postLink (scope, element) {
        scope.$watch('data', function () {
          React.render(
            React.createElement(
              TreeView,
              {
                data: scope.data
              }
            ),
            element[0]
          )
        })
      }
    }
  })
