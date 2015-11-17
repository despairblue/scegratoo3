import angular from 'angular'

angular.module('scegratooApp')
  .service('moveables', function () {
    return new WeakMap()
  })
