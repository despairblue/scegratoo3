require('./moveable')

import angular from 'angular'
import React from 'react'

angular.module('scegratooApp')
  .service('X3D', function X3D () {
    const div = document.createElement('div')

    return {
      renderJSX: node => {
        React.render(node, div)
        return div.children[0]
      }
    }
  })
