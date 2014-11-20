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

/* ************************************************************************


************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 *
 * @asset(qx/test/script.js)
 * @asset(qx/test/jsonp_primitive.php)
 *
 * @ignore(myExistingCallback)
 */

describe("io.request.JsonpLowLevel", function() {

  beforeEach(function() {
    this.require(["php"]);

    var req = this.req = new qx.io.request.Jsonp();
    this.url = this.getUrl("qx/test/jsonp_primitive.php");
  });


  afterEach(function() {
    window.SCRIPT_LOADED = undefined;
    this.getSandbox().restore();
    this.req.dispose();
  });

  //
  // Callback
  //

  it("callbackParam", function() {
    var req = this.req;

    req.callbackParam = "myMethod";
    req.url = this.url;
    req.send();

    assert.match(req.getGeneratedUrl(), /(myMethod=)/);
  });


  it("callbackName", function() {
    var req = this.req;

    req.callbackName = "myCallback";
    req.url = this.url;
    req.send();

    assert.match(req.getGeneratedUrl(), /(=myCallback)/);
  });


  it("has default callback param and name", function() {
    var req = this.req,
      regExp;

    req.url = this.url;
    req.send();

    // String is URL encoded
    regExp = /\?callback=qx\.io\.request\.Jsonp.*\d{16,}.*\.callback/;
    assert.match(req.getGeneratedUrl(), regExp);
  });

  /**
   * @ignore(myExistingCallback)
   */


  it("not overwrite existing callback", function() {
    var that = this;

    // User provided callback that must not be overwritten
    window.myExistingCallback = function() {
      return "Affe";
    };

    this.req.callbackName = "myExistingCallback";

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal("Affe", myExistingCallback());
        window.myExistingCallback = undefined;
      });
    });

    this.request();
    this.wait();
  });

  //
  // Properties
  //

  it("response holds response with default callback", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        var data = this.req.response;
        assert.isObject(data);
        assert.isTrue(data["boolean"]);
      });
    });

    this.request();
    this.wait();
  });


  it("reset response when reopened", function() {
    var req = this.req,
      that = this;

    req.on("load", function() {
      that.resume(function() {
        req._open("GET", "/url");
        assert.isNull(req.response);
      });
    });

    this.request();
    this.wait();
  });


  it("status indicates success when default callback called", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal(200, that.req.status);
      });
    });

    this.request();
    this.wait();
  });


  it("status indicates success when custom callback called", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal(200, that.req.status);
      });
    });

    this.req.callbackName = "myCallback";
    this.request();
    this.wait();
  });

  // Error handling

  it("status indicates failure when default callback not called", function() {
    var that = this;

    this.req.on("error", function() {
      that.resume(function() {
        assert.equal(500, that.req.status);
      });
    });

    this.request(this.getUrl("qx/test/script999.js"));
    this.wait();
  });


  it("status indicates failure when custom callback not called", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal(500, that.req.status);
      });
    });

    this.req.callbackName = "myCallback";
    this.request(this.getUrl("qx/test/script.js"));
    this.wait();
  });


  it("status indicates failure when callback not called on second request", function() {
    var count = 0,
      req = this.req,
      that = this;

    req.on("load", function() {
      count += 1;

      if (count == 2) {
        that.resume(function() {
          assert.equal(500, req.status);
        });
        return;
      }

      that.request(that.getUrl("qx/test/script.js"));
    });

    this.request();
    this.wait();
  });

  //
  // Event handlers
  //



  it("call onload", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {});
    });

    this.request();
    this.wait();
  });

  // Error handling



  it("call onerror on network error", function() {
    var that = this;

    // For legacy IEs, timeout needs to be lower than browser timeout
    // or false "load" is fired. Alternatively, a false "load"
    // can be identified by checking status property.
    if (qx.core.Environment.get("engine.name") == "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9) {
      this.req.timeout = 2000;
    }

    this.req.on("error", function() {
      that.resume(function() {});
    });

    this.request("http://fail.tld");
    this.wait(15000 + 100);
  });


  it("call onloadend on network error", function() {
    var that = this;

    this.req.on("loadend", function() {
      that.resume(function() {});
    });

    this.request("http://fail.tld");
    this.wait(15000 + 100);
  });

  function request(customUrl) {
    this.req.url = customUrl || this.url;
    this.req.send();
  }

  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }


});
