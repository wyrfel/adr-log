# adr-log [![NPM version](https://img.shields.io/npm/v/adr-log.svg?style=flat)](https://www.npmjs.com/package/adr-log)

> Generate a markdown log of *.md files in a directory.

## Table of Contents

- [Install](#install)
- [CLI](#cli)
- [Highights](#highights)
- [Usage](#usage)
- [API](#api)
  * [toc.plugin](#tocplugin)
  * [toc.json](#tocjson)
  * [toc.insert](#tocinsert)
  * [Utility functions](#utility-functions)
- [About](#about)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install -g adr-log
```

## CLI

```
Usage: adr-log [-i] [-d <directory>] [-f <file>] [-h]

    directory:  The directory to be scanned for the *.md files
                If no <directory> is given, the current working directory will be chosen by default

    file:       The markdown file to contain the table of contents
                If no <file> file is specified, a index.md file containing the TOC is created in the given directory

    -i:         Edit the <file> file directly, injecting the TOC at <!-- adrlog -->
                Using only the -i flag, the tool will scan the current working directory for all *.md files and inject the resulting adr-log into the default index.md file
                (Without this flag, the default is to print the TOC to stdout.)

    -d:         Scans the given <directory> for .md files and adds them to the TOC which gets injected into the <file>
                (Without this flag, the current working directory will be chosen as default)

    -f:         Option to specify the <file> in which the adr-log should be injected
                (Without this flag index.md will be chosen as default.)

    -h:         Shows how to use this module
```

## Usage
### Examples

**logging the adrlog to stdout**

Using the tool in directory containing *.md files (e.g. test1.md, test2.md, test3.md, test4.md) with the following command:

```sh
$ adr-log
```

will output the following log on your console:

```
- [test1](test1.md)
- [test2](test2.md)
- [test3](test3.md)
- [test4](test4.md)
```
**Generating a index.md file containing the adrlog**

Using the -i flag without specifying a file in which the generated log should be injected, like so:

```sh
$ adr-log -i
```

will by default generate a index.md file in the current working directory containing the log.

```
<!-- adrlog -->

- [test1](test1.md)
- [test2](test2.md)
- [test3](test3.md)
- [test4](test4.md)

<!-- adrlogstop -->
```

Since this is basically a fork of [Jon Schlinkert's](https://github.com/jonschlinkert) [markdown-toc](https://github.com/jonschlinkert/markdown-toc), you can also choose to insert the log into an existing file.
For this to work the file must contain an opening `<!-- adrlog -->` code comment, after which the log will be inserted.

If the file already contains an adrlog surrounded by an opening `<!-- adrlog -->` and closing `<!-- adrlogstop -->` code comment, the existing log will be replaced.


### License

Copyright © 2017, [Tino Stadelmaier](https://github.com/tstadelmaier).
Released under the [MIT License](LICENSE).
