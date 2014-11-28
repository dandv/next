"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

/**
 * This is a date picker widget used to combine an input element with a calendar widget
 * to select a date. The calendar itself is opened as popup to save visual space.
 *
 * @require(qx.module.Template)
 * @require(qx.module.Placement)
 * @require(qx.ui.control.Calendar)
 *
 * @group (Widget)
 */
qx.Class.define("qx.ui.form.DatePicker", {
  extend: qx.ui.form.Input,

  include: [
    qx.ui.form.MText
  ],

  properties: {

    /**
     * Path to an icon which will be placed next to the input element as
     * an additional opener. If configured, an <code>img</code> element
     * is created and equipped with the <code>qx-datepicker-icon</code>
     * CSS class to style it.
     */
    icon: {
      check: "String",
      nullable: true,
      init: null,
      apply: "_applyIcon"
    },

    /**
     * Which control should trigger showing the date picker.
     */
    mode: {
      check: function(value) {
        return ["input", "icon", "both"].indexOf(value) >= 0;
      }
    },

    /**
     * Function which is called with a JavaScript Date object instance.
     * You can provide a custom format function to manipulate the value
     * which is displayed in the associated input element.
     */
    format: {
      check: "Function"
    }
  },


  /**
   * @attach {qxWeb, toDatePicker}
   * @param date {Date} The current shown date
   * @param element {Element?null} The new date picker widget.
   * @return {qx.ui.form.DatePicker} The new date picker widget.
   */
  construct : function(date, element) {
    this.super(qx.ui.form.Input, "construct", element);

    this.format = function(date) {
      return date.toLocaleDateString();
    };

    this.__uniqueId = Math.round(Math.random() * 10000);

    delete this.readonly;
    this._applyIcon();
    this.__addInputListener(this);

    var calendarId = 'datepicker-calendar-' + this.__uniqueId;
    var calendar = qxWeb.create('<div id="' + calendarId + '"></div>').toCalendar();
    calendar.on('tap', this._onCalendarTap);
    calendar.appendTo(document.body).setStyle("display", "none");

    // create the connection between the date picker and the corresponding calendar widget
    this.__calendarId = calendarId;

    // grab tap events at the body element to be able to hide the calender popup
    // if the user taps outside
    var bodyElement = qxWeb.getDocument(this).body;
    qxWeb(bodyElement).on('tap', this._hideCalendar, this);

    // react on date selection
    calendar.on('changeValue', this._calendarChangeValue, this);

    if (date !== undefined) {
      calendar.setValue(date);
    }

    this.initMText();
  },

  members : {

    __iconId: null,
    __calendarId: null,
    __uniqueId: null,


    /**
     * Get the associated calendar widget
     * @return {qx.ui.control.Calendar} calendar widget instance
     */
    getCalendar : function() {
      return qxWeb('div#' + this.__calendarId);
    },

    /**
     * Listener which handles clicks/taps on the associated input element and
     * opens / hides the calendar.
     *
     * @param e {Event} tap event
     */
    _onTap : function(e) {
      if (!this.enabled) {
        return;
      }

      var calendar = qxWeb('div#' + this.__calendarId);

      if (calendar.getStyle("display") == "none") {
        this.getCalendar().placeTo(this, 'bottom-left').setStyle("display", "block");
      } else {
        this.getCalendar().setStyle("display", "none");
      }
    },

    /**
     * Stop tap events from reaching the body so the calendar won't close
     * @param e {Event} Tap event
     */
    _onCalendarTap : function(e) {
      e.stopPropagation();
    },

    /**
     * Listener to the body element to be able to hide the calendar if the user clicks
     * or taps outside the calendar.
     *
     * @param e {Event} tap event
     */
    _hideCalendar : function(e) {
      var target = qxWeb(e.target);

      // fast check for tap on the connected input field
      if (this.length > 0 && target.length > 0 &&
          this[0] == target[0]) {
        return;
      }

      // fast check for tap on the configured icon
      if (this.icon !== null) {
        var icon = qxWeb('#' + this.__iconId);
        if (icon.length > 0 && target.length > 0 &&
            icon[0] == target[0]) {
          return;
        }
      }

      // otherwise check if the target is a child of the (rendered) calendar
      if (this.getCalendar().isRendered()) {
        if (target.isChildOf(this.getCalendar()) === false) {
          this.getCalendar().setStyle("display", "none");
        }
      }
    },

    /**
     * Listens to value selection of the calendar, Whenever the user selected a day
     * we write it back to the input element and hide the calendar.
     *
     * The format of the date can be controlled with the 'format' config function
     *
     * @param e {Event} selected date value
     */
    _calendarChangeValue : function(e) {
      var formattedValue = this.format.call(this, e.value);
      this.setValue(formattedValue);
      this.getCalendar().setStyle("display", "none");
    },

    /**
     * Helper method to add / remove an icon next to the input element
     */
    _applyIcon : function() {
      var icon;

      if (this.icon === null) {
        icon = this.getNext('img#' + this.__iconId);
        if (icon.length === 1) {
          icon.off('tap', this._onTap, this);
          icon.remove();
        }
      } else {
        // check if there is already an icon
        if (!this.__iconId) {
          var iconId = 'datepicker-icon-' + this.__uniqueId;
          this.__iconId =  iconId;

          icon = qxWeb.create('<img>');

          icon.setAttributes({
            id: iconId,
            src: this.icon
          });

          icon.addClass('qx-datepicker-icon');

          var openingMode = this.mode;
          if (openingMode === 'icon' || openingMode === 'both') {
            icon.on('tap', this._onTap, this);
          }

          icon.insertAfter(this);
        }

      }
    },

    /**
     * Helper method to add a listener to the connected input element
     * if the configured mode is set.
     */
    __addInputListener : function() {
      if (this.mode === 'icon') {
        this.off('tap', this._onTap);
      } else {
        this.on('tap', this._onTap);
      }
    },

    // overridden
    dispose : function() {
      this.readonly = false;
      this.getNext('img#' + this.__iconId).remove();

      this.off('tap', this._onTap);

      var bodyElement = qxWeb.getDocument(this).body;
      qxWeb(bodyElement).off('tap', this._hideCalendar, this);

      this.getCalendar().off('changeValue', this._calendarChangeValue, this)
        .off('tap', this._onCalendarTap);

      var calendar = qxWeb('div#' + this.__calendarId);
      calendar.remove();
      calendar.dispose();

      this.super(qx.ui.form.Input, "dispose");
    }
  },

  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});
