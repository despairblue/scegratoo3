'use strict'

window.angular.module('scegratooApp')
  .service('Project', function Project ($resource, $http, Constants) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    const route = Constants.apiRoot + '/projects/:project.:format'
    const resource = $resource(route, {format: 'json'})
    return {
      get: (params, fn) => {
        if (params.file) {
          const url = [
            Constants.apiRoot,
            'projects',
            encodeURI(params.project),
            encodeURI(params.file)
          ].join('/')
          const res = $resource(url, {}, {
            get: {
              method: 'GET',
              transformResponse: data => ({data: data})
            }
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
