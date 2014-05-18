'use strict';

angular.module('scegratooApp')
  .directive('sgtX3d', function ($window, $routeParams, Constants) {
    return {
      // template: '',
      restrict: 'AE',
      // scope: {
      //   content: '='
      // },
      link: function postLink(scope, element, attrs) {
        console.debug('function postLink(%o, %o, %o)', scope, element, attrs)

        // extract in directive
        var gui = new $window.dat.GUI({autoPlace: false})
        console.debug('Created ', gui);
        element.parent().prepend($(gui.domElement)
          .css('float', 'left')
          .css('position', 'absolute')
          .css('z-index', 1))
        var options = {
          useHitPnt: false,
          x: '',
          y: '',
          z: '',
        }
        var guiCoordinates = gui.addFolder('Coordinates')
        var guiSwitches    = gui.addFolder('Switches')
        guiCoordinates.add(options, 'x').listen()
        guiCoordinates.add(options, 'y').listen()
        guiCoordinates.add(options, 'z').listen()
        guiSwitches.add(options, 'useHitPnt')

        scope.$watch(attrs.content, function(content) {
          element.html(content)
          element.children().addClass('fullpage')

          var drag = false
          var vecOffset

          var start = function(event) {
            // event.hitPnt is quite accurate
            // runtime.getCenter(hitObject) seems to return sth in local space
            // which is quite useless unless maybe added to the global translation...
            console.debug('start( %o)', event)
            var runtime = document.querySelector('X3D').runtime
            var crosshairs = document.querySelector('[DEF=crosshairs]')
            var translationString = ''

            console.debug('hitPnt:', new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2]));
            console.debug('center of HitObject:', runtime.getCenter(event.hitObject));

            if (options.useHitPnt) {
              vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2])
            } else {
              vecOffset = runtime.getCenter(event.hitObject)
            }

            translationString = vecOffset.x + ' ' + vecOffset.y + ' ' + vecOffset.z
            crosshairs.setAttribute('translation', translationString)
            drag = true
          }

          var move = function(event) {
            var crosshairs = document.querySelector('[DEF=crosshairs]')
            var moveableTranslation = event.getAttribute('translation').split(' ')

            moveableTranslation[0] = parseFloat(moveableTranslation[0]) + vecOffset.x
            moveableTranslation[1] = parseFloat(moveableTranslation[1]) + vecOffset.y
            moveableTranslation[2] = parseFloat(moveableTranslation[2]) + vecOffset.z

            options.x = moveableTranslation[0]
            options.y = moveableTranslation[1]
            options.z = moveableTranslation[2]

            console.debug('moveableTranslation: %o\ntransform: %o', moveableTranslation, vecOffset.x)

            crosshairs.setAttribute('translation', moveableTranslation.join(' '))
          }

          var stop = function(event) {
            console.debug('stop( %o)', event)
            drag = false
          }

          var inlines = element.find('inline').toArray()

          angular.forEach(inlines, function(inline){
            var url = inline.getAttribute('url')
            inline.setAttribute('url', Constants.apiRoot +
              '/' + 'projects' +
              '/' + $routeParams.project +
              '/' + $routeParams.file.replace(/\/[^\/]*$/, '') +
              '/' + url)
          });

          $window.x3dom.reload()

          angular.forEach(inlines, function(inline){
            inline.addEventListener('mousedown', start)
            inline.addEventListener('mouseup', stop)
            // debugger
            new $window.x3dom.Moveable(element.children().get(0),
              inline.parentElement, move, 0, 'all')
          });

        })
      }
    };
  });
