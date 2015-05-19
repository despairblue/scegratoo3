"use strict";

angular.module("scegratooApp", ["ngCookies", "ngResource", "ngSanitize", "ngRoute", "ui.bootstrap"]).config(function ($routeProvider) {
  $routeProvider.when("/", {
    redirectTo: "/projects"
  }).when("/projects", {
    templateUrl: "views/projects.html",
    controller: "ProjectsCtrl"
  }).when("/projects/:project", {
    templateUrl: "views/project.html",
    controller: "ProjectCtrl"
  }).when("/projects/:project/x3d/:file*", {
    templateUrl: "views/projects/:project/x3d/:file.html",
    controller: "ProjectsProjectX3dFileCtrl"
  });
});
// .otherwise({
//   redirectTo: '/projects'
// });
"use strict";

angular.module("scegratooApp")
// angular.module('scegratooApp')
.controller("MainCtrl", function ($scope, catalog) {
  $scope.catalog = catalog;
});
"use strict";

angular.module("scegratooApp").controller("ProjectCtrl", function ($scope, $routeParams, Project) {
  $scope.project = Project.get({ project: $routeParams.project }, function (project) {
    // save projectId to url concatenation in the view
    $scope.projectName = $routeParams.project;

    // convert each file into an object
    project.files.forEach(function (file, index, list) {
      list[index] = { path: file, view: "" };
    });

    // find file extension to decide what view to use
    project.files.forEach(function (file) {
      var fileExtension = file.path.match(/.[^.]*$/)[0];

      switch (fileExtension) {
        case ".js":
          file.view = "source";
          break;
        case ".x3d":
          file.view = "x3d";
          break;
        case ".sdf":
          file.view = "ssiml";
      }
    });
  });
});
"use strict";

angular.module("scegratooApp").controller("ProjectsCtrl", function ($scope, Project) {
  $scope.projects = Project.query();
});
"use strict";

angular.module("scegratooApp").directive("sgtNavigationBar", function () {
  return {
    templateUrl: "views/directives/sgt-navigation-bar.html",
    restrict: "AE",
    scope: true,
    link: function postLink(scope, element) {
      scope.items = [{
        text: "X3D",
        href: "x3d"
      }, {
        text: "Source",
        href: "source"
      }, {
        text: "Tree",
        href: "tree"
      }, {
        text: "Ssiml",
        href: "ssiml"
      }];

      element.addClass("navbar navbar-default navbar-fixed-top");
      element.attr("role", "navigation");
    }
  };
});
"use strict";

var angular = window.angular;
var $ = window.$;

angular.module("scegratooApp").directive("sgtX3d", function SgtX3d($window, X3domUtils, $http, $q, $templateCache, React, TreeView, _) {
  return {
    restrict: "AE",
    link: function (scope, element, attrs) {
      // load templates TODO: find better way than loading them manually
      var templates = ["templates/crosshair.html", "templates/planeSensor-X.html", "templates/planeSensor-Y.html"];
      var promises = templates.map(function (value) {
        return $http.get(value, { cache: $templateCache });
      });

      $q.all(promises).then(function (results) {
        // Normally this would be enough, but we want to make sure that the
        // cached value is only the template and not the whole response object
        // with status code, header, etc
        results.forEach(function (value) {
          $templateCache.put(value.config.url, value.data);
        });
      }).then(function () {
        var div = $(document.createElement("div"));
        var div2 = $(document.createElement("div"));

        // extract in directive
        var gui = new $window.dat.GUI({ autoPlace: false });
        console.debug("Created ", gui);
        element.parent().prepend($(gui.domElement).css("float", "left").css("position", "absolute").css("z-index", 1));
        var guiCoordinates = gui.addFolder("Coordinates");
        var guiSwitches = gui.addFolder("Switches");

        var options = X3domUtils.setUp(div);

        guiCoordinates.add(options, "x").listen();
        guiCoordinates.add(options, "y").listen();
        guiCoordinates.add(options, "z").listen();
        guiSwitches.add(options, "useHitPnt");
        guiSwitches.add(options, "snapToGrid");

        element.append(div);
        element.append(div2);

        // styling
        element.addClass("fullpage");

        scope.$watch(attrs.content, function (content) {
          div.html(content);

          var tree = React.createElement(TreeView, {
            data: div.find("x3d").get(0)
          });
          var rerender = _.throttle(React.render, 100);
          var x3dObserver = new window.MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
              if (mutation.type === "attributes") {
                if (["style", "class", "width", "height"].some(function (name) {
                  return name === mutation.attributeName;
                })) {} else if (["translation", "rotation", "diffuseColor", "render"].some(function (name) {
                  return name === mutation.attributeName;
                })) {
                  rerender(tree, div2.get(0));
                } else {
                  console.log(mutation.attributeName);
                }
              }
            });
          });

          x3dObserver.observe(div.get(0), {
            attributes: true,
            childList: true,
            subtree: true
          });

          React.render(tree, div2.get(0));
          options = X3domUtils.setUp(div);
        });
      });
    }
  };
});
"use strict";

var angular = window.angular;

angular.module("scegratooApp").directive("treeview", function (React, TreeView) {
  return {
    // template: '',
    restrict: "AE",
    scope: {
      data: "=",
      id: "@"
    },
    link: function postLink(scope, element) {
      scope.$watch("data", function () {
        React.render(React.createElement(TreeView, {
          data: scope.data
        }), element[0]);
      });
    }
  };
});
"use strict";

window.angular.module("scegratooApp").value("Constants", {
  apiRoot: "api/v1"
});
"use strict";

window.angular.module("scegratooApp").value("_", window._);
"use strict";

window.angular.module("scegratooApp").service("Project", function Project($resource, $http, Constants) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var route = Constants.apiRoot + "/projects/:project.:format";
  var resource = $resource(route, { format: "json" });
  return {
    get: function (params, fn) {
      if (params.file) {
        var url = [Constants.apiRoot, "projects", encodeURI(params.project), encodeURI(params.file)].join("/");
        var res = $resource(url, {}, {
          get: {
            method: "GET",
            transformResponse: function (data) {
              return { data: data };
            }
          }
        });
        return res.get(fn);
      } else {
        return resource.get(params, fn);
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
  };
});
"use strict";

/**
 * @ngdoc service
 * @name scegratooApp.R
 * @description
 * # R
 * Value in the scegratooApp.
 */
window.angular.module("scegratooApp").value("R", window.R);
"use strict";

window.angular.module("scegratooApp").value("React", window.React);
"use strict";

window.angular.module("scegratooApp").service("TreeNode", function Project(React, R, TreeNodeAttribute) {
  var __ = R.__;
  var always = R.always;
  var complement = R.complement;
  var contains = R.contains;
  var eq = R.eq;
  var filter = R.filter;
  var ifElse = R.ifElse;
  var map = R.map;
  var pipe = R.pipe;
  var prop = R.prop;
  var toLower = R.toLower;

  var isInline = pipe(prop("nodeName"), toLower, eq("inline"));
  var isGUI = pipe(prop("className"), toLower, eq("gui"));
  var unlessInline = ifElse(isInline, always(undefined));

  var TreeNode = React.createClass({
    displayName: "TreeNode",
    propTypes: {
      data: React.PropTypes.object.isRequired,
      runtime: React.PropTypes.object.isRequired
    },
    clicked: function clicked(event) {
      this.props.runtime.showObject(this.props.data, "xAxis");
    },
    render: function render() {
      var node = this.props.data;
      var runtime = this.props.runtime;
      var children = filter(complement(isGUI), node.children);

      return React.createElement(
        "li",
        { ref: "node" },
        React.createElement(
          "a",
          { "data-id": node.id, onClick: this.clicked },
          "\u0003",
          "<" + node.nodeName + ">",
          React.createElement("br", null)
        ),
        map(function (a) {
          return [React.createElement(TreeNodeAttribute, { attribute: a, owner: node }), React.createElement("br", null)];
        }, filter(pipe(prop("name"), toLower, contains(__, ["translation", "rotation", "diffusecolor", "def", "render", "class"])), node.attributes)),
        unlessInline(function (node) {
          return React.createElement(
            "ul",
            null,
            map(function (child) {
              return React.createElement(TreeNode, {
                data: child,
                runtime: runtime
              });
            })(children)
          );
        })(node)
      );
    }
  });

  return TreeNode;
});
"use strict";

window.angular.module("scegratooApp").service("TreeNodeAttribute", function (React, R, TreeNodeAttributeTextbox) {
  var contains = R.contains;
  var flatten = R.flatten;
  var map = R.map;
  var pipe = R.pipe;
  var split = R.split;

  var splitVector = pipe(split(" "), map(split(",")), flatten);

  return React.createClass({
    displayName: "TreeNodeAttribute",
    propTypes: {
      owner: React.PropTypes.object.isRequired,
      attribute: React.PropTypes.object.isRequired
    },
    changeHandler: function changeHandler(event) {
      if (event.currentTarget.checked) {
        this.props.owner.render = true;
      } else {
        this.props.owner.render = false;
      }
    },
    render: function render() {
      var _this = this;

      var attribute = this.props.attribute;

      if (attribute.name === "render") {
        var checked = attribute.value === "true";
        return React.createElement(
          "span",
          null,
          attribute.name,
          ": ",
          React.createElement("input", { type: "checkbox", checked: checked, onChange: this.changeHandler })
        );
      } else if (contains(attribute.name, ["translation", "rotation"])) {
        return React.createElement(
          "span",
          null,
          attribute.name,
          ": ",
          splitVector(attribute.value).map(function (coordinate, index) {
            return React.createElement(TreeNodeAttributeTextbox, {
              attributeName: attribute.name,
              index: index,
              owner: _this.props.owner,
              style: { width: "100px" }
            });
          })
        );
      } else {
        return React.createElement(
          "span",
          null,
          attribute.name,
          ": ",
          attribute.value
        );
      }
    }
  });
});
"use strict";

window.angular.module("scegratooApp").service("TreeNodeAttributeTextbox", function (React, R) {
  var flatten = R.flatten;
  var map = R.map;
  var mergeAll = R.mergeAll;
  var pipe = R.pipe;
  var split = R.split;

  var splitVector = pipe(split(" "), map(split(",")), flatten);

  return React.createClass({
    displayName: "TreeNodeAttributeTextbox",
    propTypes: {
      attributeName: React.PropTypes.string.isRequired,
      index: React.PropTypes.number.isRequired,
      owner: React.PropTypes.object.isRequired,
      style: React.PropTypes.object
    },
    handleChangeEvent: function handleChangeEvent(event) {
      var _props = this.props;
      var attributeName = _props.attributeName;
      var index = _props.index;
      var owner = _props.owner;

      var oldVector = splitVector(owner.getAttribute(attributeName));

      oldVector[index] = event.currentTarget.value;
      owner.setAttribute(attributeName, oldVector.join(" "));

      this.forceUpdate();
    },
    render: function render() {
      var _this = this;

      var _props = this.props;
      var owner = _props.owner;
      var index = _props.index;
      var attributeName = _props.attributeName;

      return React.createElement("input", {
        type: "number",
        step: "0.1",
        value: splitVector(owner.getAttribute(attributeName))[index],
        onChange: this.handleChangeEvent,
        onMouseEnter: function () {
          return _this.getDOMNode().focus();
        },
        style: mergeAll([{ width: "50px" }, this.props.style])
      });
    }
  });
});
"use strict";

window.angular.module("scegratooApp").service("TreeView", function Project(React, TreeNode) {
  return React.createClass({
    displayName: "TreeView",
    propTypes: {
      data: React.PropTypes.object.isRequired
    },
    getDefaultProps: function () {
      return {
        data: {},
        runtime: {}
      };
    },
    render: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "ul",
          null,
          React.createElement(TreeNode, {
            data: this.props.data.querySelector("scene"),
            runtime: this.props.data.runtime
          })
        )
      );
    }
  });
});
"use strict";

var angular = window.angular;

angular.module("scegratooApp").service("x3dQuery", function x3dQuery() {
  // AngularJS will instantiate a singleton by calling "new" on this function

  angular.element.fn.extend({
    color: function color(clr) {
      var node = this.get(0);

      if (clr) {
        if (angular.isArray(clr)) {
          clr = angular.copy(clr);

          angular.forEach(node.getElementsByTagName("Material"), function (material) {
            material.diffuseColor = clr.shift();
          });
          angular.forEach(node.getElementsByTagName("material"), function (material) {
            material.diffuseColor = clr.shift();
          });
        } else {
          angular.forEach(node.getElementsByTagName("Material"), function (material) {
            material.diffuseColor = clr;
          });
          angular.forEach(node.getElementsByTagName("material"), function (material) {
            material.diffuseColor = clr;
          });
        }

        return this;
      } else {
        var colors = [];

        angular.forEach(node.getElementsByTagName("Material"), function (material) {
          colors.push(material.diffuseColor);
        });
        angular.forEach(node.getElementsByTagName("material"), function (material) {
          colors.push(material.diffuseColor);
        });

        return colors;
      }
    },

    runtime: function runtime() {
      var _this = this;
      var boundRuntime = {};
      var runtime = this.firstParent("x3d").get(0).runtime;

      angular.forEach(Object.getPrototypeOf(runtime), function (method, name) {
        boundRuntime[name] = angular.bind(runtime, method, _this.get(0));
      });

      return boundRuntime;
    },

    firstParent: function firstParent(parentName) {
      var _firstParent;
      var next = this.get(0);

      while (next.nodeName.toLowerCase() !== "#document") {
        next = next.parentNode;

        if (next.nodeName.toLowerCase() === parentName) {
          _firstParent = next;
          break;
        }
      }

      if (_firstParent) {
        return angular.element(_firstParent);
      } else {
        return angular.element();
      }
    },

    lastParent: function lastParent(parentName) {
      var _lastParent;
      var next = this.get(0);

      while (next.nodeName.toLowerCase() !== "#document") {
        next = next.parentNode;

        if (next.nodeName.toLowerCase() === parentName) {
          _lastParent = next;
        }
      }

      if (_lastParent) {
        return angular.element(_lastParent);
      } else {
        return angular.element();
      }
    }
  });
});
"use strict";

angular.module("scegratooApp").service("X3dWidgets", function X3dWidgets() {
  // AngularJS will instantiate a singleton by calling "new" on this function

  var createCrosshair = function createCrosshair(scale) {};

  // probably add x and y
  var createPlane = function createPlane(scale, withWidgets) {};

  return {
    createCrosshair: createCrosshair,
    createPlane: createPlane
  };
});
"use strict";

var angular = window.angular;

angular.module("scegratooApp").service("X3domUtils", function X3domutils($window, $routeParams, $templateCache, x3dQuery, Constants) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var vecOffset = {
    x: 0,
    y: 0,
    z: 0
  };
  var options = {
    useHitPnt: false,
    snapToGrid: false,
    x: "",
    y: "",
    z: ""
  };
  var inlines = undefined;
  var crosshairs = undefined;
  var translationGizmoX = undefined;
  var translationGizmoY = undefined;
  var colorCache = undefined;
  var selectionSphere = undefined;

  var start = function start(event) {
    // event.hitPnt is in global space so for this to work one would have to
    // add it to the scene and translate it inside the move function.
    // runtime.getCenter(hitObject) seems to return sth in local space
    // which works
    var translationString = "";
    var inline = angular.element(event.hitObject).lastParent("inline");
    var bbox = inline.runtime().getBBox();

    selectionSphere = angular.element("\n        <Transform scale=\"" + bbox.max + "\" class='gui'>\n          <Shape>\n            <Appearance>\n              <Material diffuseColor=\"1 1 1\" transparency=\"0.5\"/>\n            </Appearance>\n            <Sphere />\n          </Shape>\n        </Transform>\n      ");

    if (options.useHitPnt) {
      vecOffset = new $window.x3dom.fields.SFVec3f(event.hitPnt[0], event.hitPnt[1], event.hitPnt[2]);
    } else {
      // `runtime.getCenter` does not work with inlines, only with X3DShapeNode and X3DGeometryNode
      // and even for a shape it returns always the same coordinates, so what does it actually return?
      // TODO: test this w/o inlines.
      // vecOffset = runtime.getCenter(inline)
      console.debug(document.getElementsByTagName("shape")[1]._x3domNode.getCenter());

      // on the other hand this is always null
      vecOffset = inline.get(0)._x3domNode.getVolume().center;
    }

    // add crosshairs
    inline.get(0).parentNode.appendChild(crosshairs);
    translationString = vecOffset.x + " " + vecOffset.y + " " + vecOffset.z;
    crosshairs.setAttribute("translation", translationString);

    colorCache = inline.color();
    inline.color("yellow").before(selectionSphere);
  };

  var move = function move() {};

  var stop = function stop(event) {
    var inline = angular.element(event.hitObject).lastParent("inline");

    // remove the crosshair
    if (crosshairs.parentNode) {
      crosshairs.parentNode.removeChild(crosshairs);
    }

    selectionSphere.remove();
    inline.color(colorCache);
  };

  var processTranslationGizmoEventX = function processTranslationGizmoEventX(event) {
    var sensorToWorldMatrix = undefined;
    var translationValue = undefined;

    if (event.fieldName === "translation_changed") {
      // convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
      sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute("axisRotation"));

      translationValue = sensorToWorldMatrix.multMatrixVec(event.value);

      if (options.snapToGrid) {
        translationValue.x = Math.floor(translationValue.x);
      }

      angular.forEach(inlines, function (inline) {
        var oldTranslationValue = inline.parentNode.getFieldValue("translation");
        oldTranslationValue.x = translationValue.x;
        inline.parentNode.setFieldValue("translation", oldTranslationValue);
      });
    }
  };

  var processTranslationGizmoEventY = function processTranslationGizmoEventY(event) {
    var sensorToWorldMatrix = undefined;
    var translationValue = undefined;

    if (event.fieldName === "translation_changed") {
      // convert the sensor's output from sensor coordinates to world coordinates (i.e., include its 'axisRotation')
      sensorToWorldMatrix = $window.x3dom.fields.SFMatrix4f.parseRotation(event.target.getAttribute("axisRotation"));

      translationValue = sensorToWorldMatrix.multMatrixVec(event.value);

      if (options.snapToGrid) {
        translationValue.y = Math.floor(translationValue.y);
      }

      angular.forEach(inlines, function (inline) {
        var oldTranslationValue = inline.parentNode.getFieldValue("translation");
        oldTranslationValue.y = translationValue.y;
        inline.parentNode.setFieldValue("translation", oldTranslationValue);
      });
    }
  };

  var setUp = function setUp(x3dElement) {
    var loadCount = 0;
    console.debug("Set up scene.");

    // fix x3dom swallowing exceptions in callback
    $window.x3dom.debug.logException = function (e) {
      console.error(e.stack);
    };

    crosshairs = angular.element($templateCache.get("templates/crosshair.html")).get(0);
    translationGizmoX = angular.element($templateCache.get("templates/planeSensor-X.html")).get(0);
    translationGizmoY = angular.element($templateCache.get("templates/planeSensor-Y.html")).get(0);

    inlines = x3dElement.find("inline");

    angular.forEach(inlines, function (inline) {
      var url = inline.getAttribute("url");
      inline.setAttribute("url", Constants.apiRoot + "/" + "projects" + "/" + $routeParams.project + "/" + $routeParams.file.replace(/\/[^\/]*$/, "") + "/" + url);
    });

    $window.x3dom.reload();

    angular.forEach(x3dElement.find("scene"), function (scene) {
      scene.appendChild(translationGizmoX);
      scene.appendChild(translationGizmoY);
    });

    angular.forEach(inlines, function (inline) {
      inline.addEventListener("mousedown", start);
      inline.addEventListener("mouseup", stop);
      inline.addEventListener("load", function () {
        loadCount += 1;
        if (loadCount === inlines.length && x3dElement.children().get(0) && x3dElement.children().get(0).runtime) {
          window.x3dNode = x3dElement.children().get(0);
          x3dElement.children().get(0).runtime.showAll();
        }
      });
      new $window.x3dom.Moveable(x3dElement.children().get(0), inline.parentElement, move, 0, "all");
    });

    translationGizmoX.children[0].addEventListener("onoutputchange", processTranslationGizmoEventX);
    translationGizmoY.children[0].addEventListener("onoutputchange", processTranslationGizmoEventY);

    return options;
  };

  return {
    setUp: setUp
  };
});
"use strict";

var angular = window.angular;

angular.module("scegratooApp").controller("ProjectsProjectX3dFileCtrl", function ($scope, $routeParams, Project) {
  Project.get({
    project: $routeParams.project,
    file: $routeParams.file
  }, function (file) {
    $scope.x3d = file.data;
    var tree = document.createElement("div");
    tree.innerHTML = file.data;
    $scope.tree = tree.children[0];
  });
});