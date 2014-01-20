'use strict';

angular.module('scegratooApp')
  .directive('sgtX3d', function ($window) {
    return {
      // template: '',
      restrict: 'AE',
      scope: {
        content: '='
      },
      link: function postLink(scope, element) {
        scope.$watch('content', function(content) {
          element.html(content)
          element.children().addClass('fullpage')
          $window.x3dom.reload()
        })
      }
    };
  });
