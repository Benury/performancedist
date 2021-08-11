"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Tiles to summarize page performance
*/
var summaryTilesComponent = {};

summaryTilesComponent.init = function () {
  var createTile = function createTile(title, value, titleFontSize) {
    titleFontSize = titleFontSize || 60;

    var dl = _dom["default"].newTag("dl", {
      "class": "summary-tile"
    });

    dl.appendChild(_dom["default"].newTag("dt", {
      childElement: title
    }));
    dl.appendChild(_dom["default"].newTag("dd", {
      childElement: value
    }, "font-size:" + titleFontSize + "px;"));
    return dl;
  };

  var createAppendixDefValue = function createAppendixDefValue(a, definition, value) {
    a.appendChild(_dom["default"].newTag("dt", {
      childElement: definition
    }));
    a.appendChild(_dom["default"].newTag("dd", {
      text: value
    }));
  };

  var tilesHolder = _dom["default"].newTag("section", {
    "class": "tiles-holder chart-holder"
  });

  var appendix = _dom["default"].newTag("dl", {
    "class": "summary-tile-appendix"
  });

  [createTile("Requests", _data["default"].requestsOnly.length || "0"), createTile("Domains", _data["default"].requestsByDomain.length || "0"), createTile(_dom["default"].combineNodes("Subdomains of ", _dom["default"].newTag("abbr", {
    title: "Top Level Domain",
    text: "TLD"
  })), _data["default"].hostSubdomains || "0"), createTile(_dom["default"].combineNodes("Requests to ", _dom["default"].newTag("span", {
    title: location.host,
    text: "Host"
  })), _data["default"].hostRequests || "0"), createTile(_dom["default"].combineNodes(_dom["default"].newTag("abbr", {
    title: "Top Level Domain",
    text: "TLD"
  }), " & Subdomain Requests"), _data["default"].currAndSubdomainRequests || "0"), createTile("Total2", _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.navigationStart + "ms", 40), createTile("Time to First Byte", _data["default"].perfTiming.responseStart - _data["default"].perfTiming.navigationStart + "ms", 40), createTile(_dom["default"].newTag("span", {
    title: "domLoading to domContentLoadedEventStart",
    text: "DOM Content Loading"
  }), _data["default"].perfTiming.domContentLoadedEventStart - _data["default"].perfTiming.domLoading + "ms", 40), createTile(_dom["default"].newTag("span", {
    title: "domLoading to loadEventStart",
    text: "DOM Processing"
  }), _data["default"].perfTiming.domComplete - _data["default"].perfTiming.domLoading + "ms", 40)].forEach(function (tile) {
    tilesHolder.appendChild(tile);
  });

  if (_data["default"].allResourcesCalc.length > 0) {
    tilesHolder.appendChild(createTile(_dom["default"].newTag("span", {
      title: _data["default"].slowestCalls[0].name,
      text: "Slowest Call"
    }), _dom["default"].newTag("span", {
      title: _data["default"].slowestCalls[0].name,
      text: Math.floor(_data["default"].slowestCalls[0].duration) + "ms"
    }), 40));
    tilesHolder.appendChild(createTile("Average Call", _data["default"].average + "ms", 40));
  }

  createAppendixDefValue(appendix, _dom["default"].newTag("abbr", {
    title: "Top Level Domain",
    text: "TLD"
  }, location.host.split(".").slice(-2).join(".")));
  createAppendixDefValue(appendix, _dom["default"].newTextNode("Host:"), location.host);
  createAppendixDefValue(appendix, _dom["default"].newTextNode("document.domain:"), document.domain);
  tilesHolder.appendChild(appendix);
  return tilesHolder;
};

var _default = summaryTilesComponent;
exports["default"] = _default;
//# sourceMappingURL=summaryTiles.js.map
