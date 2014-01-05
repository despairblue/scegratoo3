'use strict';

describe('Controller: ViewDropdownCtrl', function () {

  // load the controller's module
  beforeEach(module('scegratooApp'));

  var ViewDropdownCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewDropdownCtrl = $controller('ViewDropdownCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.items.length).toBe(4);
  });
});
