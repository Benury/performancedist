"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _data = _interopRequireDefault(require("../data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var storageKey = "performance-bookmarklet-metrics";
var persistance = {};

var getMetrics = function getMetrics() {
  return {
    timestamp: new Date(_data["default"].perfTiming.navigationStart).toISOString(),
    url: window.location.href,
    requests: _data["default"].requestsOnly.length,
    domains: _data["default"].requestsByDomain.length,
    subDomainsOfTld: _data["default"].hostSubdomains,
    requestsToHost: _data["default"].hostRequests,
    tldAndSubdomainRequests: _data["default"].currAndSubdomainRequests,
    total: _data["default"].perfTiming.loadEventEnd - _data["default"].perfTiming.navigationStart,
    timeToFirstByte: _data["default"].perfTiming.responseStart - _data["default"].perfTiming.navigationStart,
    domContentLoading: _data["default"].perfTiming.domContentLoadedEventStart - _data["default"].perfTiming.domLoading,
    domProcessing: _data["default"].perfTiming.domComplete - _data["default"].perfTiming.domLoading
  };
};

var getStoredValues = function getStoredValues() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
};

persistance.persistanceEnabled = function () {
  return !!JSON.parse(localStorage.getItem(storageKey));
};

persistance.activatePersistance = function () {
  persistance.saveLatestMetrics();
};

persistance.deactivatePersistance = function () {
  persistance.dump();
};

persistance.saveLatestMetrics = function () {
  var data = getStoredValues();
  data.push(getMetrics());
  localStorage.setItem(storageKey, JSON.stringify(data));
};
/**
* Dump the current page metrics from the data store to the console.
*
* Example:
*    PerformanceBookmarklet.PageMetric.dump(); // Dumps the data as TSV and clears the data store.
*    PerformanceBookmarklet.PageMetric.dump(false); // Dumps the data as CSV and retains the data.
*
* @param [Boolean] clear Should the data be cleared from the data store?
*/


persistance.dump = function () {
  var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var sourceData = getStoredValues(); // Nothing to analyze. Return early.

  if (sourceData.length === 0) {
    console.log("There are no page metrics. Please tick the 'Persist Data' checkbox.");
    return;
  } // Remove the data from the data store.


  if (clear === true) {
    localStorage.removeItem(storageKey);
    console.log("Storage for %s has been cleared", storageKey);
  } //make accessible publicly only when button is pressed


  window.PerformanceBookmarklet = {
    persistedData: sourceData
  };

  if (console.table) {
    console.log("Data also accessible via %cwindow.PerformanceBookmarklet.persistedData%c:\n\n%o", "font-family:monospace", "font-family:inherit", window.PerformanceBookmarklet);
    console.table(sourceData);
  } else {
    //IE fallback
    console.log("Data also accessible via window.PerformanceBookmarklet.persistedData");
    console.dir(window.PerformanceBookmarklet.persistedData);
  }
};

var _default = persistance;
exports["default"] = _default;
//# sourceMappingURL=persistance.js.map
