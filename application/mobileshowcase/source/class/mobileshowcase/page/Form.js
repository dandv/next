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
 * Mobile page responsible for showing the "form" showcase.
 */
qx.Class.define("mobileshowcase.page.Form",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.base(arguments);
    this.title = "Form";
  },


  members :
  {
    __password : null,
    __name : null,
    __info : null,
    __save : null,
    __result : null,
    __resultPopup : null,
    __closeResultPopup : null,
    __slide : null,
    __sel : null,
    __rememberPass : null,
    __radio1 : null,
    __radio2 : null,
    __form : null,
    __submitButton : null,
    __resetButton : null,
    __numberField : null,


    // overridden
    _initialize : function()
    {
      this.base(arguments);
      this.__form = this.__createForm();

      this.getContent().add(new qx.ui.mobile.form.renderer.Single(this.__form));

      this.__submitButton = this._createSubmitButton();
      this.getContent().add(this.__submitButton);

      this.__resetButton = this._createResetButton();
      this.getContent().add(this.__resetButton);

      this.__result = new qx.ui.mobile.form.Label();
      this.__result.addCssClass("registration-result");

      var popupContent = new qx.ui.mobile.container.Composite();
      this.__closeResultPopup = new qx.ui.mobile.form.Button("OK");
      this.__closeResultPopup.addListener("tap", function() {
        this.__resultPopup.hide();
      },this);

      popupContent.add(this.__result);
      popupContent.add(this.__closeResultPopup);

      this.__resultPopup = new qx.ui.mobile.dialog.Popup(popupContent);
      this.__resultPopup.title = "Registration Result";
    },


    /**
    * Factory for the Submit Button.
    * @return {qx.ui.mobile.form.Button} reset button
    */
    _createSubmitButton : function() {
      var submitButton = new qx.ui.mobile.form.Button("Submit");
      submitButton.addListener("tap", this._onSubmitButtonTap, this);
      submitButton.enabled = false;
      return submitButton;
    },


    /**
    * Factory for the Reset Button.
    * @return {qx.ui.mobile.form.Button} reset button
    */
    _createResetButton : function() {
      var resetButton = new qx.ui.mobile.form.Button("Reset");
      resetButton.addListener("tap", this._onResetButtonTap, this);
      return resetButton;
    },


    /**
     * Creates the form for this showcase.
     *
     * @return {qx.ui.mobile.form.Form} the created form.
     */
    __createForm : function()
    {
      var form = new qx.ui.mobile.form.Form();

      // NAME FIELD
      this.__name = new qx.ui.mobile.form.TextField();
      this.__name.placeholder = "Username";
      this.__name.required = true;
      this.__name.liveUpdate = true;

      form.addGroupHeader("Contact");
      form.add(this.__name, "Username");

      // PASSWORD FIELD
      this.__password = new qx.ui.mobile.form.PasswordField();
      this.__password.placeholder = "Password";
      this.__password.liveUpdate = true;
      form.add(this.__password, "Password");

      // REMEMBER PASSWORD CHECKBOX
      this.__rememberPass = new qx.ui.mobile.form.CheckBox();
      form.add(this.__rememberPass, "Remember password? ");
      this.__rememberPass.model = "password_reminder";
      this.__rememberPass.bind("model",this.__password,"value");

      this.__password.bind("value",this.__rememberPass,"model");

      // NUMBER FIELD
      this.__numberField = new qx.ui.mobile.form.NumberField();
      this.__numberField.maximum = 150;
      this.__numberField.minimum = 0;
      this.__numberField.liveUpdate = true;
      form.add(this.__numberField,"Age");

      form.addGroupHeader("Gender");
      this.__radio1 = new qx.ui.mobile.form.RadioButton();
      this.__radio2 = new qx.ui.mobile.form.RadioButton();

      var radioGroup = new qx.ui.mobile.form.RadioGroup();
      radioGroup.setAllowEmptySelection(true);
      radioGroup.add(this.__radio1, this.__radio2);
      form.add(this.__radio1, "Male");
      form.add(this.__radio2, "Female");

      form.addGroupHeader("Feedback");
      var dd = new qx.data.Array(["Web search", "From a friend", "Offline ad", "Magazine", "Twitter", "Other"]);
      var selQuestion = "How did you hear about us ?";

      this.__sel = new qx.ui.mobile.form.SelectBox();
      this.__sel.required = true;
      this.__sel.placeholder = "Unknown";
      this.__sel.setClearButtonLabel("Clear");
      this.__sel.setDialogTitle(selQuestion);
      this.__sel.model = dd;

      form.add(this.__sel, selQuestion);

      form.addGroupHeader("License");
      this.__info = new qx.ui.mobile.form.TextArea();
      this.__info.placeholder = "Terms of Service";
      this.__info.readOnly = true;
      form.add(this.__info,"Terms of Service");
      this.__info.setValue("qooxdoo Licensing Information\n=============================\n\nqooxdoo is dual-licensed under the GNU Lesser General Public License (LGPL) and the Eclipse Public License (EPL). \n The above holds for any newer qooxdoo release. Only legacy versions 0.6.4 and below were licensed solely under the GNU Lesser General Public License (LGPL). For a full understanding of your rights and obligations under these licenses, please see the full text of the LGPL and/or EPL. \n \n One important aspect of both licenses (so called \"weak copyleft\" licenses) is that if you make any modification or addition to the qooxdoo code itself, you MUST put your modification under the same license, the LGPL or EPL. \n  \n \n  \n Note that it is explicitly NOT NEEDED to put any application under the LGPL or EPL, if that application is just using qooxdoo as intended by the framework (this is where the \"weak\" part comes into play - contrast this with the GPL, which would only allow using qooxdoo to create an application that is itself governed by the GPL).");

      this.__slide = new qx.ui.mobile.form.Slider();
      this.__slide.displayValue = "percent";
      form.add(this.__slide,"Are you human? Drag the slider to prove it.");

      this.__save = new qx.ui.mobile.form.ToggleButton(false,"Agree","Reject",13);
      this.__save.addListener("changeValue", this._enableFormSubmitting, this);
      form.add(this.__save, "Agree? ");

      this._createValidationRules(form.getValidationManager());

      return form;
    },


    /**
     * Adds all validation rules of the form.
     * @param validationManager {qx.ui.form.validation.Manager} the created form.
     */
    _createValidationRules : function(validationManager) {
      // USERNAME validation
      validationManager.add(this.__name, function(value, item){
        var valid = value != null && value.length>3;
        if(!valid) {
          item.invalidMessage = "Username should have more than 3 characters!";
        }
        return valid;
      }, this);

      // PASSWORD validation
      validationManager.add(this.__password, function(value, item){
        var valid = value != null && value.length>3;
        if(!valid) {
          item.invalidMessage = "Password should have more than 3 characters!";
        }
        return valid;
      }, this);

      // AGE validation
      validationManager.add(this.__numberField, function(value, item) {
        if(value == null || value == "0") {
          item.invalidMessage = "Please enter your age.";
          return false;
        }

        if (value.length == 0 || value.match(/[\D]+/)) {
          item.invalidMessage = "Please enter a valid age.";
          return false;
        }

        if(value < item.minimum || value > item.maximum) {
          item.invalidMessage = "Value out of range: "+ item.minimum+"-"+item.maximum;
          return false;
        }
        return true;
      }, this);
    },


    _enableFormSubmitting : function(evt) {
      this.__submitButton.enabled = evt.getData();
    },


    /**  Event handler */
    _onResetButtonTap : function() {
      this.__form.reset();
    },


    /** Event handler. */
    _onSubmitButtonTap : function()
    {
      if(this.__form.validate())
      {
        var result = [];
        result.push("Username: " +  this.__name.value);
        result.push("Password: " +  this.__password.value);
        result.push("Age: " +  this.__numberField.value);
        result.push("Male: " +  this.__radio1.value);
        result.push("Female: " +  this.__radio2.value);
        result.push("Agree on our terms: " +  this.__save.value);
        result.push("How did you hear about us : " +  this.__sel.value);
        result.push("Are you human? : " +  this.__slide.value +"%");
        this.__result.value = result.join("<br>");
        this.__resultPopup.show();
      } else {
        // Scroll to invalid field.
        var invalidItems = this.__form.getInvalidItems();

        this._getScrollContainer().scrollToWidget(invalidItems[0].getLayoutParent(), 500);
      }
    },


    // overridden
    _stop : function() {
      if(this.__resultPopup) {
        this.__resultPopup.hide();
      }
      this.base(arguments);
    }
  }
});
