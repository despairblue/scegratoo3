'use strict';

describe('Service: Project', function () {
  // register http://docs.angularjs.org/api/angular.equals
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected)
      }
    })
  })

  // load the service's module
  beforeEach(module('scegratooApp'))

  // instantiate service
  var Project, $httpBackend
  var projectsData = function() {
    return [{id: 0, title: 'test'},{id: 1, title: 'orgel'}]
  }
  var skeilProjectData = function() {
    return {
      name: 'skeil',
      files: [
        'foo/bar/file1.js',
        'bacon/file2.x3d'
      ]
    }
  }
  var x3dFileData = function() {
    return '<X3D><Scene></Scene></X3D>'
  }

  beforeEach(inject(function (_Project_, _$httpBackend_) {
    Project = _Project_
    $httpBackend = _$httpBackend_
    $httpBackend.whenGET('api/v1/projects.json')
    .respond(projectsData())
    $httpBackend.whenGET('api/v1/projects/skeil.json')
    .respond(skeilProjectData())
    $httpBackend.whenGET('api/v1/projects/skeil/awesome/game/file.x3d')
    .respond(x3dFileData())
  }))


  it('should query api/v1/projects.json', function () {
    var p = Project.query()
    $httpBackend.flush()
    expect(p).toEqualData(projectsData())
  })

  it('should get api/v1/projects/skeil.json', function() {
    var p = Project.get({project: 'skeil'})
    $httpBackend.flush()
    expect(p).toEqualData(skeilProjectData())
  })

  it('should get api/v1/projects/skeil/awsome/game/file.x3d', function() {
    var f = Project.get({project: 'skeil', file: 'awesome/game/file.x3d'})
    $httpBackend.flush()
    expect(f).toEqualData({data: x3dFileData()})
  })

})
