'use strict'

window.angular.module('scegratooApp')
  .service('Project', function Project ($resource, $http, Constants, $routeParams) {
    const route = Constants.apiRoot + '/projects/:project'
    const resource = $resource(route)

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
      getInlines: () => $http.get(`projects/${$routeParams.project}`),
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
