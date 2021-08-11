"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dom = _interopRequireDefault(require("../helpers/dom"));

var _style = require("../helpers/style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
iFrame and holder logic
*/

/**
 * iFrame to contain perf-bookmarklet's diagrams
 * @type {HTMLIFrameElement}
 */
var iFrameEl;
/**
 * Holder element
 * @type {HTMLDivElement}
 */

var outputHolder;
/** @type {HTMLDivElement}  */

var outputContent;
/**
 * Holder document for perf-bookmarklet (in iFrame)
 * @type {Document}
 */

var outputIFrame;
/** setup iFrame overlay */

var initHolderEl = function initHolderEl() {
  // find or create holder element
  if (!outputHolder) {
    outputHolder = _dom["default"].newTag("div", {
      id: "perfbook-holder"
    });
    outputContent = _dom["default"].newTag("div", {
      id: "perfbook-content"
    });
    window.outputContent;

    var closeBtn = _dom["default"].newTag("button", {
      "class": "perfbook-close",
      text: "close"
    });

    closeBtn.addEventListener("click", function () {
      iFrameEl.parentNode.removeChild(iFrameEl);
    });
    outputHolder.appendChild(closeBtn);
    outputHolder.appendChild(outputContent);
  } else {
    outputContent = outputIFrame.getElementById("perfbook-content"); //clear existing data

    while (outputContent.firstChild) {
      outputContent.removeChild(outputContent.firstChild);
    }
  }
};

var addComponent = function addComponent(domEl) {
  if (domEl) {
    outputContent.appendChild(domEl);
  }
};

var getOutputIFrame = function getOutputIFrame() {
  return outputIFrame;
};

var _default = {
  /**
   * @param  {function} onIFrameReady
   */
  setup: function setup(onIFrameReady) {
    iFrameEl = document.getElementById("perfbook-iframe");

    var finalize = function finalize() {
      initHolderEl();
      onIFrameReady(addComponent);
      outputIFrame.body.appendChild(outputHolder);

      if (getComputedStyle(document.body).overflow != "hidden") {
        iFrameEl.style.height = outputHolder.clientHeight + 36 + "px";
      } else {
        iFrameEl.style.height = "100%";
      }
    };

    if (iFrameEl) {
      outputIFrame = iFrameEl.contentWindow.document;
      outputHolder = outputIFrame.getElementById("perfbook-holder");
      initHolderEl();
      onIFrameReady(addComponent);
      finalize();
    } else {
      iFrameEl = _dom["default"].newTag("iframe", {
        id: "perfbook-iframe",
        onload: function onload() {
          outputIFrame = iFrameEl.contentWindow.document; //add style to iFrame

          var styleTag = _dom["default"].newTag("style", {
            type: "text/css",
            text: _style.style
          });

          outputIFrame.head.appendChild(styleTag);
          finalize();
        }
      }, "position:absolute; top:1%; right:1%; margin-bottom:1em; left:1%; z-index:6543210; width:98%; border:0; box-shadow:0 0 25px 0 rgba(0,0,0,0.5); background:#fff;");
      document.body.appendChild(iFrameEl);
    }
  },
  getOutputIFrame: getOutputIFrame
};
exports["default"] = _default;
//# sourceMappingURL=iFrameHolder.js.map
