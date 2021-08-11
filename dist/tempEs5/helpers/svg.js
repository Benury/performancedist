"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _iFrameHolder = _interopRequireDefault(require("../helpers/iFrameHolder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
SVG Helpers
*/

/**
 * Create new SVG element
 *
 * @param  {string} tagName
 * @param  {Object} settings
 * @param  {string} css
 */
var newEl = function newEl(tagName, settings, css) {
  var el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  settings = settings || {};

  for (var attr in settings) {
    if (attr != "text") {
      el.setAttributeNS(null, attr, settings[attr]);
    }
  }

  el.textContent = settings.text || "";
  el.style.cssText = css || "";
  return el;
};
/**
 * Creates a new SVG `text` element
 *
 * @param  {string} text
 * @param  {number} y
 * @param  {string} css
 * @returns {SVGTextElement}
 */


var newTextEl = function newTextEl(text, y, css) {
  return newEl("text", {
    fill: "#111",
    y: y,
    text: text
  }, (css || "") + " text-shadow:0 0 4px #fff;");
};
/**
 * Calculates the with of a SVG `text` element
 *
 * _needs access to iFrame, since width depends on context_
 *
 * @param  {SVGTextElement} textNode
 * @returns {number} width of `textNode`
 */


var getNodeTextWidth = function getNodeTextWidth(textNode) {
  var tmp = newEl("svg:svg", {}, "visibility:hidden;");
  tmp.appendChild(textNode);

  _iFrameHolder["default"].getOutputIFrame().body.appendChild(tmp);

  var nodeWidth = textNode.getBBox().width;
  tmp.parentNode.removeChild(tmp);
  return nodeWidth;
};

var _default = {
  newEl: newEl,
  newTextEl: newTextEl,
  getNodeTextWidth: getNodeTextWidth
};
exports["default"] = _default;
//# sourceMappingURL=svg.js.map
