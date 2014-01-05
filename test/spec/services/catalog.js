'use strict';

describe('Service: Catalog', function () {

  // load the service's module
  beforeEach(module('scegratooApp'));

  // instantiate service
  var catalog;
  beforeEach(inject(function (_catalog_) {
    catalog = _catalog_;
  }));

  it('should do something', function () {
    expect(!!catalog).toBe(true);
  });

});
