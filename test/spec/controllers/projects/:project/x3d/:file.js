'use strict';

describe('Controller: ProjectsProjectX3dFileCtrl', function () {

  // load the controller's module
  beforeEach(module('scegratooApp'));

  var ProjectsProjectX3dFileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectsProjectX3dFileCtrl = $controller('ProjectsProjectX3dFileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});