"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

var _tableLogger = _interopRequireDefault(require("../helpers/tableLogger"));

var _waterfall = _interopRequireDefault(require("../helpers/waterfall"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Logic for Naviagtion Timing API and Markers Waterfall
*/
var navigationTimelineComponent = {};

navigationTimelineComponent.init = function () {
  var startTime = _data["default"].perfTiming.navigationStart;
  var perfTimingCalc = {
    "pageLoadTime": _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.navigationStart,
    "output": []
  };

  for (var perfProp in _data["default"].perfTiming) {
    if (_data["default"].perfTiming[perfProp] && typeof _data["default"].perfTiming[perfProp] === "number") {
      perfTimingCalc[perfProp] = _data["default"].perfTiming[perfProp] - startTime;
      perfTimingCalc.output.push({
        "name": perfProp,
        "time (ms)": _data["default"].perfTiming[perfProp] - startTime
      });
    }
  }

  perfTimingCalc.output.sort(function (a, b) {
    return (a["time (ms)"] || 0) - (b["time (ms)"] || 0);
  });
  perfTimingCalc.blocks = [_waterfall["default"].timeBlock("Total", 0, perfTimingCalc.pageLoadTime, "block-total"), _waterfall["default"].timeBlock("Unload", perfTimingCalc.unloadEventStart, perfTimingCalc.unloadEventEnd, "block-unload"), _waterfall["default"].timeBlock("Redirect (" + performance.navigation.redirectCount + "x)", perfTimingCalc.redirectStart, perfTimingCalc.redirectEnd, "block-redirect"), _waterfall["default"].timeBlock("App cache", perfTimingCalc.fetchStart, perfTimingCalc.domainLookupStart, "block-appcache"), _waterfall["default"].timeBlock("DNS", perfTimingCalc.domainLookupStart, perfTimingCalc.domainLookupEnd, "block-dns"), _waterfall["default"].timeBlock("TCP", perfTimingCalc.connectStart, perfTimingCalc.connectEnd, "block-tcp"), _waterfall["default"].timeBlock("Time to First Byte", perfTimingCalc.requestStart, perfTimingCalc.responseStart, "block-ttfb"), _waterfall["default"].timeBlock("Response", perfTimingCalc.responseStart, perfTimingCalc.responseEnd, "block-response"), _waterfall["default"].timeBlock("DOM Processing", perfTimingCalc.domLoading, perfTimingCalc.domComplete, "block-dom"), _waterfall["default"].timeBlock("domContentLoaded Event", perfTimingCalc.domContentLoadedEventStart, perfTimingCalc.domContentLoadedEventEnd, "block-dom-content-loaded"), _waterfall["default"].timeBlock("onload Event", perfTimingCalc.loadEventStart, perfTimingCalc.loadEventEnd, "block-onload")];

  if (perfTimingCalc.secureConnectionStart) {
    perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("SSL", perfTimingCalc.secureConnectionStart, perfTimingCalc.connectEnd, "block-ssl"));
  }

  if (perfTimingCalc.msFirstPaint) {
    perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("msFirstPaint Event", perfTimingCalc.msFirstPaint, perfTimingCalc.msFirstPaint, "block-ms-first-paint-event"));
  }

  if (perfTimingCalc.domInteractive) {
    perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("domInteractive Event", perfTimingCalc.domInteractive, perfTimingCalc.domInteractive, "block-dom-interactive-event"));
  }

  if (!perfTimingCalc.redirectEnd && !perfTimingCalc.redirectStart && perfTimingCalc.fetchStart > perfTimingCalc.navigationStart) {
    perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("Cross-Domain Redirect (and/or other Delay)", perfTimingCalc.navigationStart, perfTimingCalc.fetchStart, "block-redirect"));
  }

  perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("Network/Server", perfTimingCalc.navigationStart, perfTimingCalc.responseStart, "block-network-server")); //add measures to be added as bars

  _data["default"].measures.forEach(function (measure) {
    perfTimingCalc.blocks.push(_waterfall["default"].timeBlock("measure:" + measure.name, Math.round(measure.startTime), Math.round(measure.startTime + measure.duration), "block-custom-measure"));
  });

  _tableLogger["default"].logTables([{
    name: "Navigation Timeline",
    data: perfTimingCalc.blocks,
    columns: ["name", "start", "end", "total"]
  }, {
    name: "Navigation Events",
    data: perfTimingCalc.output
  }, {
    name: "Marks",
    data: _data["default"].marks,
    columns: ["name", "startTime", "duration"]
  }]);

  return _waterfall["default"].setupTimeLine(Math.round(perfTimingCalc.pageLoadTime), perfTimingCalc.blocks, _data["default"].marks, [], "Navigation Timing");
};

var _default = navigationTimelineComponent;
exports["default"] = _default;
//# sourceMappingURL=navigationTimeline.js.map
