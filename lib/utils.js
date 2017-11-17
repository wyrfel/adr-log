'use strict';

/**
 * Module dependencies
 */

var diacritics = require('diacritics-map');
var utils = require('lazy-cache')(require);
var fn = require;
const os = require('os');
require = utils;

/**
 * Lazily required module dependencies
 */

require('concat-stream', 'concat');
require('gray-matter', 'matter');
require('list-item', 'li');
require('markdown-link', 'mdlink');
require('minimist');
require('mixin-deep', 'merge');
require('object.pick', 'pick');
require('remarkable', 'Remarkable');
require('repeat-string', 'repeat');
require('strip-color');
require = fn;

/**
 * Get the "title" from a markdown link
 */

utils.getTitle = function(str) {
  if (/^\[[^\]]+\]\(/.test(str)) {
    var m = /^\[([^\]]+)\]/.exec(str);
    if (m) return m[1];
  }
  return str;
};

/**
 * Slugify the url part of a markdown link.
 *
 * @name  options.slugify
 * @param  {String} `str` The string to slugify
 * @param  {Object} `options` Pass a custom slugify function on `options.slugify`
 * @return {String}
 * @api public
 */

utils.slugify = function(str, options) {
  options = options || {};
  if (options.slugify === false) return str;
  if (typeof options.slugify === 'function') {
    return options.slugify(str, options);
  }

  str = utils.getTitle(str);
  str = utils.stripColor(str);
  str = str.toLowerCase();

  // `.split()` is often (but not always) faster than `.replace()`
  // str = str.slice(0, -2);
  str = str.split(' ').join('-');
  str = str.split(/\t/).join('--');
  if (options.stripHeadingTags !== false) {
    str = str.split(/<\/?[^>]+>/).join('');
  }
  // str = str.split(/[|$&`~=\\\/@+*!?({[\]})<>=.,;:'"^]/).join('');
  // quick fix: delete . from regex to get file ending in resulting link
  str = str.split(/[|$&`~=\\\/@+*!?({[\]})<>=,;:'"^]/).join('');
  str = str.split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/).join('');
  str = replaceDiacritics(str);
  if (options.num) {
    str += '-' + options.num;
  }
  return str;
};

/**
 * Convert a non-heading string to a h1 heading
 * @param {String} `str` The string to headify
 * @returns {string}
 */
utils.headify = function h(str) {
  // line ending doesn't really matter because the headings are tokenized later on.
  return `# ${str.trim() + os.EOL}`;
};

function replaceDiacritics(str) {
  return str.replace(/[À-ž]/g, function(ch) {
    return diacritics[ch] || ch;
  });
}

utils.determineNewline = function (file) {
  let newline;
  if (file.indexOf('\n\r') > -1) {
    newline = '\n\r';
  } else if (file.indexOf('\r\n') > -1) {
    newline = '\r\n';
  } else if (file.indexOf('\r') > -1) {
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
