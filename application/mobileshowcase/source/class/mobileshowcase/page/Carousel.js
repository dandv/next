"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Mobile page showing the "Carousel" showcase.
 */
qx.Bootstrap.define("mobileshowcase.page.Carousel",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.base(mobileshowcase.page.Abstract, "constructor");
    this.title = "Carousel";
  },


  members :
  {
    // overridden
    _createScrollContainer : function() {
      var carousel = new qx.ui.mobile.container.Carousel(0.5);
      carousel.height = null;

      var page1 = new qx.ui.mobile.container.Composite();
      page1.addClass("carousel-example-1");

      var page1Label =new qx.ui.mobile.basic.Label("This is a carousel. Please swipe left.");
      page1Label.addClass("carousel-label-1");
      page1.add(page1Label);

      var page2 = new qx.ui.mobile.container.Composite();
      page2.addClass("carousel-example-2");
      page2.add(new qx.ui.mobile.basic.Label("It contains multiple carousel pages."));

      var page3 = new qx.ui.mobile.container.Composite();
      page3.addClass("carousel-example-3");
      var page3label = new qx.ui.mobile.basic.Label("Carousel pages may contain any widgets like labels, images, buttons etc.");
      page3.add(page3label);

      var nextButton = new qx.ui.mobile.form.Button("Next Page");
      nextButton.addClass("example-button");
      nextButton.on("tap", function() {
        setTimeout(function() {
          carousel.nextPage();
        }.bind(this), 0);
      }, carousel);

      var previousButton = new qx.ui.mobile.form.Button("Previous Page");
      previousButton.addClass("example-button");
      previousButton.on("tap", function() {
        setTimeout(function() {
          carousel.previousPage();
        }.bind(this), 0);
      }, carousel);

      var page3group = new qx.ui.mobile.form.Group([previousButton,nextButton],false);
      page3group.setLayout(new qx.ui.mobile.layout.HBox());
      page3.add(page3group);

      var page4 = new qx.ui.mobile.container.Composite();
      page4.addClass("carousel-example-4");
      page4.add(new qx.ui.mobile.basic.Label("The carousel snaps on every page."));

      var page5 = new qx.ui.mobile.container.Composite();
      page5.addClass("carousel-example-5");
      page5.add(new qx.ui.mobile.basic.Label("You can add as many pages as you want."),{flex:1});

      var moreButton = new qx.ui.mobile.form.Button("Add more pages");
      moreButton.addClass("example-button");
      moreButton.on("tap", function() {
        for (var i = 0; i < 50; i++) {
          var page = new qx.ui.mobile.container.Composite();
          if (i % 2 === 0) {
            page.addClass("carousel-example-5");
          } else {
            page.addClass("carousel-example-4");
          }

          page.add(new qx.ui.mobile.basic.Label("Dynamically added page #" + (i + 1)), {
            flex: 1
          });
          carousel.add(page);

          moreButton.exclude();
        }
      }, carousel);

      var moreGroup = new qx.ui.mobile.form.Group([moreButton],false);
      moreGroup.setLayout(new qx.ui.mobile.layout.HBox());

      page5.add(moreGroup);

      var page6 = new qx.ui.mobile.container.Composite();
      page6.addClass("carousel-example-6");
      page6.add(new qx.ui.mobile.basic.Label("Previous page is shown when you swipe right."),{flex:1});

      carousel.add(page1);
      carousel.add(page2);
      carousel.add(page3);
      carousel.add(page4);
      carousel.add(page5);
      carousel.add(page6);

      return carousel;
    },


    // overridden
    _createContent : function() {
      return null;
    }
  }
});