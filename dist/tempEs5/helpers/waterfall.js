"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _svg = _interopRequireDefault(require("../helpers/svg"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Helper to create waterfall timelines
*/
var waterfall = {}; //model for block and segment

waterfall.timeBlock = function (name, start, end, cssClass, segments, rawResource) {
  return {
    name: name,
    start: start,
    end: end,
    total: typeof start !== "number" || typeof end !== "number" ? undefined : end - start,
    cssClass: cssClass,
    segments: segments,
    rawResource: rawResource
  };
};

waterfall.setupTimeLine = function (durationMs, blocks, marks, lines, title) {
  var unit = durationMs / 100,
      barsToShow = blocks.filter(function (block) {
    return typeof block.start == "number" && typeof block.total == "number";
  }).sort(function (a, b) {
    return (a.start || 0) - (b.start || 0);
  }),
      maxMarkTextLength = marks.length > 0 ? marks.reduce(function (currMax, currValue) {
    return Math.max(typeof currMax == "number" ? currMax : 0, _svg["default"].getNodeTextWidth(_svg["default"].newTextEl(currValue.name, "0")));
  }) : 0,
      diagramHeight = (barsToShow.length + 1) * 25,
      chartHolderHeight = diagramHeight + maxMarkTextLength + 35;

  var chartHolder = _dom["default"].newTag("section", {
    "class": "resource-timing water-fall-holder chart-holder"
  });

  var timeLineHolder = _svg["default"].newEl("svg:svg", {
    height: Math.floor(chartHolderHeight),
    "class": "water-fall-chart"
  });

  var timeLineLabelHolder = _svg["default"].newEl("g", {
    "class": "labels"
  });

  var endLine = _svg["default"].newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    "class": "line-end"
  });

  var startLine = _svg["default"].newEl("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: diagramHeight,
    "class": "line-start"
  });

  var onRectMouseEnter = function onRectMouseEnter(evt) {
    var targetRect = evt.target;

    _dom["default"].addClass(targetRect, "active");

    var xPosEnd = targetRect.x.baseVal.valueInSpecifiedUnits + targetRect.width.baseVal.valueInSpecifiedUnits + "%";
    var xPosStart = targetRect.x.baseVal.valueInSpecifiedUnits + "%";
    endLine.x1.baseVal.valueAsString = xPosEnd;
    endLine.x2.baseVal.valueAsString = xPosEnd;
    startLine.x1.baseVal.valueAsString = xPosStart;
    startLine.x2.baseVal.valueAsString = xPosStart;

    _dom["default"].addClass(endLine, "active");

    _dom["default"].addClass(startLine, "active");

    targetRect.parentNode.appendChild(endLine);
    targetRect.parentNode.appendChild(startLine);
  };

  var onRectMouseLeave = function onRectMouseLeave(evt) {
    _dom["default"].removeClass(evt.target, "active");

    _dom["default"].removeClass(endLine, "active");

    _dom["default"].removeClass(startLine, "active");
  };

  var createRect = function createRect(width, height, x, y, cssClass, label, segments) {
    var rectHolder;

    var rect = _svg["default"].newEl("rect", {
      width: width / unit + "%",
      height: height - 1,
      x: Math.round(x / unit * 100) / 100 + "%",
      y: y,
      "class": (segments && segments.length > 0 ? "time-block" : "segment") + " " + (cssClass || "block-undefined")
    });

    if (label) {
      rect.appendChild(_svg["default"].newEl("title", {
        text: label
      })); // Add tile to wedge path
    }

    rect.addEventListener("mouseenter", onRectMouseEnter);
    rect.addEventListener("mouseleave", onRectMouseLeave);

    if (segments && segments.length > 0) {
      rectHolder = _svg["default"].newEl("g");
      rectHolder.appendChild(rect);
      segments.forEach(function (segment) {
        if (segment.total > 0 && typeof segment.start === "number") {
          rectHolder.appendChild(createRect(segment.total, 8, segment.start || 0.001, y, segment.cssClass, segment.name + " (" + Math.round(segment.start) + "ms - " + Math.round(segment.end) + "ms | total: " + Math.round(segment.total) + "ms)"));
        }
      });
      return rectHolder;
    } else {
      return rect;
    }
  };

  var createBgRect = function createBgRect(block) {
    var rect = _svg["default"].newEl("rect", {
      width: (block.total || 1) / unit + "%",
      height: diagramHeight,
      x: (block.start || 0.001) / unit + "%",
      y: 0,
      "class": block.cssClass || "block-undefined"
    });

    rect.appendChild(_svg["default"].newEl("title", {
      text: block.name
    })); // Add tile to wedge path

    return rect;
  };

  var createTimeWrapper = function createTimeWrapper() {
    var timeHolder = _svg["default"].newEl("g", {
      "class": "time-scale full-width"
    });

    for (var i = 0, secs = durationMs / 1000, secPerc = 100 / secs; i <= secs; i++) {
      var lineLabel = _svg["default"].newTextEl(i + "sec", diagramHeight);

      if (i > secs - 0.2) {
        lineLabel.setAttribute("x", secPerc * i - 0.5 + "%");
        lineLabel.setAttribute("text-anchor", "end");
      } else {
        lineLabel.setAttribute("x", secPerc * i + 0.5 + "%");
      }

      var lineEl = _svg["default"].newEl("line", {
        x1: secPerc * i + "%",
        y1: "0",
        x2: secPerc * i + "%",
        y2: diagramHeight
      });

      timeHolder.appendChild(lineEl);
      timeHolder.appendChild(lineLabel);
    }

    return timeHolder;
  };

  var renderMarks = function renderMarks() {
    var marksHolder = _svg["default"].newEl("g", {
      transform: "scale(1, 1)",
      "class": "marker-holder"
    });

    marks.forEach(function (mark, i) {
      var x = mark.startTime / unit;

      var markHolder = _svg["default"].newEl("g", {
        "class": "mark-holder"
      });

      var lineHolder = _svg["default"].newEl("g", {
        "class": "line-holder"
      });

      var lineLabelHolder = _svg["default"].newEl("g", {
        "class": "line-label-holder",
        x: x + "%"
      });

      mark.x = x;

      var lineLabel = _svg["default"].newTextEl(mark.name, diagramHeight + 25); //lineLabel.setAttribute("writing-mode", "tb");


      lineLabel.setAttribute("x", x + "%");
      lineLabel.setAttribute("stroke", "");
      lineHolder.appendChild(_svg["default"].newEl("line", {
        x1: x + "%",
        y1: 0,
        x2: x + "%",
        y2: diagramHeight
      }));

      if (marks[i - 1] && mark.x - marks[i - 1].x < 1) {
        lineLabel.setAttribute("x", marks[i - 1].x + 1 + "%");
        mark.x = marks[i - 1].x + 1;
      } //would use polyline but can't use percentage for points


      lineHolder.appendChild(_svg["default"].newEl("line", {
        x1: x + "%",
        y1: diagramHeight,
        x2: mark.x + "%",
        y2: diagramHeight + 23
      }));
      var isActive = false;

      var onLabelMouseEnter = function onLabelMouseEnter(evt) {
        if (!isActive) {
          isActive = true;

          _dom["default"].addClass(lineHolder, "active"); //firefox has issues with this


          markHolder.parentNode.appendChild(markHolder);
        }
      };

      var onLabelMouseLeave = function onLabelMouseLeave(evt) {
        isActive = false;

        _dom["default"].removeClass(lineHolder, "active");
      };

      lineLabel.addEventListener("mouseenter", onLabelMouseEnter);
      lineLabel.addEventListener("mouseleave", onLabelMouseLeave);
      lineLabelHolder.appendChild(lineLabel);
      markHolder.appendChild(_svg["default"].newEl("title", {
        text: mark.name + " (" + Math.round(mark.startTime) + "ms)"
      }));
      markHolder.appendChild(lineHolder);
      marksHolder.appendChild(markHolder);
      markHolder.appendChild(lineLabelHolder);
    });
    return marksHolder;
  };

  timeLineHolder.appendChild(createTimeWrapper());
  timeLineHolder.appendChild(renderMarks());
  lines.forEach(function (block, i) {
    timeLineHolder.appendChild(createBgRect(block));
  });
  barsToShow.forEach(function (block, i) {
    var blockWidth = block.total || 1;
    var y = 25 * i;
    timeLineHolder.appendChild(createRect(blockWidth, 25, block.start || 0.001, y, block.cssClass, block.name + " (" + block.start + "ms - " + block.end + "ms | total: " + block.total + "ms)", block.segments));

    var blockLabel = _svg["default"].newTextEl(block.name + " (" + Math.round(block.total) + "ms)", y + (block.segments ? 20 : 17));

    if ((block.total || 1) / unit > 10 && _svg["default"].getNodeTextWidth(blockLabel) < 200) {
      blockLabel.setAttribute("class", "inner-label");
      blockLabel.setAttribute("x", (block.start || 0.001) / unit + 0.5 + "%");
      blockLabel.setAttribute("width", blockWidth / unit + "%");
    } else if ((block.start || 0.001) / unit + blockWidth / unit < 80) {
      blockLabel.setAttribute("x", (block.start || 0.001) / unit + blockWidth / unit + 0.5 + "%");
    } else {
      blockLabel.setAttribute("x", (block.start || 0.001) / unit - 0.5 + "%");
      blockLabel.setAttribute("text-anchor", "end");
    }

    blockLabel.style.opacity = block.name.match(/js.map$/) ? "0.5" : "1";
    timeLineLabelHolder.appendChild(blockLabel);
  });
  timeLineHolder.appendChild(timeLineLabelHolder);

  if (title) {
    chartHolder.appendChild(_dom["default"].newTag("h1", {
      text: title
    }));
  }

  chartHolder.appendChild(timeLineHolder);
  return chartHolder;
};

var _default = waterfall;
exports["default"] = _default;
//# sourceMappingURL=waterfall.js.map
