'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /listView when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/listView");
  });


  describe('listView', function() {

    beforeEach(function() {
      browser.get('index.html#!/listView');
    });


    it('should render listView when user navigates to /listView', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('detailView', function() {

    beforeEach(function() {
      browser.get('index.html#!/detailView');
    });


    it('should render detailView when user navigates to /detailView', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
