'use strict';

angular.module('scegratooApp')
// angular.module('scegratooApp')
  .controller('MainCtrl', function ($scope, catalog) {
    $scope.catalog = catalog
  });
