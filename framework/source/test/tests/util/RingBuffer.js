/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Carsten Lergenmueller (carstenl)

************************************************************************ */

describe("util.RingBuffer", function () {

  it("Add", function () {
    var max = 3;
    var buf = new qx.util.RingBuffer(max);

    buf.addEntry(1);
    sinonSandbox.spy()(1, buf.getAllEntries().length);

    buf.addEntry(2);
    sinonSandbox.spy()(2, buf.getAllEntries().length);

    buf.addEntry(3);
    sinonSandbox.spy()(3, buf.getAllEntries().length);

    buf.addEntry(4);

    var allEntries = buf.getAllEntries();
    sinonSandbox.spy()(3, allEntries.length);

    sinonSandbox.spy()(allEntries[0], 2);
    sinonSandbox.spy()(allEntries[1], 3);
    sinonSandbox.spy()(allEntries[2], 4);
  });


  it("AddMany", function () {
    var max = 3;
    var buf = new qx.util.RingBuffer(max);

    for (var i = 0; i <= 1003; i++) {
      buf.addEntry(i);
    }

    var allEntries = buf.getAllEntries();
    sinonSandbox.spy()(3, allEntries.length);

    sinonSandbox.spy()(allEntries[0], 1001);
    sinonSandbox.spy()(allEntries[1], 1002);
    sinonSandbox.spy()(allEntries[2], 1003);
  });


  it("Get", function () {
    var max = 7;
    var buf = new qx.util.RingBuffer(max);

    buf.addEntry(1);
    buf.addEntry(2);
    buf.addEntry(3);
    buf.addEntry(5);
    buf.addEntry(6);
    buf.addEntry(7);
    buf.addEntry(8);
    buf.addEntry(9);
    buf.addEntry(10);

    var entries = buf.getEntries(4);
    sinonSandbox.spy()(4, entries.length);

    sinonSandbox.spy()(entries[0], 7);
    sinonSandbox.spy()(entries[1], 8);
    sinonSandbox.spy()(entries[2], 9);
    sinonSandbox.spy()(entries[3], 10);
  });


  it("Mark", function () {
    var max = 3;
    var buf = new qx.util.RingBuffer(max);

    buf.addEntry(1);
    buf.addEntry(2);
    buf.mark();
    buf.addEntry(3);
    buf.addEntry(4);

    var entriesSinceMark = buf.getEntries(9999, true);
    sinonSandbox.spy()(2, entriesSinceMark.length);

    sinonSandbox.spy()(entriesSinceMark[0], 3);
    sinonSandbox.spy()(entriesSinceMark[1], 4);
  });


  it("Clear", function () {
    var max = 3;
    var buf = new qx.util.RingBuffer(max);

    buf.addEntry(1);
    buf.addEntry(2);
    buf.addEntry(3);
    buf.addEntry(4);

    sinonSandbox.spy()(3, buf.getAllEntries().length);

    buf.clear();

    sinonSandbox.spy()(0, buf.getAllEntries().length);
  });


  it("DataTypes", function () {
    var max = 6;
    var buf = new qx.util.RingBuffer(max);

    buf.addEntry(1);
    buf.addEntry(2);
    buf.addEntry(3);

    buf.addEntry(null);
    buf.addEntry(buf);
    buf.addEntry("Some string");
    buf.addEntry({"some": "map"});
    buf.addEntry(["Some array"]);
    buf.addEntry(function () {
    });

    var allEntries = buf.getAllEntries();
    sinonSandbox.spy()(6, allEntries.length);

    sinonSandbox.spy()(allEntries[0], null);
    sinonSandbox.spy()(allEntries[1], buf);
    sinonSandbox.spy()(allEntries[2], "Some string");
    sinonSandbox.spy()(allEntries[3].some, "map");
    sinonSandbox.spy()(allEntries[4][0], "Some array");
    sinonSandbox.spy()(typeof allEntries[5], "function");
  });

});