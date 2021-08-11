"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

var _helpers = _interopRequireDefault(require("../helpers/helpers"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

var _pieChartHelpers = _interopRequireDefault(require("../helpers/pieChartHelpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Logic for Request analysis pie charts
*/
var pieChartComponent = {};

pieChartComponent.init = function () {
  var chartsHolder = _dom["default"].newTag("div", {
    "class": "pie-charts-holder chart-holder"
  }); // create a chart and table section


  var setupChart = function setupChart(title, chartData, countTexts, columns, id) {
    var chartHolder = _dom["default"].newTag("div", {
      "class": "pie-chart-holder",
      id: id || ""
    });

    chartHolder.appendChild(_dom["default"].newTag("h1", {
      text: title
    }));
    chartHolder.appendChild(_pieChartHelpers["default"].createPieChart(chartData, 400));
    chartHolder.appendChild(_dom["default"].newTag("p", {
      text: "Total Requests: " + _data["default"].requestsOnly.length
    }));

    if (countTexts && countTexts.length) {
      countTexts.forEach(function (countText) {
        chartHolder.appendChild(_dom["default"].newTag("p", {
          text: countText
        }, "margin-top:-1em"));
      });
    }

    chartHolder.appendChild(_pieChartHelpers["default"].createChartTable(title, chartData, columns));
    chartsHolder.appendChild(chartHolder);
  }; // init data for charts


  var requestsUnit = _data["default"].requestsOnly.length / 100;
  var colourRangeR = "789abcdef";
  var colourRangeG = "789abcdef";
  var colourRangeB = "789abcdef"; //argument data

  var requestsByDomainData = _data["default"].requestsByDomain.map(function (sourceDomain) {
    var domain = _helpers["default"].clone(sourceDomain);

    domain.perc = domain.count / requestsUnit;
    domain.label = domain.domain;

    if (domain.domain === location.host) {
      domain.colour = "#0c0";
    } else if (domain.domain.split(".").slice(-2).join(".") === location.host.split(".").slice(-2).join(".")) {
      domain.colour = "#0a0";
    } else {
      domain.colour = _helpers["default"].getRandomColor("56789abcdef", "01234567", "abcdef");
    }

    domain.id = "reqByDomain-" + domain.label.replace(/[^a-zA-Z]/g, "-");
    domain.durationAverage = Math.round(domain.durationTotal / domain.count);
    domain.durationTotal = Math.round(domain.durationTotal);
    domain.durationTotalParallel = Math.round(domain.durationTotalParallel);
    return domain;
  });

  setupChart("Requests by Domain", requestsByDomainData, ["Domains Total: " + _data["default"].requestsByDomain.length], [{
    name: "Requests",
    field: "count"
  }, {
    name: "Avg. Duration (ms)",
    field: "durationAverage"
  }, {
    name: "Duration Parallel (ms)",
    field: "durationTotalParallel"
  }, {
    name: "Duration Sum (ms)",
    field: "durationTotal"
  }], "pie-request-by-domain");
  setupChart("Requests by Initiator Type", _data["default"].initiatorTypeCounts.map(function (initiatorType) {
    initiatorType.perc = initiatorType.count / requestsUnit;
    initiatorType.label = initiatorType.initiatorType;
    initiatorType.colour = _helpers["default"].getInitiatorOrFileTypeColour(initiatorType.initiatorType, _helpers["default"].getRandomColor(colourRangeR, colourRangeG, colourRangeB));
    initiatorType.id = "reqByInitiatorType-" + initiatorType.label.replace(/[^a-zA-Z]/g, "-");
    return initiatorType;
  }));
  setupChart("Requests by Initiator Type (host/external domain)", _data["default"].initiatorTypeCountHostExt.map(function (initiatorype) {
    var typeSegments = initiatorype.initiatorType.split(" ");
    initiatorype.perc = initiatorype.count / requestsUnit;
    initiatorype.label = initiatorype.initiatorType;
    initiatorype.colour = _helpers["default"].getInitiatorOrFileTypeColour(typeSegments[0], _helpers["default"].getRandomColor(colourRangeR, colourRangeG, colourRangeB), typeSegments[1] !== "(host)");
    initiatorype.id = "reqByInitiatorTypeLocEx-" + initiatorype.label.replace(/[^a-zA-Z]/g, "-");
    return initiatorype;
  }), ["Requests to Host: " + _data["default"].hostRequests, "Host: " + location.host]);
  setupChart("Requests by File Type", _data["default"].fileTypeCounts.map(function (fileType) {
    fileType.perc = fileType.count / requestsUnit;
    fileType.label = fileType.fileType;
    fileType.colour = _helpers["default"].getInitiatorOrFileTypeColour(fileType.fileType, _helpers["default"].getRandomColor(colourRangeR, colourRangeG, colourRangeB));
    fileType.id = "reqByFileType-" + fileType.label.replace(/[^a-zA-Z]/g, "-");
    return fileType;
  }));
  setupChart("Requests by File Type (host/external domain)", _data["default"].fileTypeCountHostExt.map(function (fileType) {
    var typeSegments = fileType.fileType.split(" ");
    fileType.perc = fileType.count / requestsUnit;
    fileType.label = fileType.fileType;
    fileType.colour = _helpers["default"].getInitiatorOrFileTypeColour(typeSegments[0], _helpers["default"].getRandomColor(colourRangeR, colourRangeG, colourRangeB), typeSegments[1] !== "(host)");
    fileType.id = "reqByFileType-" + fileType.label.replace(/[^a-zA-Z]/g, "-");
    return fileType;
  }), ["Requests to Host: " + _data["default"].hostRequests, "Host: " + location.host]);
  return chartsHolder;
};

var _default = pieChartComponent;
exports["default"] = _default;
//# sourceMappingURL=pieChart.js.map
