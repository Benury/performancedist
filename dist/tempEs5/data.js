"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = _interopRequireDefault(require("./helpers/helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _isValid = true;
var data = {
  resources: [],
  marks: [],
  measures: [],
  perfTiming: [],
  allResourcesCalc: [],
  isValid: function isValid() {
    return _isValid;
  }
};

var supportsFeatures = function supportsFeatures() {
  //Check if the browser suppots the timing APIs
  if (window.performance && window.performance.getEntriesByType !== undefined) {
    data.resources = window.performance.getEntriesByType("resource");
    data.marks = window.performance.getEntriesByType("mark");
    data.measures = window.performance.getEntriesByType("measure");
  } else if (window.performance && window.performance.webkitGetEntriesByType !== undefined) {
    data.resources = window.performance.webkitGetEntriesByType("resource");
    data.marks = window.performance.webkitGetEntriesByType("mark");
    data.measures = window.performance.webkitGetEntriesByType("measure");
  } else {
    alert("Oups, looks like this browser does not support the Resource Timing API\ncheck http://caniuse.com/#feat=resource-timing to see the ones supporting it \n\n");
    return false;
  }

  if (window.performance.timing) {
    data.perfTiming = window.performance.timing;
  } else {
    alert("Oups, looks like this browser does not support performance timing");
    return false;
  }

  if (data.perfTiming.loadEventEnd - data.perfTiming.navigationStart < 0) {
    alert("Page is still loading - please try again when page is loaded.");
    return false;
  }

  return true;
};

(function () {
  _isValid = supportsFeatures();
  data.allResourcesCalc = data.resources //remove this bookmarklet from the result
  .filter(function (currR) {
    return !currR.name.match(/http[s]?\:\/\/(micmro|nurun).github.io\/performance-bookmarklet\/.*/);
  }).map(function (currR, i, arr) {
    //crunch the resources data into something easier to work with
    var isRequest = currR.name.indexOf("http") === 0;
    var urlFragments, maybeFileName, fileExtension;

    if (isRequest) {
      urlFragments = currR.name.match(/:\/\/(.[^/]+)([^?]*)\??(.*)/);
      maybeFileName = urlFragments[2].split("/").pop();
      fileExtension = maybeFileName.substr((Math.max(0, maybeFileName.lastIndexOf(".")) || Infinity) + 1);
    } else {
      urlFragments = ["", location.host];
      fileExtension = currR.name.split(":")[0];
    }

    var currRes = {
      name: currR.name,
      domain: urlFragments[1],
      initiatorType: currR.initiatorType || fileExtension || "SourceMap or Not Defined",
      fileExtension: fileExtension || "XHR or Not Defined",
      loadtime: currR.duration,
      fileType: _helpers["default"].getFileType(fileExtension, currR.initiatorType),
      isRequestToHost: urlFragments[1] === location.host
    };

    for (var attr in currR) {
      if (typeof currR[attr] !== "function") {
        currRes[attr] = currR[attr];
      }
    }

    if (currR.requestStart) {
      currRes.requestStartDelay = currR.requestStart - currR.startTime;
      currRes.dns = currR.domainLookupEnd - currR.domainLookupStart;
      currRes.tcp = currR.connectEnd - currR.connectStart;
      currRes.ttfb = currR.responseStart - currR.startTime;
      currRes.requestDuration = currR.responseStart - currR.requestStart;
    }

    if (currR.secureConnectionStart) {
      currRes.ssl = currR.connectEnd - currR.secureConnectionStart;
    }

    return currRes;
  }); //filter out non-http[s] and sourcemaps

  data.requestsOnly = data.allResourcesCalc.filter(function (currR) {
    return currR.name.indexOf("http") === 0 && !currR.name.match(/js.map$/);
  }); //get counts

  data.initiatorTypeCounts = _helpers["default"].getItemCount(data.requestsOnly.map(function (currR, i, arr) {
    return currR.initiatorType || currR.fileExtension;
  }), "initiatorType");
  data.initiatorTypeCountHostExt = _helpers["default"].getItemCount(data.requestsOnly.map(function (currR, i, arr) {
    return (currR.initiatorType || currR.fileExtension) + " " + (currR.isRequestToHost ? "(host)" : "(external)");
  }), "initiatorType");
  data.requestsByDomain = _helpers["default"].getItemCount(data.requestsOnly.map(function (currR, i, arr) {
    return currR.domain;
  }), "domain");
  data.fileTypeCountHostExt = _helpers["default"].getItemCount(data.requestsOnly.map(function (currR, i, arr) {
    return currR.fileType + " " + (currR.isRequestToHost ? "(host)" : "(external)");
  }), "fileType");
  data.fileTypeCounts = _helpers["default"].getItemCount(data.requestsOnly.map(function (currR, i, arr) {
    return currR.fileType;
  }), "fileType");
  var tempResponseEnd = {}; //TODO: make immutable

  data.requestsOnly.forEach(function (currR) {
    var entry = data.requestsByDomain.filter(function (a) {
      return a.domain == currR.domain;
    })[0] || {};
    var lastResponseEnd = tempResponseEnd[currR.domain] || 0;
    currR.duration = entry.duration || currR.responseEnd - currR.startTime;

    if (lastResponseEnd <= currR.startTime) {
      entry.durationTotalParallel = (entry.durationTotalParallel || 0) + currR.duration;
    } else if (lastResponseEnd < currR.responseEnd) {
      entry.durationTotalParallel = (entry.durationTotalParallel || 0) + (currR.responseEnd - lastResponseEnd);
    }

    tempResponseEnd[currR.domain] = currR.responseEnd || 0;
    entry.durationTotal = (entry.durationTotal || 0) + currR.duration;
  }); //Request counts

  data.hostRequests = data.requestsOnly.filter(function (domain) {
    return domain.domain === location.host;
  }).length;
  data.currAndSubdomainRequests = data.requestsOnly.filter(function (domain) {
    return domain.domain.split(".").slice(-2).join(".") === location.host.split(".").slice(-2).join(".");
  }).length;
  data.crossDocDomainRequests = data.requestsOnly.filter(function (domain) {
    return !_helpers["default"].endsWith(domain.domain, document.domain);
  }).length;
  data.hostSubdomains = data.requestsByDomain.filter(function (domain) {
    return _helpers["default"].endsWith(domain.domain, location.host.split(".").slice(-2).join(".")) && domain.domain !== location.host;
  }).length;
  data.slowestCalls = [];
  data.average = undefined;

  if (data.allResourcesCalc.length > 0) {
    data.slowestCalls = data.allResourcesCalc.filter(function (a) {
      return a.name !== location.href;
    }).sort(function (a, b) {
      return b.duration - a.duration;
    });
    data.average = Math.floor(data.slowestCalls.reduceRight(function (a, b) {
      if (typeof a !== "number") {
        return a.duration + b.duration;
      }

      return a + b.duration;
    }) / data.slowestCalls.length);
  }
})();

var _default = data;
exports["default"] = _default;
//# sourceMappingURL=data.js.map
