'use strict';

angular.module('scegratooApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/projects'
      })
      .when('/projects', {
        templateUrl: 'views/projects.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:project', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/projects/:project/x3d/:file*', {
        templateUrl: 'views/projects/:project/x3d/:file.html',
        controller: 'ProjectsProjectX3dFileCtrl'
      })
      // .otherwise({
      //   redirectTo: '/projects'
      // });
  });

'use strict';

angular.module('scegratooApp')
// angular.module('scegratooApp')
  .controller('MainCtrl', function ($scope, catalog) {
    $scope.catalog = catalog
  });

'use strict';

angular.module('scegratooApp')
.value('catalog', [
  {
    id: 1,
    name: 'Batarang',
    img: 'images/yeoman.png',
    price: 80
  },
  {
    id: 2,
    name: 'Utility Belt',
    img: 'images/yeoman.png',
    price: 120
  }
])

'use strict';

angular.module('scegratooApp')
.service('Project', function Project($resource, $http, Constants) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var route = Constants.apiRoot + '/projects/:project.:format'
  var resource = $resource(route, {format: 'json'})
  return {
    get: function(params, fn) {
      if (params.file) {
        var url = [
          Constants.apiRoot,
          'projects',
          encodeURI(params.project),
          encodeURI(params.file)
        ].join('/')
        var res = $resource(url, {}, {
          get: {method: 'GET', transformResponse: function(data) {
            return {data: data}
          }}
        })
        return res.get(fn)
      } else {
        return resource.get(params, fn)
      }
    },
    query: resource.query
    // getFile: function(params) {
    //   var url = [
    //     apiRoot,
    //     'projects',
    //     encodeURI(params.project),
    //     encodeURI(params.file)
    //   ].join('/')
    //   return $http.get(url)
    // }
  }
})

'use strict';

angular.module('scegratooApp')
.controller('ProjectsCtrl', function ($scope, Project) {
  $scope.projects = Project.query()
})

'use strict';

angular.module('scegratooApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, Project) {
    $scope.project = Project.get({project: $routeParams.project}, function(project) {
      // save projectId to url concatenation in the view
      $scope.projectName = $routeParams.project

      // convert each file into an object
      project.files.forEach(function(file, index, list) {
        list[index] = {path: file, view: ''}
      })

      // find file extension to decide what view to use
      project.files.forEach(function(file) {
        var fileExtension = file.path.match(/.[^.]*$/)[0]

        switch (fileExtension) {
          case '.js':
            file.view = 'source'
            break
          case '.x3d':
            file.view = 'x3d'
            break
          case '.sdf':
            file.view = 'ssiml'
        }
      })
    })
  });

'use strict';

angular.module('scegratooApp').directive('sgtNavigationBar', function() {
  return {
    templateUrl: 'views/directives/sgt-navigation-bar.html',
    restrict: 'AE',
    scope: true,
    link: function postLink(scope, element) {
      scope.items = [{
        text: 'X3D',
        href: 'x3d'
      }, {
        text: 'Source',
        href: 'source'
      }, {
        text: 'Tree',
        href: 'tree'
      }, {
        text: 'Ssiml',
        href: 'ssiml'
      }]

      element.addClass('navbar navbar-default navbar-fixed-top')
      element.attr('role', 'navigation')
    }
  };
});

'use strict';

angular.module('scegratooApp')
  .controller('ProjectsProjectX3dFileCtrl', function ($scope, $routeParams, Project) {
    Project.get({project: $routeParams.project, file: $routeParams.file}, function(file) {
      $scope.x3d = file.data
    })

    // x3d.get().then(function(element) {
    //   element.querySelector('inline').forEach(function(inline) {
    //     $scope.transformations.push(encapsulate(inline))
    //     inline.addEventListener('click', function(i) {
    //       $scope.currentElement = i
    //     })
    //   })
    // })

    // function encapsulate(inline) {
    //   console.log(inline)
    // }
  });

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

'use strict';

angular.module('scegratooApp')
.value('Constants', {
  apiRoot: 'api/v1'
});

'use strict';

var bootstrap = function() {
	angular.element(document).ready(function() {
	  angular.bootstrap(document, ['scegratooApp']);
	})
}

if (window.__karma__) {
	bootstrap()
} else {
	traceur.options.experimental = true
	new traceur.WebPageTranscoder(document.location.href).run(function() {
		bootstrap()
	});
}

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
    var selectionSphere

    var start = function(event) {
      // event.hitPnt is in global space so for this to work one would have to
      // add it to the scene and translate it inside the move function.
      // runtime.getCenter(hitObject) seems to return sth in local space
      // which works
      var translationString = ''
      var inline = angular.element(event.hitObject).lastParent('inline')
      var bbox = inline.runtime().getBBox()

      selectionSphere = angular.element(
        '<Transform scale="' + bbox.max + '">' +
        '<Shape>' +
        '<Appearance>' +
        '<Material diffuseColor="1 1 1" transparency="0.5"/>' +
        '</Appearance>' +
        '<Sphere />' +
        '</Shape>' +
        '</Transform>'
      )


      if (options.useHitPnt) {
        vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2])
      } else {
        // `runtime.getCenter` does not work with inlines, only with X3DShapeNode and X3DGeometryNode
        // and even for a shape it returns always the same coordinates, so what does it actually return?
        // TODO: test this w/o inlines.
        // vecOffset = runtime.getCenter(inline)
        console.debug(document.getElementsByTagName('shape')[1]._x3domNode.getCenter())

        // on the other hand this is always null
        vecOffset = inline.get(0)._x3domNode.getVolume().center
      }

      // add crosshairs
      inline.get(0).parentNode.appendChild(crosshairs)
      translationString = vecOffset.x + ' ' + vecOffset.y + ' ' + vecOffset.z
      crosshairs.setAttribute('translation', translationString)

      colorCache = inline.color()
      inline.color('yellow').before(selectionSphere)
    }

    var move = function(event) {
    }

    var stop = function(event) {
      var inline = angular.element(event.hitObject).lastParent('inline')

      // remove the crosshair
      if (crosshairs.parentNode) {
        crosshairs.parentNode.removeChild(crosshairs)
      }

      selectionSphere.remove()
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

'use strict';

angular.module('scegratooApp')
  .service('X3dWidgets', function X3dWidgets() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var createCrosshair = function(scale) {

    }

    // probably add x and y
    var createPlane = function(scale, withWidgets) {

    }

    return {
      createCrosshair: createCrosshair,
      createPlane: createPlane
    }
  });

'use strict';

angular.module('scegratooApp')
  .service('x3dQuery', function x3dQuery() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    angular.element.fn.extend({
      color: function color(clr) {
        var node = this.get(0)

        if (clr) {
          if (angular.isArray(clr)) {
            clr = angular.copy(clr)

            angular.forEach(node.getElementsByTagName('Material'), function(material) {
              material.diffuseColor = clr.shift()
            })
            angular.forEach(node.getElementsByTagName('material'), function(material) {
              material.diffuseColor = clr.shift()
            })
          } else {
            angular.forEach(node.getElementsByTagName('Material'), function(material) {
              material.diffuseColor = clr
            })
            angular.forEach(node.getElementsByTagName('material'), function(material) {
              material.diffuseColor = clr
            })
          }

          return this
        } else {
          var colors = []

          angular.forEach(node.getElementsByTagName('Material'), function(material) {
            colors.push(material.diffuseColor)
          })
          angular.forEach(node.getElementsByTagName('material'), function(material) {
            colors.push(material.diffuseColor)
          })

          return colors
        }
      },

      runtime: function runtime() {
        var _this = this
        var boundRuntime = {}
        var runtime = this.firstParent('x3d').get(0).runtime

        angular.forEach(Object.getPrototypeOf(runtime), function(method, name) {
          boundRuntime[name] = angular.bind(runtime, method, _this.get(0))
        })

        return boundRuntime
      },

      firstParent: function firstParent(parentName) {
        var _firstParent
        var next = this.get(0)

        while (next.nodeName.toLowerCase() !== '#document') {
          next = next.parentNode

          if (next.nodeName.toLowerCase() === parentName) {
            _firstParent = next
            break
          }
        }

        if (_firstParent) {
          return angular.element(_firstParent)
        } else {
          return angular.element()
        }
      },

      lastParent: function lastParent(parentName) {
        var _lastParent
        var next = this.get(0)

        while (next.nodeName.toLowerCase() !== '#document') {
          next = next.parentNode

          if (next.nodeName.toLowerCase() === parentName) {
            _lastParent = next
          }
        }

        if (_lastParent) {
          return angular.element(_lastParent)
        } else {
          return angular.element()
        }
      }
    })
  })
