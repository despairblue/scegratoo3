'use strict';

angular.module('scegratooApp')
.service('Project', function Project($resource) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return $resource('api/v1/project/:projectId.json', {}, {
    query: {method:'GET', params:{projectId: 'projects'}, isArray:true}
  })
})
