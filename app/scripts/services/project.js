'use strict';

angular.module('scegratooApp')
.service('Project', function Project($resource, $http, Constants) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var route = Constants.apiRoot + '/projects/:project.:format'
  var resource = $resource(route, {format: 'json'})
  return {
    get: function(params, fn) {
      if (params.file) {
        var url = [
          Constants.apiRoot,
          'projects',
          encodeURI(params.project),
          encodeURI(params.file)
        ].join('/')
        var res = $resource(url, {}, {
          get: {method: 'GET', transformResponse: function(data) {
            return {data: data}
          }}
        })
        return res.get(fn)
      } else {
        return resource.get(params, fn)
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
  }
})
