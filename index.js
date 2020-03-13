'use strict';

/**
 * Module dependencies
 */

const utils = require('./lib/utils');
const fs = require('fs');
const path = require('path');
const slash = require('slash');

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
function toc(str, options) {
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
 * This is the core implementation. Here, the file contents (docs/adr/dddd-*.md) are parsed and transformed into markdown.
 */
function generate(options) {
  return function(md) {
    md.renderer.render = function(tokens) {
      const res = {
        content: ''
      };

      tokens = tokens.filter(t => !!t.content);

      for (const token of tokens) {
        if (!options.dir) {
          return {content: ''};
        }

        const numb = token.content.match(/^\d+/m);
        if (numb === null || numb === undefined) {
          continue;
        }

        let content = fs.readFileSync(`${options.dir}/${token.content}`).toString();

        let tokenPath = slash(
          path.relative(options.tocDir, `${options.dir}${token.content}`)
        );

        // does the file have front-matter?
        if (/^---/.test(content)) {
          // extract it temporarily so the syntax
          // doesn't get mistaken for a heading
          let obj = utils.matter(content);
          content = obj.content;
        }

        const newline = utils.determineNewline(content);
        let title = content.split(newline)[0].substr(2);
        console.log("title before decimal removal: ", title);
        title = title.replace(/^\d+\. /, '');
        console.log("title after decimal removal:  ", title);
        res.content += `- [ADR-${numb[0].trim()}](${options.pathPrefix}${tokenPath}) - ${title + options.newline}`
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
