/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Adrian Olaru (adrianolaru)

************************************************************************ */

/* ************************************************************************
#ignore(DOMException)
************************************************************************ */

qx.Class.define("qx.test.bom.media.MediaTestCase",
{
  type : "abstract",
  extend : qx.dev.unit.TestCase,

  members :
  {
    _media: null,
    _src: null,

    _getSrc: function() {
    },

    _createMedia: function() {
    },

    _checkFeature: function() {
    },


    setUp : function() {
      this._checkFeature();

      this._src = this._getSrc();
      this._media = this._createMedia();
    },

    tearDown : function() {
      this._media.pause();
      this._media = null;
      this._src = null;
    },

    testPlayPause: function() {
      this.assertTrue(this._media.isPaused());

      this._media.play();
      this.assertFalse(this._media.isPaused());

      this._media.pause();
      this.assertTrue(this._media.isPaused());
    },

    testId: function() {
      var id = "mediaid";
      this._media.setId(id);
      this.assertEquals(id, this._media.getId());
    },

    testVolume: function() {
      var that = this;

      this._media.setVolume(1);
      this.assertEquals(1, this._media.getVolume());

      this._media.setVolume(0);
      this.assertEquals(0, this._media.getVolume());

      this.assertException(function() {
        that._media.setVolume(-1);
      }, DOMException, "INDEX_SIZE_ERR");

      this.assertException(function() {
        that._media.setVolume(2);
      }, DOMException, "INDEX_SIZE_ERR");
    },


    testMute: function() {
      this.assertFalse(this._media.isMuted());

      this._media.setMuted(true);
      this.assertTrue(this._media.isMuted());

      this._media.setMuted(false);
      this.assertFalse(this._media.isMuted());
    },

    testCurrentTime: function() {
      var that = this;
      this.assertEquals(0, this._media.getCurrentTime());
    },

    testSource: function() {
      this._media = new qx.bom.media.Audio();

      this._media.setSource(this._src);

      var _ref = this._src.split("/");
      var expectedFile = _ref[_ref.length-1];

      _ref = this._media.getSource().split("/");
      var foundFile = _ref[_ref.length-1];

      this.assertEquals(expectedFile, foundFile);
    },


    testControls: function() {
      this.assertFalse(this._media.hasControls());

      this._media.showControls();
      this.assertTrue(this._media.hasControls());

      this._media.hideControls();
      this.assertFalse(this._media.hasControls());
    },


    testAutoplay: function() {
      this.assertFalse(this._media.getAutoplay());
      this._media.setAutoplay(true);
      this.assertTrue(this._media.getAutoplay());

      this._media.setAutoplay(false);
      this.assertFalse(this._media.getAutoplay());
    },

    testGetMediaObject: function() {
      this.assertElement(this._media.getMediaObject());
    }

    //DOESN"T WORK ON IE9/Win 7, FF4/Win 7, FF3.5/Linux
    //testPreload: function() {
      ////default
      //this.assertEquals(auto, this._media.getPreload());

      //this._media.setPreload("none");
      //this.assertEquals("none", this._media.getPreload());

      //this._media.setPreload("metadata");
      //this.assertEquals("metadata", this._media.getPreload());

      //this._media.setPreload("auto");
      //this.assertEquals("auto", this._media.getPreload());

      ////the preload default is auto
      //this._media.setPreload("none");
      //this._media.setPreload("unspecified");
      //this.assertEquals(auto, this._media.getPreload());
    //},

    //testLoop: function() {
      //this.assertFalse(this._media.isLoop());

      //this._media.setLoop(true);
      //this.assertTrue(this._media.isLoop());

      //this._media.setLoop(false);
      //this.assertFalse(this._media.isLoop());
    //},




    //THEY ARE ASYNC; TEST THEM WITH wait/resume
    //testVolumeChangeEvent: function() {
      //var that = this;

      ////this work
      //this._media.addListener("volumechange", function() {
        //console.log("this works");
      //});
      //this._media.setVolume(0.3);

      ////but assert doesn't work
      //this.assertEventFired(this._media, "volumechange", function() {
        //that._media.setVolume(0.2);
      //});
    //},

    //testPlayEvent: function() {
      //var that = this;
      ////this work
      //this._media.addListener("play", function() {
        //console.log("play works");
      //});
      //this._media.play();

      ////this doesn't
      //this.assertEventFired(this._media, "play", function() {
        //that._media.play();
      //});
    //}
  }
});
