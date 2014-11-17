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
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Tests asserting behavior
 *
 * - special to io.request.Jsonp and
 * - common to io.request.* (see {@link qx.test.io.request.MRequest})
 *
 * Tests defined in MRequest run with appropriate context, i.e.
 * a transport that is an instance of qx.bom.request.Jsonp
 * (see {@link #setUpFakeTransport}).
 *
 */
qx.Class.define("qx.test.io.request.Jsonp",
{
  extend : qx.dev.unit.TestCase,

  include : [qx.test.io.request.MRequest,
             qx.dev.unit.MMock],

  construct : function() {
    this.initMMock();
  },

  members :
  {
    setUp: function() {
      this.setUpRequest();
      this.setUpFakeTransport();
    },

    setUpRequest: function() {
      this.req && this.req.dispose();
      this.req = new qx.io.request.Jsonp();
      this.req.url = "url";
    },

    // Also called in shared tests, i.e. shared tests
    // use appropriate transport
    setUpFakeTransport: function() {
      // if already stubbed just return
      if (this.req && this.req._send && this.req._send.restore) { return; }

      this.stub(this.req, "_open");
      this.stub(this.req, "_setRequestHeader");
      this.stub(this.req, "setRequestHeader");
      this.stub(this.req, "_send");
      this.stub(this.req, "_abort");
    },

    tearDown: function() {
      this.getSandbox().restore();
      this.req._dispose();

      // May fail in IE
      try { delete Klass; } catch(e) {}
    },

    //
    // General (cont.)
    //

    "test: set url property on construct": function() {
      var req = new qx.io.request.Jsonp("url");
      this.assertEquals("url", req.url);
      req._dispose();
    },

    "test: method or async should be readonly": function() {
      var req = new qx.io.request.Jsonp();
      // resetting method shouldn't be possible
      req.method = "POST";
      this.assertEquals("GET", req.method);
      req.async = false;
      this.assertTrue(req.async);
    }
  }
});
