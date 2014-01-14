'use strict';

describe('Controller: ProjectsCtrl', function () {

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

  var ProjectsCtrl, scope, $httpBackend

  // Initialize the controller, a mock scope and a mock http backend
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('api/v1/projects/projects.json').
      respond([{id: 0, title: 'test'},{id: 1, title: 'orgel'}])

    scope = $rootScope.$new()
    ProjectsCtrl = $controller('ProjectsCtrl', {$scope: scope})
  }))


  it('should create "projects" model with 2 projects fetched from xhr', function () {
    expect(scope.projects).toEqualData([])
    $httpBackend.flush()

    expect(scope.projects).toEqualData([{id: 0, title: 'test'},{id: 1, title: 'orgel'}])
  })
})
