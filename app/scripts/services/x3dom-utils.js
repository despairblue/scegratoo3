'use strict';

angular.module('scegratooApp')
  .service('X3domUtils', function X3domutils($window, $routeParams, $templateCache, Constants) {
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

    var start = function(event) {
      // event.hitPnt is in global space so for this to work one would have to
      // add it to the scene and translate it inside the move function.
      // runtime.getCenter(hitObject) seems to return sth in local space
      // which works
      var runtime = document.querySelector('X3D').runtime
      var translationString = ''
      var inline = event.hitObject
      var next = event.hitObject

      // find top most inline
      while (next.nodeName.toLowerCase() !== 'scene') {
        next = next.parentNode

        if (next.nodeName.toLowerCase() === 'inline') {
          inline = next;
        }
      }

      if (options.useHitPnt) {
        vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2])
      } else {
        vecOffset = runtime.getCenter(inline)
      }

      inline.parentNode.appendChild(crosshairs)
      translationString = vecOffset.x + ' ' + vecOffset.y + ' ' + vecOffset.z
      crosshairs.setAttribute('translation', translationString)
    }

    var move = function(event) {
    }

    var stop = function() {
      if (crosshairs.parentNode) {
        crosshairs.parentNode.removeChild(crosshairs)
      }
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
