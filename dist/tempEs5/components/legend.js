"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dom = _interopRequireDefault(require("../helpers/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Logic for Legned
*/
var legendComponent = {};

var createLegend = function createLegend(className, title, dlArray) {
  var legendHolder = _dom["default"].newTag("div", {
    "class": "legend-holder"
  });

  legendHolder.appendChild(_dom["default"].newTag("h4", {
    text: title
  }));

  var dl = _dom["default"].newTag("dl", {
    "class": "legend " + className
  });

  dlArray.forEach(function (definition) {
    dl.appendChild(_dom["default"].newTag("dt", {
      "class": "colorBoxHolder",
      childElement: _dom["default"].newTag("span", {}, "background:" + definition[1])
    }));
    dl.appendChild(_dom["default"].newTag("dd", {
      text: definition[0]
    }));
  });
  legendHolder.appendChild(dl);
  return legendHolder;
}; //Legend


legendComponent.init = function () {
  var chartHolder = _dom["default"].newTag("section", {
    "class": "resource-timing chart-holder"
  });

  chartHolder.appendChild(_dom["default"].newTag("h3", {
    text: "Legend"
  }));

  var legendsHolder = _dom["default"].newTag("div", {
    "class": "legends-group "
  });

  legendsHolder.appendChild(createLegend("initiator-type-legend", "Block color: Initiator Type", [["css", "#afd899"], ["iframe", "#85b3f2"], ["img", "#bc9dd6"], ["script", "#e7bd8c"], ["link", "#89afe6"], ["swf", "#4db3ba"], //["font", "#e96859"],
  ["xmlhttprequest", "#e7d98c"]]));
  legendsHolder.appendChild(createLegend("navigation-legend", "Navigation Timing", [["Redirect", "#ffff60"], ["App Cache", "#1f831f"], ["DNS Lookup", "#1f7c83"], ["TCP", "#e58226"], ["SSL Negotiation", "#c141cd"], ["Time to First Byte", "#1fe11f"], ["Content Download", "#1977dd"], ["DOM Processing", "#9cc"], ["DOM Content Loaded", "#d888df"], ["On Load", "#c0c0ff"]]));
  legendsHolder.appendChild(createLegend("resource-legend", "Resource Timing", [["Stalled/Blocking", "#cdcdcd"], ["Redirect", "#ffff60"], ["App Cache", "#1f831f"], ["DNS Lookup", "#1f7c83"], ["TCP", "#e58226"], ["SSL Negotiation", "#c141cd"], ["Initial Connection (TCP)", "#e58226"], ["Time to First Byte", "#1fe11f"], ["Content Download", "#1977dd"]]));
  chartHolder.appendChild(legendsHolder);
  return chartHolder;
};

var _default = legendComponent;
exports["default"] = _default;
//# sourceMappingURL=legend.js.map
