'use strict';

var toc = require('..');
var utils = require('./utils');
const os = require('os');

/**
 * The basic idea:
 *
 *  1. when front-matter exists, we need to avoid turning its properties into headings.
 *  2. We need to detect toc markers on the page. For now it's a simple HTML code comment
 *     to ensure the markdown is compatible with any parser.
 *
 * @param  {String} `str` Pass a string of markdown
 * @param  {Object} `options` Pass options to toc generation
 * @return {String} Get the same string back with a TOC inserted
 */

module.exports.insert = function(str, options) {
  options = options || {};

  var regex = options.regex || /(?:<!-- toc(?:\s*stop)? .*-->)/g;
  var open = typeof options.open === 'string' ? options.open : '<!-- toc -->\n\n';
  var close = typeof options.close === 'string' ? options.close : '<!-- tocstop -->';
  var obj;

  var newlines = '';
  var m = /\n+$/.exec(str);
  if (m) newlines = m[0];

  // does the file have front-matter?
  if (/^---/.test(str)) {
    // extract it temporarily so the syntax
    // doesn't get mistaken for a heading
    obj = utils.matter(str);
    str = obj.content;
  }

  var sections = split(str, regex);
  console.log(sections)
  if (sections.length > 3) {
    throw new Error('adr-toc only supports one Table of Contents per file.');
  }

  var last = sections[sections.length - 1];
  if (sections.length === 3) {
    sections.splice(1, 1, open + (options.toc || toc(last, options).content));
    sections.splice(2, 0, close);
  }

  if (sections.length === 2) {
    sections.splice(1, 0, open + toc(last, options).content + os.EOL + os.EOL + close);
  }

  var resultString = sections.join('\n\n') + newlines;
  // if front-matter was found, put it back now
  if (obj) {
    return utils.matter.stringify(resultString, obj.data);
  }
  return resultString;
};

module.exports.insertAdrToc = function(str, tocContent, options, dirinsertAdr) {
  options = options || {};

  var regex = options.regex || /(?:<!-- adrlog(?:\s*stop)? .*-->)/g;
  var obj;

  var newlines = '';
  var m = /\n+$/.exec(str);
  if (m) newlines = m[0];

  // does the file have front-matter?
  if (/^---/.test(str)) {
    // extract it temporarily so the syntax
    // doesn't get mistaken for a heading
    obj = utils.matter(str);
    str = obj.content;
  }

  var sections = split(str, regex);

  const start = str.match(/<!-- adrlog .*-->/);
  if (start.length > 0) {
    var open = typeof options.open === 'string' ? options.open : start[0] + os.EOL + os.EOL;
  } else {
    var open = typeof options.open === 'string' ? options.open : '<!-- adrlog -->' + os.EOL + os.EOL;
  }
  const end = str.match(/<!-- adrlogstop .*-->/);
  if (end && end.length > 0) {
    var close = typeof options.close === 'string' ? options.close : end[0];
  } else {
    var close = typeof options.close === 'string' ? options.close : '<!-- adrlogstop -->';
  }

  if (sections.length > 3) {
    throw new Error('adr-log only supports one list of ADRs per file.');
  }

  var last = sections[sections.length - 1];
  if (sections.length === 3) {
    sections.splice(1, 1, open + (options.toc || toc(tocContent, options).content));
    sections.splice(2, 0, close);
  }

  if (sections.length === 2) {
    sections.splice(1, 0, open + toc(tocContent, options).content + '\n\n' + close);
  }

  var resultString = sections.join('\n\n') + newlines;
  // if front-matter was found, put it back now
  if (obj) {
    return utils.matter.stringify(resultString, obj.data);
  }
  return resultString;
};

function split(str, re) {
  return str.split(re).map(trim);
}

function trim(str) {
  return str.trim();
}
