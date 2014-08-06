'use strict';

describe('Service: X3dWidgets', function () {

  // load the service's module
  beforeEach(module('scegratooApp'));

  // instantiate service
  var X3dWidgets;
  beforeEach(inject(function (_X3dWidgets_) {
    X3dWidgets = _X3dWidgets_;
  }));

  it('should do something', function () {
    expect(!!X3dWidgets).toBe(true);
  });

});
