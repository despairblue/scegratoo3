'use strict';

describe('Directive: sgt-navigation-bar', function() {

  // load the directive's module
  beforeEach(module('scegratooApp'))
  beforeEach(module('templates'))

  var element, scope

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = angular.element('<div sgt-navigation-bar></div>')
    element = $compile(element)(scope)
    scope.$digest()
  }))

  it('should have the class "navbar"', function() {
    expect(element.hasClass('navbar')).toBe(true)
  })

  it('should have the role "navigation"', function() {
    expect(element.attr('role')).toBe('navigation')
  })

  it('should have one child', function () {
    expect(element.children().length).toBe(1)
  })
})
