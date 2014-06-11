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
		  x: '',
		  y: '',
		  z: '',
    }
    var inlines
    var crosshairs       = angular.element($templateCache.get('crosshairs.html')).get(0)
    var translationGizmoX = angular.element($templateCache.get('planeSensor-X.html')).get(0);

    var start = function(event) {
      // event.hitPnt is in global space so for this to work one would have to
      // add it to the scene and translate it inside the move function.
      // runtime.getCenter(hitObject) seems to return sth in local space
      // which works
      var runtime = document.querySelector('X3D').runtime
      // var crosshairs = document.querySelector('[DEF=crosshairs]')
      var translationString = ''

      console.debug('hitPnt:', new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2]));
      console.debug('center of HitObject:', runtime.getCenter(event.hitObject));

      if (options.useHitPnt) {
        vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2])
      } else {
        vecOffset = runtime.getCenter(event.hitObject)
      }

      event.hitObject.parentNode.parentNode.appendChild(crosshairs)
      translationString = vecOffset.x + ' ' + vecOffset.y + ' ' + vecOffset.z
      crosshairs.setAttribute('translation', translationString)
    }

    var move = function(event) {
      var moveableTranslation = event.getAttribute('translation').split(' ')

      moveableTranslation[0] = parseFloat(moveableTranslation[0]) + vecOffset.x
      moveableTranslation[1] = parseFloat(moveableTranslation[1]) + vecOffset.y
      moveableTranslation[2] = parseFloat(moveableTranslation[2]) + vecOffset.z

      options.x = moveableTranslation[0]
      options.y = moveableTranslation[1]
      options.z = moveableTranslation[2]

      // console.debug('moveableTranslation: %o\ntransform: %o', moveableTranslation, vecOffset.x)

      // crosshairs.setAttribute('translation', moveableTranslation.join(' '))
    }

    var stop = function(event) {
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
    var setUp = function(x3dElement) {
    	var inlines = x3dElement.find('inline')

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
	      new $window.x3dom.Moveable(x3dElement.children().get(0),
	        inline.parentElement, move, 0, 'all')
	    });

	    return options
      angular.forEach(x3dElement.find('scene'), function(scene){
        scene.appendChild(translationGizmoX)
      })

      translationGizmoX.children[0].addEventListener('onoutputchange', processTranslationGizmoEventX)
    }

    return {
    	setUp: setUp
    }
  });
