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
        var templates = [
          'templates/crosshair.html',
          'templates/planeSensor-X.html',
          'templates/planeSensor-Y.html',
        ]
        var promises = []

        angular.forEach(templates, function(value) {
            promises.push($http.get(value, {cache: $templateCache}))
        })

        $q.all(promises).then(function (results) {
          // Normally this would be enough, but we want to make sure that the
          // cached value is only the template and not the whole response object
          // with status code, header, etc
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
