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
        var options = {useHitPnt: false}
        element.parent().prepend($(gui.domElement)
          .css('float', 'left')
          .css('position', 'absolute')
          .css('z-index', 1))
        // var useHitPnt = false

        // gui.remember(mediator)

        // dat.gui synchonizes the properties, so giving it access to activeLevel
        // directly leads to weird behaviour, see onFinishChange below
        var activeLevel    = gui.add({activeLevel:''}, 'activeLevel')
        var useHitPnt = gui.add(options, 'useHitPnt')
        // var blockInput     = gui.add(mediator, 'blockInput')
        // var renderDebug    = gui.add(mediator, 'renderDebug')
        // var disableDialogs = gui.add(mediator, 'disableDialogs')
        activeLevel.listen()
        useHitPnt.listen()

        // activeLevel.onFinishChange (value) ->
        //   if mediator.playWithSounds
        //     mediator.soundManager.stopAll config =
        //       themeSound: true
        //       backgroundSounds: true
        //       sounds: true

        //   mediator.homepageview.loadLevel value, ->

        //     mediator.homepageview.setup value

        scope.$watch(attrs.content, function(content) {
          element.html(content)
          element.children().addClass('fullpage')

          var drag = false
          var transformVector

          var start = (event) => {
            // event.hitPnt is quite accurate
            // runtime.getCenter(hitObject) seems to return sth in local space
            // which is quite useless unless maybe added to the global translation...
            console.debug('start( %o)', event)
            var runtime = document.querySelector('X3D').runtime
            var crosshairs = document.querySelector('[DEF=crosshairs]')
            var translationString = ''

            if (options.useHitPnt) {
              console.debug('useHitPnt = true');
              transformVector.x = event.hitPnt[0]
              transformVector.y = event.hitPnt[1]
              transformVector.z = event.hitPnt[2]
              translationString = event.hitPnt.join(' ')
              console.debug(transformVector)
            } else {
              console.debug('useHitPnt = false');
              transformVector = runtime.getCenter(event.hitObject)
              translationString = transformVector.x + ' ' + transformVector.y + ' ' + transformVector.z
              // event.hitPnt[0] += transform.x
              // event.hitPnt[1] += transform.y
              // event.hitPnt[2] += transform.z
              console.debug(transformVector)
            }


            crosshairs.setAttribute('translation', translationString)
            // debugger
            drag = true
          }

          var move = (event) => {
            var crosshairs = document.querySelector('[DEF=crosshairs]')
            var moveableTranslation = event.getAttribute('translation').split(' ')

            moveableTranslation[0] = parseFloat(moveableTranslation[0]) + transformVector.x
            moveableTranslation[1] = parseFloat(moveableTranslation[1]) + transformVector.y
            moveableTranslation[2] = parseFloat(moveableTranslation[2]) + transformVector.z

            console.debug('moveableTranslation: %o\ntransform: %o', moveableTranslation, transformVector.x)

            crosshairs.setAttribute('translation', moveableTranslation.join(' '))
            // start(event)
          }

          var stop = (event) => {
            console.debug('stop( %o)', event)
            drag = false
          }

          var inlines = element.find('inline').toArray()

          for (let inline of inlines) {
            var url = inline.getAttribute('url')
            inline.setAttribute('url', Constants.apiRoot +
              '/' + 'projects' +
              '/' + $routeParams.project +
              '/' + $routeParams.file.replace(/\/[^\/]*$/, '') +
              '/' + url)
          }

          $window.x3dom.reload()

          for (let inline of inlines) {
            inline.addEventListener('mousedown', start)
            inline.addEventListener('mouseup', stop)
            // debugger
            new $window.x3dom.Moveable(element.children().get(0),
              inline.parentElement, move, 0, 'all')
          }

        })
      }
    };
  });
