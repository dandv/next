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
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */


/**
 * Mobile page responsible for showing the landing page for the "animation" showcase.
 */
qx.Class.define("mobileshowcase.page.AnimationLanding",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.base(mobileshowcase.page.Abstract, "constructor", true);
    this.title = "Page Transitions";
    this.showBackButtonOnTablet = true;
  },

  properties :
  {
    /**
     * The current animaton.
     */
    animation :
    {
      check : "String",
      init : ""
    }
  },

  members :
  {
    // overridden
    _initialize : function()
    {
      this.base(mobileshowcase.page.Abstract, "_initialize");


      if (this._isTablet) {
        this.on("disappear", this.__deactiveAnimation, this);
      }

      var list = new qx.ui.mobile.list.List({
        configureItem: function(item, data, row) {
          item.setTitle(data.title);
          item.showArrow = true;
        }
      });
      list.addClass("animation-list-2");

      var animationData = mobileshowcase.page.Animation.ANIMATION_DATA;

      list.model = new qx.data.Array(animationData);
      list.on("changeSelection", function(index) {
        // In Tablet Mode, animation should be shown for this showcase part.
        // On animation landing >> showAnimation is set to false.
        this._getParentWidget().getLayout().showAnimation = true;
        qx.core.Init.getApplication().getRouting().executeGet("/animation/" + animationData[index].animation);
      }, this);
      this.getContent().add(list);
    },


    /**
     * Deactivates the animation on parentContainer's layout.
     */
    __deactiveAnimation : function() {
      this._getParentWidget().getLayout().showAnimation = false;
    },


    // overridden
    _back : function()
    {
      qx.core.Init.getApplication().getRouting().executeGet("/animation", {animation:this.getAnimation(), reverse:true});
    }
  }
});