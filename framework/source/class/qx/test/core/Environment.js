/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

qx.Class.define("qx.test.core.Environment",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    // /////////////////////////////////
    // TESTS FOR THE ENVIRONMENT CLASS
    // ////////////////////////////// //
    testGet : function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      this.assertEquals("affe", qx.core.Environment.get("affe"));
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },

    testGetAsync : function() {
      // fake the check
      qx.core.Environment.getAsyncChecks()["affe"] = function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "affe");
        }, 0);
      };

      qx.core.Environment.getAsync("affe", function(result) {
        this.resume(function() {
          this.assertEquals("affe", result);
          // clear the fake check
          delete qx.core.Environment.getAsyncChecks()["affe"];
          qx.core.Environment.invalidateCacheKey("affe");
        }, this);
      }, this);

      this.wait();
    },

    testSelect : function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      var test;
      test = qx.core.Environment.select("affe", {
        "affe" : "affe"
      });

      this.assertEquals(test, "affe");
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },

    testSelectDefault : function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      var test;
      test = qx.core.Environment.select("affe", {
        "default" : "affe"
      });

      this.assertEquals(test, "affe");
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },


    testSelectAsync :function() {
      // fake the check
      qx.core.Environment.addAsync("affe", function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "AFFE");
        }, 0);
      });


      qx.core.Environment.selectAsync("affe", {
        "affe" : function(result) {
          this.resume(function() {
            // clear the fake check
            delete qx.core.Environment.getChecks()["affe"];
            qx.core.Environment.invalidateCacheKey("affe");
            this.assertEquals("AFFE", result);
          }, this);
        }
      }, this);

      this.wait();
    },


    testCache: function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      this.assertEquals("affe", qx.core.Environment.get("affe"));
      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];

      this.assertEquals("affe", qx.core.Environment.get("affe"));

      qx.core.Environment.invalidateCacheKey("affe");
    },

    testCacheInvalidation: function() {
      // fake the check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe";
      };
      this.assertEquals("affe", qx.core.Environment.get("affe"));

      qx.core.Environment.invalidateCacheKey("affe");

      // fake another check
      qx.core.Environment.getChecks()["affe"] = function() {
        return "affe2";
      };
      this.assertEquals("affe2", qx.core.Environment.get("affe"));

      // clear the fake check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },


    testAddFunction : function() {
      qx.core.Environment.add("affe", function() {
        return "AFFE";
      });

      this.assertEquals("AFFE", qx.core.Environment.get("affe"));

      // clear the check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },


    testAddValue : function() {
      qx.core.Environment.add("affe", "AFFE");

      this.assertEquals("AFFE", qx.core.Environment.get("affe"));

      // clear the check
      delete qx.core.Environment.getChecks()["affe"];
      qx.core.Environment.invalidateCacheKey("affe");
    },


    testAddAsyncFunction : function() {
      qx.core.Environment.addAsync("affe", function(clb, self) {
        window.setTimeout(function() {
          clb.call(self, "AFFE");
        }, 0);
      });

      qx.core.Environment.getAsync("affe", function(result) {
        this.resume(function() {
          this.assertEquals("AFFE", result);
          // clear the fake check
          delete qx.core.Environment.getAsyncChecks()["affe"];
          qx.core.Environment.invalidateCacheKey("affe");
        }, this);
      }, this);

      this.wait();
    },


    testFilter : function() {
      // fake the checks
      qx.core.Environment.getChecks()["affe1"] = function() {
        return true;
      };
      qx.core.Environment.getChecks()["affe2"] = function() {
        return false;
      };
      qx.core.Environment.getChecks()["affe3"] = function() {
        return true;
      };

      var array = qx.core.Environment.filter({
        "affe1" : 1,
        "affe2" : 2,
        "affe3" : 3
      });

      this.assertEquals(2, array.length);
      this.assertEquals(1, array[0]);
      this.assertEquals(3, array[1]);

      // clear the fake check
      delete qx.core.Environment.getChecks()["affe1"];
      delete qx.core.Environment.getChecks()["affe2"];
      delete qx.core.Environment.getChecks()["affe3"];
      qx.core.Environment.invalidateCacheKey("affe1");
      qx.core.Environment.invalidateCacheKey("affe2");
      qx.core.Environment.invalidateCacheKey("affe3");
    },

    // //////////////////////////////
    // TESTS FOR THE CHECKS
    // //////////////////////////////
    testEngineName : function() {
      this.assertNotEquals("", qx.core.Environment.get("engine.name"));
    },

    testEngineVersion : function() {
      this.assertNotEquals("", qx.core.Environment.get("engine.version"));
    },

    testBrowser : function() {
      this.assertNotEquals("", qx.core.Environment.get("browser.name"));
      this.assertNotEquals("", qx.core.Environment.get("browser.version"));

      qx.core.Environment.get("browser.documentmode");
    },

    testLocale : function() {
      this.assertNotEquals("", qx.core.Environment.get("locale"));
    },

    testVariant : function() {
      // just make sure the call is working
      qx.core.Environment.get("locale.variant");
    },

    testOS : function() {
      // just make sure the call is working
      this.assertString(qx.core.Environment.get("os.name"));
      this.assertString(qx.core.Environment.get("os.version"));
    },

    testQuicktime : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.quicktime"));
      qx.core.Environment.get("plugin.quicktime.version");
    },

    testSkype : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.skype"));
    },

    testWmv : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.windowsmedia"));
      qx.core.Environment.get("plugin.windowsmedia.version");
    },

    testDivx : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.divx"));
      qx.core.Environment.get("plugin.divx.version");
    },

    testSilverlight : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.silverlight"));
      qx.core.Environment.get("plugin.silverlight.version");
    },

    testFlash : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.flash"));
      qx.core.Environment.get("plugin.flash.version");
      this.assertBoolean(qx.core.Environment.get("plugin.flash.express"));
      this.assertBoolean(qx.core.Environment.get("plugin.flash.strictsecurity"));
    },

    testPdf : function()
    {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("plugin.pdf"));
      qx.core.Environment.get("plugin.pdf.version");
    },

    testIO : function() {
      // just make sure the call is working
      qx.core.Environment.get("io.maxrequests");
      this.assertBoolean(qx.core.Environment.get("io.ssl"));
    },

    testHtml : function() {
      // just make sure the call is working
      this.assertBoolean(qx.core.Environment.get("html.webworker"));
      this.assertBoolean(qx.core.Environment.get("html.geolocation"));
      this.assertBoolean(qx.core.Environment.get("html.audio"));

      this.assertString(qx.core.Environment.get("html.audio.ogg"));
      this.assertString(qx.core.Environment.get("html.audio.mp3"));
      this.assertString(qx.core.Environment.get("html.audio.wav"));
      this.assertString(qx.core.Environment.get("html.audio.aif"));
      this.assertString(qx.core.Environment.get("html.audio.au"));

      this.assertBoolean(qx.core.Environment.get("html.video"));
      this.assertString(qx.core.Environment.get("html.video.ogg"));
      this.assertString(qx.core.Environment.get("html.video.h264"));
      this.assertString(qx.core.Environment.get("html.video.webm"));
      this.assertBoolean(qx.core.Environment.get("html.classlist"));
      this.assertBoolean(qx.core.Environment.get("html.xpath"));
      this.assertBoolean(qx.core.Environment.get("html.vml"));

      this.assertBoolean(qx.core.Environment.get("html.stylesheet.createstylesheet"));
      this.assertBoolean(qx.core.Environment.get("html.stylesheet.addimport"));
      this.assertBoolean(qx.core.Environment.get("html.stylesheet.removeimport"));

      this.assertBoolean(qx.core.Environment.get("html.history.state"));
    },

    testXml : function()
    {
      this.assertBoolean(qx.core.Environment.get("xml.getelementsbytagnamens"));
      this.assertBoolean(qx.core.Environment.get("xml.attributens"));
      this.assertBoolean(qx.core.Environment.get("xml.createelementns"));
    },

    testActiveX : function() {
      this.assertBoolean(qx.core.Environment.get("plugin.activex"));
    },

    testCss : function() {
      this.assertBoolean(qx.core.Environment.get("css.placeholder"));
      var borderImage = qx.core.Environment.get("css.borderimage");
      this.assert(typeof borderImage == "string" || borderImage === null);
      var borderImageSyntax = qx.core.Environment.get("css.borderimage.standardsyntax");
      this.assert(typeof borderImageSyntax == "boolean" || borderImageSyntax === null);
      var userSelect = qx.core.Environment.get("css.userselect");
      this.assert(typeof userSelect == "string" || userSelect === null);
      var userSelectNone = qx.core.Environment.get("css.userselect.none");
      this.assert(typeof userSelectNone == "string" || userSelectNone === null);
      var userModify = qx.core.Environment.get("css.usermodify");
      this.assert(typeof userModify == "string" || userModify === null);
      var appearance = qx.core.Environment.get("css.appearance");
      this.assert(typeof appearance == "string" || appearance === null);
      var linearGradient = qx.core.Environment.get("css.gradient.linear");
      this.assert(typeof linearGradient == "string" || linearGradient === null);
      this.assertBoolean(qx.core.Environment.get("css.gradient.filter"));
      var radialGradient = qx.core.Environment.get("css.gradient.radial");
      this.assert(typeof radialGradient == "string" || radialGradient === null);
      this.assertBoolean(qx.core.Environment.get("css.gradient.legacywebkit"));
      this.assertBoolean(qx.core.Environment.get("css.pointerevents"));
    },

    testPhoneGap : function() {
      this.assertBoolean(qx.core.Environment.get("phonegap"));
      this.assertBoolean(qx.core.Environment.get("phonegap.notification"));
    },

    testEvent : function() {
      this.assertBoolean(qx.core.Environment.get("event.touch"));
      this.assertBoolean(qx.core.Environment.get("event.help"));
      this.assertBoolean(qx.core.Environment.get("event.customevent"));
      this.assertBoolean(qx.core.Environment.get("event.mouseevent"));
    },

    testEcmaScript : function() {
      var stackTrace = qx.core.Environment.get("ecmascript.error.stacktrace");
      this.assert(typeof stackTrace == "string" || stackTrace === null);
    },

    testDevice : function() {
      this.assertString(qx.core.Environment.get("device.name"));
    },

    testDeviceType : function() {
      this.assertString(qx.core.Environment.get("device.type"));
    },

    testDevicePixelRatio : function() {
      this.assertNumber(qx.core.Environment.get("device.pixelRatio"));
    },

    testJson : function() {
      this.assertBoolean(qx.core.Environment.get("json"));
    },

    testQx : function() {
      this.assertBoolean(qx.core.Environment.get("qx.allowUrlSettings"), "1");
      this.assertBoolean(qx.core.Environment.get("qx.allowUrlVariants"), "2");
      this.assertString(qx.core.Environment.get("qx.application"), "3");
      this.assertBoolean(qx.core.Environment.get("qx.nativeScrollBars"), "9");
      this.assertNumber(qx.core.Environment.get("qx.debug.property.level"), "10");
      this.assertBoolean(qx.core.Environment.get("qx.debug"), "11");
      this.assertBoolean(qx.core.Environment.get("qx.dynlocale"), "13");
      this.assertBoolean(qx.core.Environment.get("qx.mobile.nativescroll"), "15");
      this.assertBoolean(qx.core.Environment.get("qx.dynlocale"), "17");
    },


    testAnimationTransformTransition : function() {
      // smoke test... make sure the method is doing something
      qx.core.Environment.get("css.animation");
      qx.core.Environment.get("css.transform");
      qx.core.Environment.get("css.transition");

      // 3d transform support
      this.assertBoolean(qx.core.Environment.get("css.transform.3d"));
    }
  }
});
