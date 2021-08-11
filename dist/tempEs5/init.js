"use strict";

var _data = _interopRequireDefault(require("./data"));

var _iFrameHolder = _interopRequireDefault(require("./helpers/iFrameHolder"));

var _summaryTiles = _interopRequireDefault(require("./components/summaryTiles"));

var _navigationTimeline = _interopRequireDefault(require("./components/navigationTimeline"));

var _pieChart = _interopRequireDefault(require("./components/pieChart"));

var _table = _interopRequireDefault(require("./components/table"));

var _resourcesTimeline = _interopRequireDefault(require("./components/resourcesTimeline"));

var _legend = _interopRequireDefault(require("./components/legend"));

var _pageMetric = _interopRequireDefault(require("./components/pageMetric"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  //skip browser internal pages or when data is invalid
  if (location.protocol === "about:" || !_data["default"].isValid()) {
    return;
  }

  var onIFrameReady = function onIFrameReady(addComponentFn) {
    [_summaryTiles["default"].init(), _navigationTimeline["default"].init(), _pieChart["default"].init(), _table["default"].init(), _resourcesTimeline["default"].init(), _legend["default"].init(), _pageMetric["default"].init()].forEach(function (componentBody) {
      addComponentFn(componentBody);
    });
  };

  _iFrameHolder["default"].setup(onIFrameReady);
})();
//# sourceMappingURL=init.js.map
