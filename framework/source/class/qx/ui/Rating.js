"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)
     * Daniel Wagner (danielwagner)

************************************************************************ */
/**
 * This is a simple rating widget which can be used to display a predefined
 * number of symbols which the user can click or tap to give a rating e.g.
 * 3 out of 5 stars.
 *
 * @group (Widget)
 */
qx.Class.define("qx.ui.Rating", {
  extend : qx.ui.Widget,


  properties : {

    defaultCssClass: {
      init : "rating"
    },

    value: {
      init: 0,
      event: true,
      set: "_setValue",
      apply: "_applyValue"
    },

    /**
     * The length of the rating widget.
     */
    size: {
      check: "Number",
      init: 5,
      apply: "_render"
    },

    /**
     * The symbol used to render the rating items. This can be any
     * String, e.g. a UTF-8 character.
     */
    symbol: {
      check: "String",
      init: "★",
      apply: "_render"
    }
  },


  /**
   * @attach {qxWeb, toRating}
   * @return {qx.ui.Rating} The new rating widget.
   */
  construct : function(size, symbol, element) {
    this.super(qx.ui.Widget, "construct", element);

    if (size) {
      this.size = size;
    }
    if (symbol) {
      this.symbol = symbol;
    }

    if (!size && !symbol) {
      this._render();
    }

    if (this.getAttribute("tabindex") < 0) {
      this.setAttribute("tabindex", 0);
    }
    this.on("focus", this._onFocus, this)
    .on("blur", this._onBlur, this);
  },


  events : {
    /** Fired at each value change */
    "changeValue" : "Number"
  },


  members : {

    /**
     * Mutator for the value property. Normalizes the value to ensure
     * it's between the minimum (0) and maximum (size property) values
     * @param value {Number} Incoming value
     */
    _setValue: function(value) {
      if (qx.Class.getClass(value) !== "Number") {
        value = 0;
      }
      if (value < 0) {
        value = 0;
      }
      if (value > this.size) {
        value = this.size;
      }
      var old = this.$$value;
      this.$$value = value;
      this._applyValue(value, old);
      this.emit("changeValue", {
        value: value,
        old: old,
        target: this
      });
    },

    /**
     * Sets the rating widget's value. The value will be
     * converted to the maximum or minimum if out of range.
     *
     * @param value {Number} The value of the rating.
     * @param old {Number} The previous value
     */
    _applyValue : function(value, old) {
      var children = this.getChildren("span");

      // When the value is greater than zero and no children are found
      // render the widget first. This will happen when the value is set through
      // HTML markup. [BUG #8645]
      if (value > 0 && children.length === 0) {
        this._render();
        children = this.getChildren("span");
      }

      children.removeClass(this.defaultCssClass + "-item-off")
        .slice(value, children.length)
          .addClass(this.defaultCssClass + "-item-off");
    },


    /**
     * Adds / removes spans containing the rating symbol.
     */
    _render : function() {
      var children = this.getChildren("span");
      children.setHtml(this.symbol);
      var diff = this.size - children.length;
      if (diff > 0) {
        for (var i = 0; i < diff; i++) {
          qxWeb.create("<span>" + this.symbol + "</span>")
          .on("tap", this._onTap, this)
          .addClasses([this.defaultCssClass + "-item", this.defaultCssClass + "-item-off"])
          .appendTo(this);
        }
      } else {
        for (var i = 0; i < Math.abs(diff); i++) {
          this.getChildren().getLast()
          .off("tap", this._onTap, this)
          .remove();
        }
      }
    },


    /**
     * Tap handler which updates the value depending on the selected element.
     *
     * @param e {Event} tap event
     */
    _onTap : function(e) {
      this.value = this.getChildren().indexOf(e.target) + 1;
    },


    /**
     * Attaches the keydown listener.
     * @param e {Event} The native focus event.
     */
    _onFocus : function(e) {
      qxWeb(document.documentElement).on("keydown", this._onKeyDown, this);
    },


    /**
     * Removes the keydown listener if the widget loses focus.
     *
     * @param e {Event} The native blur event.
     */
    _onBlur : function(e) {
      qxWeb(document.documentElement).off("keydown", this._onKeyDown, this);
    },


    /**
     * Changes the value if the left or right arrow key is pressed.
     *
     * @param e {Event} The native keydown event.
     */
    _onKeyDown : function(e) {
      var key = e.getKeyIdentifier();
      if (key === "Right") {
        this.value = this.value + 1;
      } else if (key === "Left") {
        this.value = this.value - 1;
      }
    },


    // overridden
    dispose : function() {
      qxWeb(document.documentElement).off("keydown", this._onKeyDown, this);
      this
        .allOff("changeValue")
        .off("focus", this._onFocus, this)
        .off("blur", this._onBlur, this)
        .getChildren("span")
          .off("tap", this._onTap, this);

      this.super(qx.ui.Widget, "dispose");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
