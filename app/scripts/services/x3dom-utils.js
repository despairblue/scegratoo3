'use strict';

angular.module('scegratooApp')
  .service('X3domUtils', function X3domutils($window, $routeParams, $templateCache, Constants, x3dQuery) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vecOffset = {
    	x: 0,
    	y: 0,
    	z: 0,
    }
    var options = {
		  useHitPnt: false,
      snapToGrid: false,
		  x: '',
		  y: '',
		  z: '',
    }
    var inlines
    var crosshairs
    var translationGizmoX
    var translationGizmoY
    var colorCache

    var start = function(event) {
      // event.hitPnt is in global space so for this to work one would have to
      // add it to the scene and translate it inside the move function.
      // runtime.getCenter(hitObject) seems to return sth in local space
      // which works
      var translationString = ''
      var inline = x3dQuery(event.hitObject).lastParent('inline')

      if (options.useHitPnt) {
        vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2])
      } else {
        // `runtime.getCenter` does not work with inlines, only with X3DShapeNode and X3DGeometryNode
        // and even for a shape it returns always the same coordinates, so what does it actually return?
        // TODO: test this w/o inlines.
        // vecOffset = runtime.getCenter(inline)
        console.debug(document.getElementsByTagName('shape')[1]._x3domNode.getCenter())

        // on the other hand this is always null
        vecOffset = inline.get()._x3domNode.getVolume().center
      }

      inline.get().parentNode.appendChild(crosshairs)
      translationString = vecOffset.x + ' ' + vecOffset.y + ' ' + vecOffset.z
      crosshairs.setAttribute('translation', translationString)

      colorCache = inline.color()
      inline.color('yellow')
    }

    var move = function(event) {
    }

    var stop = function(event) {
      var inline = x3dQuery(event.hitObject)

      // remove the crosshair
      if (crosshairs.parentNode) {
        crosshairs.parentNode.removeChild(crosshairs)
      }

      inline.color(colorCache)
    }

    var processTranslationGizmoEventX = function(event) {
        var sensorToWorldMatrix, translationValue;

        if (event.fieldName === 'translation_changed') {
          //convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
          sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute('axisRotation'));

          translationValue = sensorToWorldMatrix.multMatrixVec(event.value);

          if (options.snapToGrid) {
            translationValue.x = Math.floor(translationValue.x)
          }

          angular.forEach(inlines, function(inline){
            var oldTranslationValue = inline.parentNode.getFieldValue('translation')
            oldTranslationValue.x = translationValue.x
            inline.parentNode.setFieldValue('translation', oldTranslationValue)
          });
        }
    }

    var processTranslationGizmoEventY = function(event) {
        var sensorToWorldMatrix, translationValue;

        if (event.fieldName === 'translation_changed') {
          //convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
          sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute('axisRotation'));

          translationValue = sensorToWorldMatrix.multMatrixVec(event.value);

          if (options.snapToGrid) {
            translationValue.y = Math.floor(translationValue.y)
          }

          angular.forEach(inlines, function(inline){
            var oldTranslationValue = inline.parentNode.getFieldValue('translation')
            oldTranslationValue.y = translationValue.y
            inline.parentNode.setFieldValue('translation', oldTranslationValue)
          });
        }
    }

    var setUp = function(x3dElement) {
      var loadCount = 0
      console.debug('Set up scene.')

      // fix x3dom swallowing exceptions in callback
      $window.x3dom.debug.logException = function(e) {
        console.error(e.stack)
      }

      crosshairs         = angular.element($templateCache.get('templates/crosshair.html')).get(0);
      translationGizmoX  = angular.element($templateCache.get('templates/planeSensor-X.html')).get(0);
      translationGizmoY  = angular.element($templateCache.get('templates/planeSensor-Y.html')).get(0);

      inlines   = x3dElement.find('inline')

      angular.forEach(inlines, function(inline){
        var url = inline.getAttribute('url')
        inline.setAttribute('url', Constants.apiRoot +
          '/' + 'projects' +
          '/' + $routeParams.project +
          '/' + $routeParams.file.replace(/\/[^\/]*$/, '') +
          '/' + url)
      });

      $window.x3dom.reload()

      angular.forEach(x3dElement.find('scene'), function(scene){
        scene.appendChild(translationGizmoX)
        scene.appendChild(translationGizmoY)
      })

      angular.forEach(inlines, function(inline) {
        inline.addEventListener('mousedown', start)
        inline.addEventListener('mouseup', stop)
        inline.addEventListener('load', function () {
          loadCount += 1
          if (loadCount === inlines.length && x3dElement.children().get(0) && x3dElement.children().get(0).runtime) {
            window.x3dNode = x3dElement.children().get(0)
            x3dElement.children().get(0).runtime.showAll()
          }
        })
        new $window.x3dom.Moveable(x3dElement.children().get(0),
          inline.parentElement, move, 0, 'all')
      });

      translationGizmoX.children[0].addEventListener('onoutputchange', processTranslationGizmoEventX)
      translationGizmoY.children[0].addEventListener('onoutputchange', processTranslationGizmoEventY)

      return options
    }

    return {
      setUp: setUp
    }
  });
