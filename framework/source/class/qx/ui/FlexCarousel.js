"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * A carousel is a widget which can switch between several sub pages {@link  qx.ui.Widget}.
 * A page switch is triggered by a swipe to left, for next page, or a swipe to right for
 * previous page. Pages can also be switched by holding and moving.
 *
 * A carousel shows by default a pagination indicator at the bottom of the carousel.
 *
 * @require(qx.module.Transform)
 * @require(qx.module.event.Swipe)
 * @require(qx.module.event.GestureHandler)
 * @require(qx.module.event.Track)
 * @require(qx.module.event.TrackHandler)
 */
qx.Class.define("qx.ui.FlexCarousel",
{
  extend : qx.ui.Widget,

  properties: {
    // overridden
    defaultCssClass : {
      init : "flexcarousel"
    },

    /**
     * The currently selected page.
     */
    active: {
      check: "qxWeb",
      apply: "_update",
      event: true
    },

    /**
     * The time in milliseconds for the page switch animation.
     */
    pageSwitchDuration: {
      check: "Number",
      init: 500
    }
  },


  // overridden
  construct: function(element) {
    this.super(qx.ui.Widget, "construct", element);

    this.on("trackstart", this._onTrackStart, this)
      .on("track", this._onTrack, this);

    qxWeb(window).on("resize", this._onResize, this);

    this.__scrollContainer = new qx.ui.Widget()
      .addClass(this.defaultCssClass + "-container")
      .appendTo(this)
      .on("trackend", this._onTrackEnd, this);

    this.__pageContainer = (new qx.ui.Widget())
      .addClass("qx-hbox")
      .on("removedChild", this._onRemovedChild, this)
      .appendTo(this.__scrollContainer);

    this.__paginationLabels = [];
    this.__pagination = new qx.ui.Widget()
      .set({
        layout: new qx.ui.layout.HBox(),
        layoutPrefs: {flex: 1}
      })
      .addClass(this.defaultCssClass + "-pagination")
      .appendTo(this);

    this.on("addedChild", this._onAddedChild, this)
      .on("swipe", this._onSwipe, this);
  },


  members: {
    __pageContainer: null,
    __scrollContainer: null,
    __paginationLabels: null,
    __startPosLeft: null,
    __pagination: null,


    /**
     * Scrolls the carousel to the next page.
     *
     * @param acceleration {Number?} An acceleration factor
     *   usually based on the velocity of a swipe
     * @return {qx.ui.FlexCarousel} Self instance for chaining
     */
    nextPage: function(acceleration) {
      var pages = this.__pageContainer.find("." + this.defaultCssClass + "-page");

      var next = this.active.getNext();
      if (next.length == 0) {
        next = pages.eq(0);
      }
      this.active = next;

      return this;
    },


    /**
     * Scrolls the carousel to the previous page.
     *
     * @param acceleration {Number?} An acceleration factor
     *   usually based on the velocity of a swipe
     * @return {qx.ui.FlexCarousel} Self instance for chaining
     */
    previousPage: function(acceleration) {
      var pages = this.__pageContainer.find("." + this.defaultCssClass + "-page");

      var prev = this.active.getPrev();
      if (prev.length == 0) {
        prev = pages.eq(pages.length - 1);
      }
      this.active = prev;

      return this;
    },


    /**
     * Handler for the 'addedChild' event. Updates the pagination,
     * scroll position, active property and the sizing.
     */
    _onAddedChild: function(child) {
      child.addClasses(["qx-flex1", this.defaultCssClass + "-page"])
        .appendTo(this.__pageContainer);

      var paginationLabel = this._createPaginationLabel();
      this.__paginationLabels.push(paginationLabel);
      this.__pagination.append(paginationLabel);

      this._updateWidth();

      if (!this.active) {
        this.active = child;
      } else {
        this._updateOrder();
      }

      // scroll as soon as we have the third page added
      if (this.__pageContainer.find("." + this.defaultCssClass + "-page").length === 3) {
        this.__scrollContainer.translate([(-this.getWidth()) + "px", 0, 0]);
      }
      this._updatePagination();
    },


    /**
     * Handler for the 'removedChild' event. Updates the pagination,
     * scroll position, active property and the sizing.
     */
    _onRemovedChild: function(child) {
      this._updateWidth();

      if (this.active[0] == child[0]) {
        this.active = this.__pageContainer.find("." + this.defaultCssClass + "-page").eq(0);
      } else {
        this._updateOrder();
      }

      this.__paginationLabels.splice(child.priorPosition, 1)[0].remove();
      for (var i = 0; i < this.__paginationLabels.length; i++) {
        this.__paginationLabels[i].getChildren(".label").setHtml((i + 1) + "");
      }
      this._updatePagination();
    },


    /**
     * Updates the order, scroll position and pagination.
     */
    _update: function() {
      var direction = this._updateOrder();

      var left;
      if (direction == "right") {
        left = this._getPositionLeft() - this.__scrollContainer.getWidth();
      } else if (direction == "left") {
        left = this._getPositionLeft() + this.__scrollContainer.getWidth();
      } else if (this.find("." + this.defaultCssClass + "-page").length >= 3) {
        // back snapping if the order has not changed
        this._translateTo(this.getWidth(), this.pageSwitchDuration);
        return;
      } else {
        // do nothing if we don't have enough pages
        return;
      }

      if (left !== undefined) {
        // first, translate the old page into view
        this.__scrollContainer.translate([(-left) + "px", 0, 0]);
        // animate to the new page
        this._translateTo(this.getWidth(), this.pageSwitchDuration);
      }

      this._updatePagination();
    },


    /**
     * Updates the CSS order property of the flexbox layout.
     * The active page should be the second in order with a order property of '0'.
     * The page left to the active has the order property set to '-1' and is the
     * only one on the left side. All other pages get increasing order numers and
     * are alligned on the right side.
     *
     * @return {String} The scroll direction, either 'left' or 'right'.
     */
    _updateOrder: function() {
      var scrollDirection;

      var pages = this.__pageContainer.find("." + this.defaultCssClass + "-page");
      var orderBefore = parseInt(this.active.getStyle("order"));

      if (orderBefore > 0) {
        scrollDirection = "right";
      } else if (orderBefore < 0) {
        scrollDirection = "left";
      }

      // special case if a third page has been added
      if (orderBefore === 0 && pages.length == 3) {
        scrollDirection = "right";
      }

      var activeIndex = pages.indexOf(this.active);
      this.active.setStyle("order", 0); // active page should always have order 0
      var order = 1;

      // order all pages with a higher index than the active page
      for (var i = activeIndex + 1; i < pages.length; i++) {
        // move the last page to the left of the active page
        if (activeIndex === 0 && i == pages.length - 1) {
          order = -1;
        }
        qxWeb(pages[i]).setStyle("order", order++);
      }

      // order all pages with a lower index than the active page
      for (var i = 0; i < activeIndex; i++) {
        // move the last page to the left of the active page
        if (i == activeIndex - 1) {
          order = -1;
        }
        qxWeb(pages[i]).setStyle("order", order++);
      }

      return scrollDirection;
    },


    /**
     * Updates the width of the container and the pages.
     */
    _updateWidth: function() {
      if (!this.isRendered()) {
        this.setStyle("visibility", "hidden");
        this.once("appear", this._updateWidth, this);
        return;
      }
      // set the container width to total width of all pages
      var containerWidth =
        this.getWidth() *
        this.__pageContainer.find("." + this.defaultCssClass + "-page").length;
      this.__pageContainer.setStyle("width", containerWidth + "px");
      // set the width of all pages to the carousel width
      this.find("." + this.defaultCssClass + "-page").setStyle("width", this.getWidth() + "px");

      this.setStyle("visibility", "visible");
    },


    /**
     * Handler for trackstart. It saves the initial scroll position and
     * cancels any running animation.
     */
    _onTrackStart: function(e) {
      this.__startPosLeft = this._getPositionLeft();
      this.__scrollContainer
        // stop the current scroll animation
        .stop()
        // correct the scroll position as the stopped animation
        // resets to its initial value
        .translate([(-Math.round(this.__startPosLeft)) + "px", 0, 0]);
        // do not update on tracking
    },


    /**
     * Track handler which updates the scroll position.
     */
    _onTrack: function(e) {
      if (e.delta.axis == "x") {
        this.__scrollContainer.translate([-(this.__startPosLeft - e.delta.x) + "px", 0, 0]);
      }
    },


    /**
     * TrackEnd handler for enabling the scroll events.
     */
    _onTrackEnd: function(e) {
      this.__startPosLeft = null;

      var width = this.getWidth();
      var pages = this.__pageContainer.find("." + this.defaultCssClass + "-page");

      var oldActive = this.active;

      // if more than 50% is visible of the previous page
      if (this._getPositionLeft() < (width - (width / 2))) {
        var prev = this.active.getPrev();
        if (prev.length == 0) {
          prev = pages.eq(pages.length - 1);
        }
        this.active = prev;
      // if more than 50% is visible of the next page
      } else if (this._getPositionLeft() > (width + width / 2)) {
        var next = this.active.getNext();
        if (next.length == 0) {
          next = pages.eq(0);
        }
        this.active = next;
      }

      if (this.active == oldActive) {
        this._update();
      }
    },


    /**
     * Swipe handler which triggers page changes based on the
     * velocity and the direction.
     */
    _onSwipe : function(e) {
      var velocity = Math.abs(e.getVelocity());
      if (e.getAxis() == "x" && velocity > 1) {
        if (e.getDirection() == "left") {
          this.nextPage(velocity);
        } else if (e.getDirection() == "right") {
          this.previousPage(velocity);
        }
      }
    },


    /**
     * Factory method for a paginationLabel.
     * @return {qx.ui.Widget} the created pagination label.
     * @param pageIndex {Integer} The page index
     */
    _createPaginationLabel : function(pageIndex) {
      var paginationIndex = this.__pageContainer.find("." + this.defaultCssClass + "-page").length;

      return qxWeb.create('<div class="' + this.defaultCssClass + '-pagination-label"></div>')
        .on("tap", this._onPaginationLabelTap, this)
        .append(qxWeb.create('<div class="label">' + paginationIndex + '</div>'));
    },


    /**
     * Handles the tap on pagination labels and changes to the desired page.
     */
    _onPaginationLabelTap: function(e) {
      this.__paginationLabels.forEach(function(label, index) {
        if (label[0] === e.currentTarget) {
          this.active = this.__pageContainer.find("." + this.defaultCssClass + "-page").eq(index);
        }
      }.bind(this));
    },


    /**
     * Updates the pagination indicator of this carousel.
     * Adds the 'active' CSS class to the currently visible page's
     * pagination button.
     */
    _updatePagination : function() {
      this.find("." + this.defaultCssClass + "-pagination-label").removeClass("active");
      var pages = this.__pageContainer.find("." + this.defaultCssClass + "-page");
      this.__paginationLabels[pages.indexOf(this.active)].addClass("active");
    },


    /**
     * Resize handler. It updates the sizes, snap points and scroll position.
     */
    _onResize : function() {
      this._updateWidth();
      this.__scrollContainer.translate([(-this.getWidth()) + "px", 0, 0]);
    },


    _translateTo: function(left, time) {
      this.__scrollContainer.animate({
        duration: time,
        keep: 100,
        timing: "ease",
        keyFrames: {
          0: {},
          100: {
            translate: [(- left) + "px", 0, 0]
          }
        }
      });
    },


    _getPositionLeft: function() {
      var containerRect = this.__scrollContainer[0].getBoundingClientRect();
      var parentRect = this[0].getBoundingClientRect();
      return -(containerRect.left - parentRect.left);
    },


    // overridden
    dispose : function() {
      this.super(qx.ui.Widget, "dispose");
      qxWeb(window).off("resize", this._onResize, this);

      this.off("trackstart", this._onTrackStart, this)
        .off("track", this._onTrack, this)
        .off("swipe", this._onSwipe, this);

      this.__scrollContainer.off("trackend", this._onTrackEnd, this);
    }
  }
});

// TODO remove additional container

// TODO rename
// TODO test mobile showcase
// TODO update tests