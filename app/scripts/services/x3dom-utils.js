'use strict';

angular.module('scegratooApp')
  .service('X3domUtils', function X3domutils($window, $routeParams, Constants) {
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
    var crosshairsTemplate = '<Transform DEF="crosshairs"> <Group> <Shape> <IndexedLineSet coordIndex="0 1 -1 2 3 -1 4 5 -1"colorIndex="0 0 -1 1 1 -1 2 2 -1"> <Coordinate point="-1  0  0 1  0  0 0 -1  0 0  1  0 0  0 -1 0  0  1"> </Coordinate> <Color color="1 0 0 0 1 0 0 0 1"> </Color> </IndexedLineSet> </Shape> <Transform rotation="0 0 -1 1.57" translation="1 0 0"> <Shape> <Appearance> <Material diffuseColor="1 0 0"> </Material> </Appearance> <Cone height="0.1"bottomRadius="0.05"> </Cone> </Shape> </Transform> <Transform translation="0 1 0"> <Shape> <Appearance> <Material diffuseColor="0 1 0"> </Material> </Appearance> <Cone height="0.1"bottomRadius="0.05"> </Cone> </Shape> </Transform> <Transform rotation="1 0 0 1.57" translation="0 0 1"> <Shape> <Appearance> <Material diffuseColor="0 0 1"> </Material> </Appearance> <Cone height="0.1"bottomRadius="0.05"> </Cone> </Shape> </Transform> </Group> </Transform> '
    var crosshairs = angular.element(crosshairsTemplate).get(0)

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
    }

    return {
    	setUp: setUp
    }
  });