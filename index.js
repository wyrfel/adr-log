'use strict';

/**
 * Module dependencies
 */

var utils = require('./lib/utils');
var querystring = require('querystring');
const fs = require('fs');
const os = require('os');
let newline;

/**
 * expose `toc`
 */

module.exports = toc;

/**
 * Load `generate` as a remarkable plugin and
 * expose the `toc` function.
 *
 * @param  {String} `str` String of markdown
 * @param  {Object} `options`
 * @return {String} Markdown-formatted table of contents
 */

function toc(str, options, dir) {
  if (typeof options === 'string' && !dir) {
    toc.dir = options;
    options = null;
  } else {
    toc.dir = dir;
  }
  return new utils.Remarkable()
    .use(generate(options))
    .render(str);
}

/**
 * Expose `insert` method
 */

toc.insertAdrToc = require('./lib/insert').insertAdrToc;

/**
 * Generate a markdown table of contents. This is the
 * function that does all of the main work with Remarkable.
 *
 * @param {Object} `options`
 * @return {String}
 */

function generate(options) {
  var opts = utils.merge({firsth1: true, maxdepth: 6}, options);
  var stripFirst = opts.firsth1 === false;
  if (typeof opts.linkify === 'undefined') opts.linkify = true;

  return function(md) {
    md.renderer.render = function(tokens) {
      const res = {
        content: ''
      };
      tokens = tokens.filter(t => !!t.content);
      for (const token of tokens) {
        let file;
        if (!toc.dir) {
          return {content: ''};
        } else {
          file = fs.readFileSync(`${toc.dir}/${token.content}`).toString();
        }
        newline = utils.determineNewline(file);
        const origLines = file.split(newline);
        let index = 0;
        if (origLines.length === 0 || (origLines.length === 1 && origLines[0].trim() === '')) {
          continue;
        }
        if (origLines[0].trim() === '') {
          index = 1;
        }
        const title = origLines[index].trim();
        const numb = token.content.match(/^\d+/m);
        if (numb === null || numb === undefined) {
          continue;
        }
        res.content += `- [ADR-${numb[0].trim()}](${token.content}) - ${title + newline}`
      }
      res.content = res.content.trim();
      return res;
    };
  };
}

/**
 * Render markdown list bullets
 *
 * @param  {Array} `arr` Array of listitem objects
 * @param  {Object} `opts`
 * @return {String}
 */

function bullets(arr, options, newline) {
  var opts = utils.merge({indent: '  '}, options);
  opts.chars = opts.chars || opts.bullets || ['-', '*', '+'];
  var unindent = 0;

  var listitem = utils.li(opts);
  var fn = typeof opts.filter === 'function'
    ? opts.filter
    : null;

  // Keep the first h1? This is `true` by default
  if (opts && opts.firsth1 === false) {
    unindent = 1;
  }

  var len = arr.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var ele = arr[i++];
    ele.lvl -= unindent;
    if (fn && !fn(ele.content, ele, arr)) {
      continue;
    }

    if (ele.lvl > opts.maxdepth) {
      continue;
    }

    var lvl = ele.lvl - opts.highest;
    res.push(listitem(lvl, ele.content, opts));
  }
  return res.join(newline);
}

/**
 * Get the highest heading level in the array, so
 * we can un-indent the proper number of levels.
 *
 * @param {Array} `arr` Array of tokens
 * @return {Number} Highest level
 */

function highest(arr) {
  var res = arr.slice().sort(function(a, b) {
    return a.lvl - b.lvl;
  });
  if (res && res.length) {
    return res[0].lvl;
  }
  return 0;
}

/**
 * Turn headings into anchors
 */

function linkify(tok, options, d) {
  var opts = utils.merge({}, options);
  if (tok && tok.content) {
    opts.num = tok.seen;
    var text = titleize(tok.content, opts);
    var slug = utils.slugify(tok.content, opts);
    slug = querystring.escape(slug);
    if (opts && typeof opts.linkify === 'function') {
      return opts.linkify(tok, text, slug, opts);
    }
    tok.content = utils.mdlink(text,  slug);
  }
  return tok;
}

/**
 * Titleize the title part of a markdown link.
 *
 * @name  options.titleize
 * @param  {String} `str` The string to titleize
 * @param  {Object} `opts` Pass a custom titleize function on `titleize`
 * @return {String}
 * @api public
 */

function titleize(str, opts) {
  if (opts && opts.strip) { return strip(str, opts); }
  if (opts && opts.titleize === false) return str;
  if (opts && typeof opts.titleize === 'function') {
    return opts.titleize(str, opts);
  }
  str = utils.getTitle(str);
  str = str.split('.md')[0];
  str = str.split(/<\/?[^>]+>/).join('');
  str = str.split(/[ \t]+/).join(' ');
  return str.trim();
}

/**
 * Optionally strip specified words from heading text (not url)
 *
 * @name  options.strip
 * @param  {String} `str`
 * @param  {String} `opts`
 * @return {String}
 */

function strip(str, opts) {
  opts = opts || {};
  if (!opts.strip) return str;
  if (typeof opts.strip === 'function') {
    return opts.strip(str, opts);
  }
  if (Array.isArray(opts.strip) && opts.strip.length) {
    var res = opts.strip.join('|');
    var re = new RegExp(res, 'g');
    str = str.trim().replace(re, '');
    return str.replace(/^-|-$/g, '');
  }
  return str;
}

/**
 * Expose utils
 */

toc.bullets = bullets;
toc.linkify = linkify;
toc.slugify = utils.slugify;
toc.titleize = titleize;
toc.plugin = generate;
toc.strip = strip;
