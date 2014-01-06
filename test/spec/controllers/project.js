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
        'file1',
        'file2'
      ]
    }
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $routeParams) {
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('api/v1/project/skeil.json')
    .respond(skeilProjectData())

    $routeParams.projectId = 'skeil'

    scope = $rootScope.$new();
    ProjectCtrl = $controller('ProjectCtrl', {
      $scope: scope
    })
  }))

  it('should create "project" model fetched from xhr', function () {
    expect(scope.project).toEqualData({})
    $httpBackend.flush()

    expect(scope.project).toEqualData(skeilProjectData())
  })
})

