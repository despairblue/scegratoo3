'use strict'

const angular = window.angular

angular.module('scegratooApp')
  .directive('treeview', function (React, TreeView) {
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
