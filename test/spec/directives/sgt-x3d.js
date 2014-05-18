'use strict';

describe('Directive: sgtX3d', function() {
  // set up global mocks
  var dat = function() {
    return {
      GUI: function() {
        return {
          add: function() {
            return {listen: function() {}}
          },
          addFolder: function() {
            return {add: function() {
              return {listen: function() {}}
            }}
          }
        }
      }
    }
  }
  var x3dom = function() {
    return {
      reload: function(){},
      Moveable: function(){}
    }
  }

  // load the directive's module
  beforeEach(module('scegratooApp'));

  var element, scope;

  beforeEach(inject(function($rootScope, $compile, $window, $routeParams) {
    // set up globals
    $window.dat = dat()
    $window.x3dom = x3dom()
    // set up spy on global `x3dom.relaod`
    spyOn($window.x3dom, 'reload')
    scope = $rootScope.$new();
    // set up routes
    $routeParams.project = 'OrgelRT'
    $routeParams.file = 'src/orgelSS13.x3d'
    // set up element, compile and link it
    element = angular.element('<div sgt-x3d content="x3d"></div>')
    element = $compile(element)(scope)
    // digest so that the directive gets instantiated
    scope.$digest()
  }));

  afterEach(inject(function($window) {
    $window.dat = undefined
    $window.x3dom = undefined
  }))


  it('should parse and include x3d scene when available', inject(function() {
    expect(element.children().length).toBe(0)
    scope.x3d = '<X3D><Scene></Scene></X3D>'
    scope.$digest()
    expect(element.children().length).toBe(1)
  }));

  it('should add the class fullpage', function() {
    scope.x3d = '<X3D></X3D>'
    scope.$digest()
    expect(element.children().hasClass('fullpage')).toBe(true)
  })

  it('should call $window.x3dom.reload() when content attribute changes', inject(function($window) {
    expect($window.x3dom.reload.calls.count()).toBe(1)
    scope.x3d = 'skeil'
    scope.$digest()
    expect($window.x3dom.reload.calls.count()).toBe(2)
  }))

  it('should translate the inline\'s url', function() {
    scope.x3d = '<Inline url="x3d/awesomeModel.x3d"></Inline>'
    scope.$digest()
    var e = element[0].querySelector('inline')
    expect(e.getAttribute('url')).toBe('api/v1/projects/OrgelRT/src/x3d/awesomeModel.x3d')
  })
});
