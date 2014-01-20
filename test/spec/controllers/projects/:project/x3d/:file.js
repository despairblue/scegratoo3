'use strict';

describe('Controller: ProjectsProjectX3dFileCtrl', function() {
  // load the controller's module
  beforeEach(module('scegratooApp'))

  var ProjectsProjectX3dFileCtrl, scope, $httpBackend
  var x3dFileData = function() {
    return '<X3D><Scene></Scene></X3D>'
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $routeParams) {
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('api/v1/projects/skeil/awesome/game/file.x3d')
    .respond(x3dFileData())

    $routeParams.project = 'skeil'
    $routeParams.file = 'awesome/game/file.x3d'

    scope = $rootScope.$new()
    ProjectsProjectX3dFileCtrl = $controller('ProjectsProjectX3dFileCtrl', {
      $scope: scope
    })
  }))


  it('should fetch project file and add it to the scope', function() {
    expect(scope.x3d).toEqual(undefined)
    $httpBackend.flush()
    expect(scope.x3d).toEqual(x3dFileData())
  })
})
