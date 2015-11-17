import angular from 'angular'

angular.module('scegratooApp')
  .service('X3dWidgets', function X3dWidgets () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var createCrosshair = function (scale) {

    }

    // probably add x and y
    var createPlane = function (scale, withWidgets) {

    }

    return {
      createCrosshair: createCrosshair,
      createPlane: createPlane
    }
  })
