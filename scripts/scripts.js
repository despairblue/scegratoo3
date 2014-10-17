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
