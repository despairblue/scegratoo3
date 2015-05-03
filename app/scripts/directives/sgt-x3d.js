'use strict'

const angular = window.angular
const $ = window.$

angular.module('scegratooApp')
  .directive('sgtX3d', function SgtX3d ($window, X3domUtils, $http, $q, $templateCache, React, TreeView, _) {
    return {
      restrict: 'AE',
      link: (scope, element, attrs) => {
        // load templates TODO: find better way than loading them manually
        var templates = [
          'templates/crosshair.html',
          'templates/planeSensor-X.html',
          'templates/planeSensor-Y.html'
        ]
        var promises = templates.map(value => $http.get(value, {cache: $templateCache}))

        $q.all(promises)
          .then(results => {
            // Normally this would be enough, but we want to make sure that the
            // cached value is only the template and not the whole response object
            // with status code, header, etc
            results.forEach(value => {
              $templateCache.put(value.config.url, value.data)
            })
          })
          .then(() => {
            const div = $(document.createElement('div'))
            const div2 = $(document.createElement('div'))

            // extract in directive
            var gui = new $window.dat.GUI({autoPlace: false})
            console.debug('Created ', gui)
            element.parent().prepend($(gui.domElement)
            .css('float', 'left')
            .css('position', 'absolute')
            .css('z-index', 1))
            var guiCoordinates = gui.addFolder('Coordinates')
            var guiSwitches = gui.addFolder('Switches')

            var options = X3domUtils.setUp(div)

            guiCoordinates.add(options, 'x').listen()
            guiCoordinates.add(options, 'y').listen()
            guiCoordinates.add(options, 'z').listen()
            guiSwitches.add(options, 'useHitPnt')
            guiSwitches.add(options, 'snapToGrid')

            element.append(div)
            element.append(div2)

            // styling
            element.addClass('fullpage')

            scope.$watch(attrs.content, content => {
              div.html(content)

              const tree = React.createElement(
                TreeView,
                {
                  data: div.find('scene').get(0)
                }
              )
              const rerender = _.throttle(React.render, 100)
              const x3dObserver = new window.MutationObserver(mutations => {
                mutations.forEach(mutation => {
                  if (mutation.type === 'attributes') {
                    if (['style', 'class'].some(name => name === mutation.attributeName)) {

                    } else if (['translation', 'rotation', 'diffuseColor'].some(name => name === mutation.attributeName)) {
                      rerender(tree, div2.get(0))
                    } else {
                      console.log(mutation.attributeName)
                    }
                  }
                })
              })

              x3dObserver.observe(div.get(0), {
                attributes: true,
                childList: true,
                subtree: true
              })

              React.render(tree, div2.get(0))
              options = X3domUtils.setUp(div)
            })
          })
      }
    }
  })
