'use strict';

angular.module('scegratooApp')
  .directive('sgtX3d', function ($window, $routeParams, Constants) {
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

          var inlines = element.find('inline')
          angular.forEach(inlines, function(inline) {
            var url = inline.getAttribute('url')
            inline.setAttribute('url', Constants.apiRoot +
              '/' + 'projects' +
              '/' + $routeParams.project +
              '/' + $routeParams.file.replace(/\/[^\/]*$/, '') +
              '/' + url)
          })

          $window.x3dom.reload()
        })
      }
    };
  });
