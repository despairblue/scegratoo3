'use strict';

angular.module('scegratooApp')
  .directive('sgtX3d', function ($window, $routeParams, Constants, X3domUtils, $http, $q, $templateCache) {
    return {
      // template: '',
      restrict: 'AE',
      // scope: {
      //   content: '='
      // },
      link: function postLink(scope, element, attrs) {
        // console.debug('function postLink(%o, %o, %o)', scope, element, attrs)

        // load templates TODO: find better way than loading them manually
        $q.all([
          $http.get('/templates/crosshair.html'),
          $http.get('/templates/planeSensor-X.html'),
          $http.get('/templates/planeSensor-Y.html'),
        ]).then(function (results) {
          angular.forEach(results, function(value) {
            $templateCache.put(value.config.url, value.data);
          });
        }).then(function () {
          // extract in directive
          var gui = new $window.dat.GUI({autoPlace: false})
          console.debug('Created ', gui);
          element.parent().prepend($(gui.domElement)
            .css('float', 'left')
            .css('position', 'absolute')
            .css('z-index', 1))
          var guiCoordinates = gui.addFolder('Coordinates')
          var guiSwitches    = gui.addFolder('Switches')

          var options = X3domUtils.setUp(element)

          guiCoordinates.add(options, 'x').listen()
          guiCoordinates.add(options, 'y').listen()
          guiCoordinates.add(options, 'z').listen()
          guiSwitches.add(options, 'useHitPnt')
          guiSwitches.add(options, 'snapToGrid')

          scope.$watch(attrs.content, function(content) {
            element.html(content)
            element.children().addClass('fullpage')
            options = X3domUtils.setUp(element)
          })
        })
      }
    };
  });
