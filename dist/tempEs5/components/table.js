"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

var _dom = _interopRequireDefault(require("../helpers/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
Logic for Request analysis table
*/
var tableComponent = {};

tableComponent.init = function () {
  var output = _data["default"].requestsOnly.reduce(function (collectObj, currR) {
    var fileTypeData = collectObj[currR.fileType],
        initiatorTypeData;

    if (!fileTypeData) {
      fileTypeData = collectObj[currR.fileType] = {
        "fileType": currR.fileType,
        "count": 0,
        "initiatorType": {},
        "requestsToHost": 0,
        "requestsToExternal": 0
      };
    }

    initiatorTypeData = fileTypeData.initiatorType[currR.initiatorType];

    if (!initiatorTypeData) {
      initiatorTypeData = fileTypeData.initiatorType[currR.initiatorType] = {
        "initiatorType": currR.initiatorType,
        "count": 0,
        "requestsToHost": 0,
        "requestsToExternal": 0
      };
    }

    fileTypeData.count++;
    initiatorTypeData.count++;

    if (currR.isRequestToHost) {
      fileTypeData.requestsToHost++;
      initiatorTypeData.requestsToHost++;
    } else {
      fileTypeData.requestsToExternal++;
      initiatorTypeData.requestsToExternal++;
    }

    return collectObj;
  }, {});

  var sectionHolder = _dom["default"].newTag("section", {
    "class": "table-section-holder chart-holder"
  });

  sectionHolder.appendChild(_dom["default"].newTag("h1", {
    text: "Request FileTypes & Initiators"
  }));
  sectionHolder.appendChild(_dom["default"].tableFactory("filetypes-and-intiators-table", function (theadTr) {
    ["FileType", "Count", "Count Internal", "Count External", "Initiator Type", "Count by Initiator Type", "Initiator Type Internal", "Initiator Type External"].forEach(function (x) {
      theadTr.appendChild(_dom["default"].newTag("th", {
        text: x,
        width: x.indexOf("ternal") > 0 ? "12%" : ""
      }));
    });
    return theadTr;
  }, function (tbody) {
    Object.keys(output).forEach(function (key, i) {
      var fileTypeData = output[key],
          initiatorTypeKeys = Object.keys(fileTypeData.initiatorType),
          firstinitiatorTypeKey = fileTypeData.initiatorType[initiatorTypeKeys[0]],
          rowspan = initiatorTypeKeys.length;

      var tr = _dom["default"].newTag("tr", {
        "class": "file-type-row " + (fileTypeData.fileType || "other") + "-light"
      });

      [fileTypeData.fileType, fileTypeData.count, fileTypeData.requestsToHost, fileTypeData.requestsToExternal, firstinitiatorTypeKey.initiatorType, firstinitiatorTypeKey.count, firstinitiatorTypeKey.requestsToHost, firstinitiatorTypeKey.requestsToExternal].forEach(function (val, i) {
        var settings = {
          text: val
        };

        if (i < 4 && initiatorTypeKeys.length > 1) {
          settings.rowSpan = rowspan;
        } else if (i >= 4) {
          settings["class"] = (initiatorTypeKeys[0] || "other") + "-light";
        }

        tr.appendChild(_dom["default"].newTag("td", settings));
      });
      tbody.appendChild(tr);
      initiatorTypeKeys.slice(1).forEach(function (initiatorTypeKey) {
        var initiatorTypeData = fileTypeData.initiatorType[initiatorTypeKey];

        var tr2 = _dom["default"].newTag("tr", {
          "class": "initiator-type-more " + (initiatorTypeKey || "other") + "-light"
        });

        tr2.appendChild(_dom["default"].newTag("td", {
          text: initiatorTypeKey
        }));
        tr2.appendChild(_dom["default"].newTag("td", {
          text: initiatorTypeData.count
        }));
        tr2.appendChild(_dom["default"].newTag("td", {
          text: initiatorTypeData.requestsToHost
        }));
        tr2.appendChild(_dom["default"].newTag("td", {
          text: initiatorTypeData.requestsToExternal
        }));
        tbody.appendChild(tr2);
      });
    });
    return tbody;
  }));
  return sectionHolder;
};

var _default = tableComponent;
exports["default"] = _default;
//# sourceMappingURL=table.js.map
