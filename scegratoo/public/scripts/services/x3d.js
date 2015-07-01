'use strict'

window.angular.module('scegratooApp')
  .service('X3D', function X3D (Moveable) {
    const Inline = options => {
      const transform = document.createElement('Transform')
      const inline = document.createElement('Inline')
      Object.keys(options)
        .forEach(key => inline.setAttribute(key, options[key]))
      transform.appendChild(inline)
      return transform
    }

    return {
      createElement: (tag, options) => {
        switch (tag.toLowerCase()) {
          case 'inline':
            return Inline(options)
          default:
            throw new Error(`The tag '${tag}' is not supported. Make sure you didn't mistype it.`)
        }
      }
    }
  })
