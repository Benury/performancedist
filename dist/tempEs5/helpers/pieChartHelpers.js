"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = _interopRequireDefault(require("../helpers/helpers"));

var _svg = _interopRequireDefault(require("../helpers/svg"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pieChartHelpers = {};
var unit = Math.PI * 2 / 100;

var createWedge = function createWedge(id, size, startAngle, percentage, labelTxt, colour) {
  var radius = size / 2,
      endAngle = startAngle + (percentage * unit - 0.001),
      labelAngle = startAngle + (percentage / 2 * unit - 0.001),
      x1 = radius + radius * Math.sin(startAngle),
      y1 = radius - radius * Math.cos(startAngle),
      x2 = radius + radius * Math.sin(endAngle),
      y2 = radius - radius * Math.cos(endAngle),
      x3 = radius + radius * 0.85 * Math.sin(labelAngle),
      y3 = radius - radius * 0.85 * Math.cos(labelAngle),
      big = endAngle - startAngle > Math.PI ? 1 : 0;
  var d = "M " + radius + "," + radius + // Start at circle center
  " L " + x1 + "," + y1 + // Draw line to (x1,y1)
  " A " + radius + "," + radius + // Draw an arc of radius r
  " 0 " + big + " 1 " + // Arc details...
  x2 + "," + y2 + // Arc goes to to (x2,y2)
  " Z"; // Close path back to (cx,cy)

  var path = _svg["default"].newEl("path", {
    id: id,
    d: d,
    fill: colour
  });

  path.appendChild(_svg["default"].newEl("title", {
    text: labelTxt
  })); // Add tile to wedge path

  path.addEventListener("mouseenter", function (evt) {
    evt.target.style.opacity = "0.5";
    evt.target.ownerDocument.getElementById(evt.target.getAttribute("id") + "-table").style.backgroundColor = "#ccc";
  });
  path.addEventListener("mouseleave", function (evt) {
    evt.target.style.opacity = "1";
    evt.target.ownerDocument.getElementById(evt.target.getAttribute("id") + "-table").style.backgroundColor = "transparent";
  });

  if (percentage > 10) {
    var wedgeLabel = _svg["default"].newTextEl(labelTxt, y3); //first half or second half


    if (labelAngle < Math.PI) {
      wedgeLabel.setAttribute("x", x3 - _svg["default"].getNodeTextWidth(wedgeLabel));
    } else {
      wedgeLabel.setAttribute("x", x3);
    }

    return {
      path: path,
      wedgeLabel: wedgeLabel,
      endAngle: endAngle
    };
  }

  return {
    path: path,
    endAngle: endAngle
  };
};

var chartMaxHeight = function () {
  var contentWidth = window.innerWidth * 0.98 - 64;

  if (contentWidth < 700) {
    return 350;
  } else if (contentWidth < 800) {
    return contentWidth / 2 - 72;
  } else {
    return contentWidth / 3 - 72;
  }
}();

pieChartHelpers.createPieChart = function (data, size) {
  //inspired by http://jsfiddle.net/da5LN/62/
  var startAngle = 0; // init startAngle

  var chart = _svg["default"].newEl("svg:svg", {
    viewBox: "0 0 " + size + " " + size,
    "class": "pie-chart"
  }, "max-height:" + chartMaxHeight + "px;"),
      labelWrap = _svg["default"].newEl("g", {}, "pointer-events:none; font-weight:bold;"),
      wedgeWrap = _svg["default"].newEl("g"); //loop through data and create wedges


  data.forEach(function (dataObj) {
    var wedgeData = createWedge(dataObj.id, size, startAngle, dataObj.perc, dataObj.label + " (" + dataObj.count + ")", dataObj.colour || _helpers["default"].getRandomColor());
    wedgeWrap.appendChild(wedgeData.path);
    startAngle = wedgeData.endAngle;

    if (wedgeData.wedgeLabel) {
      labelWrap.appendChild(wedgeData.wedgeLabel);
    }
  }); // foreground circle

  wedgeWrap.appendChild(_svg["default"].newEl("circle", {
    cx: size / 2,
    cy: size / 2,
    r: size * 0.05,
    fill: "#fff"
  }));
  chart.appendChild(wedgeWrap);
  chart.appendChild(labelWrap);
  return chart;
};

pieChartHelpers.createChartTable = function (title, data, columns) {
  columns = columns || [{
    name: "Requests",
    field: "count"
  }]; //create table

  return _dom["default"].tableFactory("", function (thead) {
    thead.appendChild(_dom["default"].newTag("th", {
      text: title,
      "class": "text-left"
    }));
    columns.forEach(function (column) {
      thead.appendChild(_dom["default"].newTag("th", {
        text: column.name,
        "class": "text-right"
      }));
    });
    thead.appendChild(_dom["default"].newTag("th", {
      text: "Percentage",
      "class": "text-right"
    }));
    return thead;
  }, function (tbody) {
    data.forEach(function (y) {
      var row = _dom["default"].newTag("tr", {
        id: y.id + "-table"
      });

      row.appendChild(_dom["default"].newTag("td", {
        text: y.label
      }));
      columns.forEach(function (column) {
        row.appendChild(_dom["default"].newTag("td", {
          text: y[column.field].toString(),
          "class": "text-right"
        }));
      });
      row.appendChild(_dom["default"].newTag("td", {
        text: y.perc.toPrecision(2) + "%",
        "class": "text-right"
      }));
      tbody.appendChild(row);
    });
    return tbody;
  });
};

var _default = pieChartHelpers;
exports["default"] = _default;
//# sourceMappingURL=pieChartHelpers.js.map
