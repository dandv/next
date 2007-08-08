/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/* ************************************************************************

#module(html2)

************************************************************************ */

/**
 * Contains utilities to work with the visibility of HTML elements.
 */
qx.Class.define("qx.bom.element.Visibility",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Shows the given element
     *
     * @type static
     * @param element {Element} DOM element to show
     * @return {void}
     */
    show : function(element) {
      element.style.visibility = "visible";
    },


    /**
     * Hides the given element
     *
     * @type static
     * @param element {Element} DOM element to hide
     * @return {void}
     */
    hide : function(element) {
      element.style.visibility = "hidden";
    },


    /**
     * Toggle the visibility of the given element
     *
     * @type static
     * @param element {Element} DOM element to show
     * @return {void}
     */
    toggle : function(element) {
      element.style.visibility = this.isHidden(element) ? "visible" : "hidden";
    },


    /**
     * Whether the given element is visible
     *
     * @type static
     * @param element {Element} DOM element to query
     * @return {Boolean} true when the element is visible
     */
    isVisible : function(element) {
      return !this.isHidden(element);
    },


    /**
     * Whether the given element is hidden
     *
     * @type static
     * @param element {Element} DOM element to query
     * @return {Boolean} true when the element is hidden
     */
    isHidden : function(element) {
      return qx.html2.element.Style.getComputed(element, "visibility") === "hidden";
    }
  }
});
