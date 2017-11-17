'use strict';

/**
 * Module dependencies
 */

var utils = require('./lib/utils');
const fs = require('fs');

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
 */
function generate() {
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
        }
        const numb = token.content.match(/^\d+/m);
        if (numb === null || numb === undefined) {
          continue;
        }
        var content = fs.readFileSync(`${toc.dir}/${token.content}`).toString();

        // does the file have front-matter?
        if (/^---/.test(content)) {
          // extract it temporarily so the syntax
          // doesn't get mistaken for a heading
          var obj = utils.matter(content);
          content = obj.content;
        }

        const newline = utils.determineNewline(content);
        const title = content.split(newline)[0].substr(2);
        console.log(title);
        res.content += `- [ADR-${numb[0].trim()}](${token.content}) - ${title + newline}`
      }
      res.content = res.content.trim();
      return res;
    };
  };
}

/**
 * Expose utils
 */
toc.slugify = utils.slugify;
