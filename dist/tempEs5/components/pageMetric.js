"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dom = _interopRequireDefault(require("../helpers/dom"));

var _persistance = _interopRequireDefault(require("../helpers/persistance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Section to allow persistance of subset values
*/
var pageMetricComponent = {}; //init UI

pageMetricComponent.init = function () {
  //persistance is off by default
  var persistanceEnabled = _persistance["default"].persistanceEnabled();

  var chartHolder = _dom["default"].newTag("section", {
    "class": "page-metric chart-holder"
  });

  chartHolder.appendChild(_dom["default"].newTag("h3", {
    text: "Persist Data"
  }));

  var persistDataCheckboxLabel = _dom["default"].newTag("label", {
    text: " Persist Data?"
  });

  var persistDataCheckbox = _dom["default"].newTag("input", {
    type: "checkbox",
    id: "persist-data-checkbox",
    checked: persistanceEnabled
  });

  var printDataButton = _dom["default"].newTag("button", {
    text: "Dumb data to console",
    disabled: !persistanceEnabled
  }); //hook up events


  persistDataCheckbox.addEventListener("change", function (evt) {
    var checked = evt.target.checked;

    if (checked) {
      _persistance["default"].activatePersistance();

      printDataButton.disabled = false;
    } else if (window.confirm("this will wipe out all stored data")) {
      _persistance["default"].deactivatePersistance();

      printDataButton.disabled = true;
    } else {
      evt.target.checked = true;
    }
  });
  persistDataCheckboxLabel.insertBefore(persistDataCheckbox, persistDataCheckboxLabel.firstChild);
  printDataButton.addEventListener("click", function (evt) {
    _persistance["default"].dump(false);
  });
  chartHolder.appendChild(persistDataCheckboxLabel);
  chartHolder.appendChild(printDataButton);

  if (persistanceEnabled) {
    _persistance["default"].saveLatestMetrics();
  }

  return chartHolder;
};

var _default = pageMetricComponent;
exports["default"] = _default;
//# sourceMappingURL=pageMetric.js.map
