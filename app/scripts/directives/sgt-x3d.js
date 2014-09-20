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
        //
        // $http.get expects a leading slash, BUT
        // the keys in the $templateCache should always omit the leading slash
        // to work with nghtml2js for the unit tests.
        // That explains all the regexes here.
        var templates = [
          '/templates/crosshair.html',
          '/templates/planeSensor-X.html',
          '/templates/planeSensor-Y.html',
        ]
        var promises = []

        angular.forEach(templates, function(value) {
          if ( !$templateCache.get(value.replace(/^\//, '')) ) {
            promises.push($http.get(value))
          }
        })
        $q.all(promises).then(function (results) {
          angular.forEach(results, function(value) {
            // remove the starting slash again
            $templateCache.put(value.config.url.replace(/^\//, ''), value.data);
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
