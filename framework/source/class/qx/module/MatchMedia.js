"use strict";
/* ************************************************************************

 qooxdoo - the new era of web development

 http://qooxdoo.org

 Copyright:
 2013 1&1 Internet AG, Germany, http://www.1und1.de

 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.

 Authors:
 * Romeo Kenfack Tsakem (rkenfack)
 * Tobias Oberrauch (toberrauch)

 ************************************************************************ */

/**
 * Module for mediaqueries evaluation. The module is a wrapper for media.match.js,
 * that implements a polyfill for window.matchMedia when it's not supported natively.
 */
qx.Class.define("qx.module.MatchMedia", {

  statics: {
    /**
     * Evaluates the specified mediaquery list
     *
     * @param query {String} the media query to evaluate
     * @return {qx.bom.MediaQuery}  The media query
     */
    matchMedia: function (query) {
      return new qx.bom.MediaQuery(query);
    },

    /**
     * Adds screen size classes (e.g. small-only or medium-up) by pre-defined media queries using em.
     * The range goes from small to medium, large and xlarge up to xxlarge:
     *
     * small: 0em - 40em
     * medium: 40.063em - 64em
     * large: 64.063em - 90em
     * xlarge: 90.063em - 120em
     * xxlarge: > 120.063em
     *
     * The suffix of the class name indicates either that the current screen
     * is larger than this size (*-up) or in that range (*-only).
     *
     * @attachStatic {qxWeb}
     */
    addSizeClasses: function () {
      qxWeb("html").mediaQueryToClass("only screen", "small-up");
      qxWeb("html").mediaQueryToClass("only screen and (max-width: 40em)", "small-only");

      qxWeb("html").mediaQueryToClass("only screen and (min-width: 40.063em)", "medium-up");
      qxWeb("html").mediaQueryToClass("only screen and (min-width: 40.063em) and (max-width: 64em)", "medium-only");

      qxWeb("html").mediaQueryToClass("only screen and (min-width: 64.063em)", "large-up");
      qxWeb("html").mediaQueryToClass("only screen and (min-width: 64.063em) and (max-width: 90em)", "large-only");

      qxWeb("html").mediaQueryToClass("only screen and (min-width: 90.063em)", "xlarge-up");
      qxWeb("html").mediaQueryToClass("only screen and (min-width: 90.063em) and (max-width: 120em)", "xlarge-only");

      qxWeb("html").mediaQueryToClass("only screen and (min-width: 120.063em)", "xxlarge-up");
    },

    /**
     * Adds or removes a class depending on matching a given media query
     *
     * @param query {String} the media query to evaluate
     * @param className {String} css class name that gets bind to an element
     */
    __applyClass: function (query, className) {
      if (query.isMatching()) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
    },

    /**
     * Maps a class to a html element  media query
     *
     * @param queryString {String} the media query to evaluate
     * @param className {String} css class name that gets bind to an element
     *
     * @attach {qxWeb}
     *
     * @return {qx.module.MatchMedia} The own instance
     */
    mediaQueryToClass: function (queryString, className) {
      var query = qx.module.MatchMedia.matchMedia(queryString);
      var callback = qx.module.MatchMedia.__applyClass.bind(this, query, className);

      // apply classes initially
      callback(query, className);

      query.on("change", callback);

      return this;
    }
  },

  classDefined : function (statics) {
    qxWeb.$attachStatic({
      matchMedia: statics.matchMedia,
      addSizeClasses: statics.addSizeClasses
    });
    qxWeb.$attach({
      mediaQueryToClass: statics.mediaQueryToClass
    });
  }
});
