'use strict';

describe('Controller: ProjectsProjectX3dFileCtrl', function () {
  // set up globals
  beforeEach(function(){
    window.x3dom = {
      reload: function() {}
    }

    spyOn(window.x3dom, 'reload')
  })

  // load the controller's module
  beforeEach(module('scegratooApp'))

  var ProjectsProjectX3dFileCtrl,
    scope

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new()
    ProjectsProjectX3dFileCtrl = $controller('ProjectsProjectX3dFileCtrl', {
      $scope: scope
    })
  }))

  // tear down globals
  afterEach(function() {
    window.x3dom = undefined
  })


  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3)
  })
  it('should call window.x3dom.reload()', function(){
    expect(window.x3dom.reload).toHaveBeenCalled()
  })
})
