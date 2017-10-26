#!/usr/bin/env node

var fs = require('fs');
var toc = require('./index.js');
var utils = require('./lib/utils');
var glob = require('glob');
var path = require('path');
var args = utils.minimist(process.argv.slice(2), {
  boolean: ['i'],
  string: ['f'],
  string: ['d'],
  // default: {
  //   d: path.resolve(process.cwd()),
  //   f: path.resolve(process.cwd()) + '/index.md'
  // },
  alias: {h: 'help'}
});


if (!args.d && !args.f && !args.i || args.h) {
  console.error([
    'Usage: adr-toc [-i] [-d <directory>] [-f <file>]',
    '',
    '  directory:  The directory to be scanned for the *.md files',
    '              If no <directory> is given, the current working directory will be chosen by default',
    '',
    '  file:      The markdown file to contain the table of contents,',
    '              If no <file> file is specified, a index.md file containing the TOC is created in the given directory.',
    '',
    '  -i:         Edit the <file> file directly, injecting the TOC at <!-- adrlog -->',
    '              Using only the -i flag, the tool will scan the current working directory for all *.md files and inject the resulting adr-log into the default index.md file ',
    '              (Without this flag, the default is to print the TOC to stdout.)',
    '',
    '  -d:         Scans the given <directory> for .md files and adds them to the TOC which gets injected into the <file>.',
    '              (Without this flag, the current working directory will be chosen as default)',
    '',
    '  -f:         Option to specify the <file> in which the adr-log should be injected',
    '              (Without this flag index.md will be chosen as default.)'
  ].join('\n'));
  process.exit(1);
}

if (args.i && args._[0] === '-') {
  console.error('adr-toc: you cannot use -i with "-" (stdin) for input');
  process.exit(1);
}

var input = process.stdin;

var defaultDir = path.resolve(process.cwd());
var defaultFile = 'index.md';
var dir = args.d || defaultDir;
var tocFile = args.f || defaultFile;

if (args.i) {
  var headings = '';
  var filenames = glob.sync('!(' + tocFile.slice(0,-3) + '*).md', {cwd: dir});

  for (const filename of filenames) {
    headings += utils.headify(filename);
  }

  if (fs.existsSync(tocFile)) {

    input = fs.createReadStream(tocFile);

    input.pipe(utils.concat(function (input) {
      var newMarkdown = toc.insertAdrToc(input.toString(), headings, dir);
      fs.writeFileSync(tocFile, newMarkdown);
    }));


  } else {
    var tocString = '<!-- adrlog -->\n\n<!-- adrlogstop -->\n';

    fs.writeFileSync(dir + '/' + tocFile, toc.insertAdrToc(tocString, headings, dir));

  }
} else {
  var headings = '';
  var filenames = glob.sync('!(' + tocFile.slice(0,-3) + '*).md', {cwd: dir});

  for (const filename of filenames) {
    headings += utils.headify(filename + '\n');
  }
  var parsed = toc(headings, dir);
  output(parsed);

}




input.on('error', function onErr(err) {
  console.error(err);
  process.exit(1);
});

function output(parsed) {
  if (args.json) return console.log(JSON.stringify(parsed.json, null, '  '));
  process.stdout.write(parsed.content);
}
