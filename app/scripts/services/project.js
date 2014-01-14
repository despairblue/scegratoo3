'use strict';

angular.module('scegratooApp')
.service('Project', function Project($resource) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var apiRoot = 'api/v1/projects/'
  return $resource(apiRoot + ':project.json', {}, {
    query: {method:'GET', params:{project: 'projects'}, isArray:true}
  })
})
