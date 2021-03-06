addSample(".toCollapsible", {
  html : ['<div id="collapsible-example">This is the content of the Collapsible.</div>'],
  javascript: function() {
    q("#collapsible-example").toCollapsible("Collapsible Header");
  },
  executable: true,
  showMarkup: true
});

addSample(".toCollapsible", {
  javascript: function() {
    var collapsible = new qx.ui.container.Collapsible("Collapsible Header");
    var label = new qx.ui.Label("This is the content of the Collapsible.");
    collapsible.append(label);

    q(document.body).append(collapsible);
  },
  executable: true,
  showMarkup: true
});
