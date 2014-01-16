'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('SceGraToo App', function() {
  beforeEach(function() {
    browser.get('/')
  })

  var logPromise = function(promise) {
    promise.then(function(obj){
      console.log(obj)
    })
  }


  describe('Homepage', function() {
    var homepage

    var Homepage = function() {
      this.get = function() {
        browser.get('/')
      }
    }

    beforeEach(function(){
      homepage = new Homepage()
      homepage.get()
    })

    it('should reroute to /projects', function() {
      homepage.get()

      expect(browser.getCurrentUrl()).toMatch(/#\/projects$/)
    })
  })

  describe('Projects page', function() {
    var projectsPage

    var ProjectsPage = function() {
      this.goToRoot = function() {
        browser.get('#/projects')
      }

      this.getProjects = function() {
        return element.all(by.repeater('item in projects'))
      }

      this.getProject = function(index) {
        return this.getProjects().get(index)
      }

      this.getLinkText = function(index) {
        return this.getProject(index).findElement(by.css('a')).getText()
      }

      this.clickProject = function(index) {
        this.getProjects().get(index).findElement(by.css('a')).click()
      }
    }

    beforeEach(function() {
      projectsPage = new ProjectsPage()
      projectsPage.goToRoot()
    })

    it('should display 3 items', function() {
      expect(projectsPage.getProjects().count()).toBe(3)
    })

    it('second element should be OrgelRT', function() {
      expect(projectsPage.getLinkText(1)).toEqual('OrgelRT')
    })

    it('should navigate to /projects/OrgelRT when clicking OrgelRT', function() {
      projectsPage.clickProject(1)
      browser.getCurrentUrl().then(function(url) {
        expect(/#\/projects\/OrgelRT$/.test(url)).toBe(true)
      })
    })
  })

  describe('Project page', function() {
    var projectPage

    var ProjectPage = function() {
      this.sourceLinks = element.all(by.css('a[href$=".js"'))
      this.x3dLinks = element.all(by.css('a[href$=".x3d"'))
    }

    beforeEach(function() {
      browser.get('#/projects/OrgelRT')
      projectPage = new ProjectPage()
    })

    it('should display at least one source file', function() {
      expect(projectPage.sourceLinks.count()).toBeGreaterThan(0)
    })

    it('should display at least one x3d file', function() {
      expect(projectPage.x3dLinks.count()).toBeGreaterThan(0)
    })
  })



  // describe('Phone list view', function() {

  //   beforeEach(function() {
  //     browser().navigateTo('app/index.html#/phones');
  //   });


  //   it('should filter the phone list as user types into the search box', function() {
  //     expect(repeater('.phones li').count()).toBe(20);

  //     input('query').enter('nexus');
  //     expect(repeater('.phones li').count()).toBe(1);

  //     input('query').enter('motorola');
  //     expect(repeater('.phones li').count()).toBe(8);
  //   });


  //   it('should be possible to control phone order via the drop down select box', function() {
  //     input('query').enter('tablet'); //let's narrow the dataset to make the test assertions shorter

  //     expect(repeater('.phones li', 'Phone List').column('phone.name')).
  //         toEqual(["Motorola XOOM\u2122 with Wi-Fi",
  //                  "MOTOROLA XOOM\u2122"]);

  //     select('orderProp').option('Alphabetical');

  //     expect(repeater('.phones li', 'Phone List').column('phone.name')).
  //         toEqual(["MOTOROLA XOOM\u2122",
  //                  "Motorola XOOM\u2122 with Wi-Fi"]);
  //   });


  //   it('should render phone specific links', function() {
  //     input('query').enter('nexus');
  //     element('.phones li a').click();
  //     expect(browser().location().url()).toBe('/phones/nexus-s');
  //   });
  // });


  // describe('Phone detail view', function() {

  //   beforeEach(function() {
  //     browser().navigateTo('app/index.html#/phones/nexus-s');
  //   });


  //   it('should display nexus-s page', function() {
  //     expect(binding('phone.name')).toBe('Nexus S');
  //   });


  //   it('should display the first phone image as the main phone image', function() {
  //     expect(element('img.phone.active').attr('src')).toBe('img/phones/nexus-s.0.jpg');
  //   });


  //   it('should swap main image if a thumbnail image is clicked on', function() {
  //     element('.phone-thumbs li:nth-child(3) img').click();
  //     expect(element('img.phone.active').attr('src')).toBe('img/phones/nexus-s.2.jpg');

  //     element('.phone-thumbs li:nth-child(1) img').click();
  //     expect(element('img.phone.active').attr('src')).toBe('img/phones/nexus-s.0.jpg');
  //   });
  // });
});
