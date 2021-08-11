"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

var _waterfall = _interopRequireDefault(require("../helpers/waterfall"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var resourcesTimelineComponent = {};

var getChartData = function getChartData(filter) {
  var calc = {
    pageLoadTime: _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.responseStart,
    lastResponseEnd: _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.responseStart
  };

  for (var perfProp in _data["default"].perfTiming) {
    if (_data["default"].perfTiming[perfProp] && typeof _data["default"].perfTiming[perfProp] === "number") {
      calc[perfProp] = _data["default"].perfTiming[perfProp] - _data["default"].perfTiming.navigationStart;
    }
  }

  var onDomLoad = _waterfall["default"].timeBlock("domContentLoaded Event", calc.domContentLoadedEventStart, calc.domContentLoadedEventEnd, "block-dom-content-loaded");

  var onLoadEvt = _waterfall["default"].timeBlock("Onload Event", calc.loadEventStart, calc.loadEventEnd, "block-onload");

  var navigationApiTotal = [_waterfall["default"].timeBlock("Unload", calc.unloadEventStart, calc.unloadEventEnd, "block-unload"), _waterfall["default"].timeBlock("Redirect", calc.redirectStart, calc.redirectEnd, "block-redirect"), _waterfall["default"].timeBlock("App cache", calc.fetchStart, calc.domainLookupStart, "block-appcache"), _waterfall["default"].timeBlock("DNS", calc.domainLookupStart, calc.domainLookupEnd, "block-dns"), _waterfall["default"].timeBlock("TCP", calc.connectStart, calc.connectEnd, "block-tcp"), _waterfall["default"].timeBlock("Timer to First Byte", calc.requestStart, calc.responseStart, "block-ttfb"), _waterfall["default"].timeBlock("Response", calc.responseStart, calc.responseEnd, "block-response"), _waterfall["default"].timeBlock("DOM Processing", calc.domLoading, calc.domComplete, "block-dom"), onDomLoad, onLoadEvt];

  if (calc.secureConnectionStart) {
    navigationApiTotal.push(_waterfall["default"].timeBlock("SSL", calc.secureConnectionStart, calc.connectEnd, "block-ssl"));
  }

  if (calc.msFirstPaint) {
    navigationApiTotal.push(_waterfall["default"].timeBlock("msFirstPaint Event", calc.msFirstPaint, calc.msFirstPaint, "block-ms-first-paint-event"));
  }

  if (calc.domInteractive) {
    navigationApiTotal.push(_waterfall["default"].timeBlock("domInteractive Event", calc.domInteractive, calc.domInteractive, "block-dom-interactive-event"));
  }

  if (!calc.redirectEnd && !calc.redirectStart && calc.fetchStart > calc.navigationStart) {
    navigationApiTotal.push(_waterfall["default"].timeBlock("Cross-Domain Redirect", calc.navigationStart, calc.fetchStart, "block-redirect"));
  }

  calc.blocks = [_waterfall["default"].timeBlock("Navigation API total", 0, calc.loadEventEnd, "block-navigation-api-total", navigationApiTotal)];

  _data["default"].allResourcesCalc.filter(function (resource) {
    //do not show items up to 15 seconds after onload - else beacon ping etc make diagram useless
    return resource.startTime < calc.loadEventEnd + 15000;
  }).filter(filter || function () {
    return true;
  }).forEach(function (resource, i) {
    var segments = [_waterfall["default"].timeBlock("Redirect", resource.redirectStart, resource.redirectEnd, "block-redirect"), _waterfall["default"].timeBlock("DNS Lookup", resource.domainLookupStart, resource.domainLookupEnd, "block-dns"), _waterfall["default"].timeBlock("Initial Connection (TCP)", resource.connectStart, resource.connectEnd, "block-dns"), _waterfall["default"].timeBlock("secureConnect", resource.secureConnectionStart || undefined, resource.connectEnd, "block-ssl"), _waterfall["default"].timeBlock("Timer to First Byte", resource.requestStart, resource.responseStart, "block-ttfb"), _waterfall["default"].timeBlock("Content Download", resource.responseStart || undefined, resource.responseEnd, "block-response")];
    var resourceTimings = [0, resource.redirectStart, resource.domainLookupStart, resource.connectStart, resource.secureConnectionStart, resource.requestStart, resource.responseStart];
    var firstTiming = resourceTimings.reduce(function (currMinTiming, currentValue) {
      if (currentValue > 0 && (currentValue < currMinTiming || currMinTiming <= 0) && currentValue != resource.startTime) {
        return currentValue;
      } else {
        return currMinTiming;
      }
    });

    if (resource.startTime < firstTiming) {
      segments.unshift(_waterfall["default"].timeBlock("Stalled/Blocking", resource.startTime, firstTiming, "block-blocking"));
    }

    calc.blocks.push(_waterfall["default"].timeBlock(resource.name, resource.startTime, resource.responseEnd, "block-" + resource.initiatorType, segments, resource));
    calc.lastResponseEnd = Math.max(calc.lastResponseEnd, resource.responseEnd);
  });

  return {
    loadDuration: Math.round(Math.max(calc.lastResponseEnd, _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.navigationStart)),
    blocks: calc.blocks,
    bg: [onDomLoad, onLoadEvt]
  };
};

resourcesTimelineComponent.init = function () {
  var chartData = getChartData();

  var chartHolder = _waterfall["default"].setupTimeLine(chartData.loadDuration, chartData.blocks, _data["default"].marks, chartData.bg, "Resource Timing");

  if (_data["default"].requestsByDomain.length > 1) {
    var selectBox = _dom["default"].newTag("select", {
      "class": "domain-selector",
      onchange: function onchange() {
        var domain = _this.options[_this.selectedIndex].value;

        if (domain === "all") {
          chartData = getChartData();
        } else {
          chartData = getChartData(function (resource) {
            return resource.domain === domain;
          });
        }

        var tempChartHolder = _waterfall["default"].setupTimeLine(chartData.loadDuration, chartData.blocks, _data["default"].marks, chartData.bg, "Temp");

        var oldSVG = chartHolder.getElementsByClassName("water-fall-chart")[0];
        var newSVG = tempChartHolder.getElementsByClassName("water-fall-chart")[0];
        chartHolder.replaceChild(newSVG, oldSVG);
      }
    });

    selectBox.appendChild(_dom["default"].newTag("option", {
      text: "show all",
      value: "all"
    }));

    _data["default"].requestsByDomain.forEach(function (domain) {
      selectBox.appendChild(_dom["default"].newTag("option", {
        text: domain.domain
      }));
    });

    var chartSvg = chartHolder.getElementsByClassName("water-fall-chart")[0];
    chartSvg.parentNode.insertBefore(selectBox, chartSvg);
  }

  return chartHolder;
};

var _default = resourcesTimelineComponent;
exports["default"] = _default;
//# sourceMappingURL=resourcesTimeline.js.map
