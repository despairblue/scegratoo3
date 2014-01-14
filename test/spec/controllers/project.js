'use strict';

describe('Controller: ProjectCtrl', function () {

  // register http://docs.angularjs.org/api/angular.equals
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected)
      }
    })
  })

  // load the controller's module
  beforeEach(module('scegratooApp'))

  var ProjectCtrl, scope, $httpBackend
  var skeilProjectData = function() {
    return {
      name: 'skeil',
      files: [
        'foo/bar/file1.js',
        'bacon/file2.x3d'
      ]
    }
  }

  var expectedSkeilProjectData = function() {
    return {
      name: 'skeil',
      files: [
        {
          path: 'foo/bar/file1.js',
          view: 'source'
        },
        {
          path: 'bacon/file2.x3d',
          view: 'x3d'
        }
      ]
    }
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $routeParams) {
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('api/v1/projects/skeil.json')
    .respond(skeilProjectData())

    $routeParams.project = 'skeil'

    scope = $rootScope.$new();
    ProjectCtrl = $controller('ProjectCtrl', {
      $scope: scope
    })
  }))

  it('should create "project" model fetched from xhr', function () {
    expect(scope.project).toEqualData({})
    $httpBackend.flush()

    expect(scope.project).toEqualData(expectedSkeilProjectData())
  })
})

