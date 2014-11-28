'use strict';

angular.module('scegratooApp')
  .service('x3dQuery', function x3dQuery() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var mixin = {
      color: function color(clr) {
        if (clr) {
          if (angular.isArray(clr)) {
            clr = angular.copy(clr)

            angular.forEach(this.prestineNode.getElementsByTagName('Material'), function(material) {
              material.diffuseColor = clr.shift()
            })
            angular.forEach(this.prestineNode.getElementsByTagName('material'), function(material) {
              material.diffuseColor = clr.shift()
            })

            return this.enchantedNode
          } else {
            angular.forEach(this.prestineNode.getElementsByTagName('Material'), function(material) {
              material.diffuseColor = clr
            })
            angular.forEach(this.prestineNode.getElementsByTagName('material'), function(material) {
              material.diffuseColor = clr
            })

            return this.enchantedNode
          }
        } else {
          var colors = []

          angular.forEach(this.prestineNode.getElementsByTagName('Material'), function(material) {
            colors.push(material.diffuseColor)
          })
          angular.forEach(this.prestineNode.getElementsByTagName('material'), function(material) {
            colors.push(material.diffuseColor)
          })

          return colors
        }
      },

      get: function get() {
        return this.prestineNode
      },

      firstParent: function firstParent(parentName) {
        var _firstParent
        var next = this.prestineNode

        while (next.nodeName.toLowerCase() !== '#document') {
          next = next.parentNode

          if (next.nodeName.toLowerCase() === parentName) {
            _firstParent = next
            break
          }
        }

        if (_firstParent) {
          return wrap(_firstParent)
        } else {
          return null
        }
      },

      lastParent: function lastParent(parentName) {
        var _lastParent
        var next = this.prestineNode

        while (next.nodeName.toLowerCase() !== '#document') {
          next = next.parentNode

          if (next.nodeName.toLowerCase() === parentName) {
            _lastParent = next
          }
        }

        if (_lastParent) {
          return wrap(_lastParent)
        } else {
          return null
        }
      }
    }

    var wrap = function wrap(node) {
      // only wrap dom nodes, return `node` otherwise
      if (node.nodeType) {
        var wrappedNode = [node]
        var priv = {
          prestineNode: node,
          runtime: undefined,
          enchantedNode: wrappedNode
        }
        var x3d = node

        // find top most x3d
        while (x3d.nodeName.toLowerCase() !== 'x3d') {
          x3d = x3d.parentNode
        }

        priv.runtime = x3d.runtime

        // mix in our functions and bind them to a private scope
        angular.forEach(mixin, function(method, name) {
          wrappedNode[name] = angular.bind(priv, method)
        })

        // mix in x3dom runtime function for that x3d node partial applying it to
        // the node so we don't have to call `wrappedNode.getBBox(wrappedNode)`
        // but instead just `wrappedNode.getBBox()`
        angular.forEach(Object.getPrototypeOf(priv.runtime), function(method, name) {
          wrappedNode[name] = angular.bind(priv.runtime, method, node)
        })

        return wrappedNode
      } else {
        return node
      }
    }

    return wrap
  })
