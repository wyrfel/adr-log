'use strict';

/**
 * Module dependencies
 */
var utils = require('lazy-cache')(require);
var fn = require;
const os = require('os');
require = utils;

/**
 * Lazily required module dependencies
 */
require('gray-matter', 'matter');
require('minimist');
require('remarkable', 'Remarkable');
require = fn;

/**
 * Convert a non-heading string to a h1 heading
 * @param {String} `str` The string to headify
 * @returns {string}
 */
utils.headify = function h(str) {
  // line ending doesn't really matter because the headings are tokenized later on.
  return `# ${str.trim() + os.EOL}`;
};

utils.determineNewline = function (content) {
  let newline;
  if (content.indexOf('\n\r') > -1) {
    newline = '\n\r';
  } else if (content.indexOf('\r\n') > -1) {
    newline = '\r\n';
  } else if (content.indexOf('\r') > -1) {
    newline = '\r';
  } else {
    newline = '\n';
  }
  return newline;
};

/**
 * Expose `utils` modules
 */
module.exports = utils;
