'use strict';

describe('Service: Constants', function () {

  // load the service's module
  beforeEach(module('scegratooApp'));

  // instantiate service
  var Constants;
  beforeEach(inject(function (_Constants_) {
    Constants = _Constants_;
  }));

  it('should have property apiRoot', function () {
    expect(!!Constants.apiRoot).toBe(true);
  });

  it('should have property apiRoot with value "api/v1', function () {
    expect(Constants.apiRoot).toBe('api/v1');
  });

});
