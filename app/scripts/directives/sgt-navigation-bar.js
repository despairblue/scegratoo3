'use strict';

angular.module('scegratooApp').directive('sgtNavigationBar', function() {
  return {
    templateUrl: 'views/directives/sgt-navigation-bar.html',
    restrict: 'A',
    link: function postLink(scope, element) {
      scope.items = [{
        text: 'X3D',
        href: 'x3d'
      }, {
        text: 'Source',
        href: 'source'
      }, {
        text: 'Tree',
        href: 'tree'
      }, {
        text: 'Ssiml',
        href: 'ssiml'
      }]

      element.addClass('navbar navbar-default navbar-fixed-top')
      element.attr('role', 'navigation')
    }
  };
});
