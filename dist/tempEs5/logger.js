"use strict";

var _data = _interopRequireDefault(require("./data"));

var _tableLogger = _interopRequireDefault(require("./helpers/tableLogger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_tableLogger["default"].logTable({
  name: "All loaded resources",
  data: _data["default"].allResourcesCalc,
  columns: ["name", "domain", "fileType", "initiatorType", "fileExtension", "loadtime", "isRequestToHost", "requestStartDelay", "dns", "tcp", "ttfb", "requestDuration", "ssl"]
});

_tableLogger["default"].logTables([{
  name: "Requests by domain",
  data: _data["default"].requestsByDomain
}, {
  name: "Requests by Initiator Type",
  data: _data["default"].initiatorTypeCounts,
  columns: ["initiatorType", "count", "perc"]
}, {
  name: "Requests by Initiator Type (host/external domain)",
  data: _data["default"].initiatorTypeCountHostExt,
  columns: ["initiatorType", "count", "perc"]
}, {
  name: "Requests by File Type",
  data: _data["default"].fileTypeCounts,
  columns: ["fileType", "count", "perc"]
}]);
//# sourceMappingURL=logger.js.map
