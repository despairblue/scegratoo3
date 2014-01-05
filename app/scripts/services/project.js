'use strict';

angular.module('scegratooApp')
.service('Project', function Project($resource) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return $resource('api/v1/projects.json', {}, {
    query: {method:'GET', params:{}, isArray:true}
  })
})
