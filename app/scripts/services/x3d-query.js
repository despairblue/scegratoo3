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
