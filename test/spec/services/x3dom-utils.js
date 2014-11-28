'use strict';

describe('Service: X3domUtils', function () {
  // set up global mocks
  var x3dom = function() {
    return {
      reload: function(){},
      debug: {},
      Moveable: function(){},
    }
  }

  // load the service's module
  beforeEach(module('scegratooApp'));
  beforeEach(module('templates'));

  var element

  // instantiate service
  var X3domUtils;
  beforeEach(inject(function (_X3domUtils_, $window, $routeParams) {
    X3domUtils = _X3domUtils_
    // set up globals
    $window.x3dom = x3dom()
    // set up spy
    spyOn($window.x3dom, 'reload')
    spyOn($window.x3dom, 'Moveable')
    // set up routes
    $routeParams.project = 'OrgelRT'
    $routeParams.file = 'src/orgelSS13.x3d'
    // set up element
    element = angular.element('<div sgt-x3d content="x3d"><Inline url="x3d/awesomeModel.x3d"></Inline></div>')
  }));


  it('should call $window.x3dom.reload() when setUp() is called', inject(function($window) {
    expect($window.x3dom.reload.calls.count()).toBe(0)
    X3domUtils.setUp(element);
    expect($window.x3dom.reload.calls.count()).toBe(1)
  }))

  it('should translate the inline\'s url', function() {
    X3domUtils.setUp(element)
    var e = element[0].querySelector('inline')
    expect(e.getAttribute('url')).toBe('api/v1/projects/OrgelRT/src/x3d/awesomeModel.x3d')
  })

  it('should call Moveable once per inline node', inject(function($window) {
    X3domUtils.setUp(element);
    expect($window.x3dom.Moveable.calls.count()).toBe(1)
  }))

});
