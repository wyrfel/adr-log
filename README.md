# adr-log [![NPM version](https://img.shields.io/npm/v/adr-log.svg?style=flat)](https://www.npmjs.com/package/adr-log)

> Generate an architectural decision log out of architectural decision records (ADRs).

## Table of Contents

<!-- toc -->

- [Install](#install)
- [CLI](#cli)
- [Usage](#usage)
  * [Examples](#examples)
    + [Printing the adr log to stdout](#printing-the-adr-log-to-stdout)
    + [Generating an index.md file containing the adr log](#generating-an-indexmd-file-containing-the-adr-log)
- [License](#license)

<!-- tocstop -->

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
                If no <file> file is specified, a index.md file containing the log is created in the given directory

    -i:         Edit the <file> file directly, injecting the log at <!-- adrlog -->
                Using only the -i flag, the tool will scan the current working directory for all *.md files and inject the resulting adr-log into the default index.md file
                (Without this flag, the default is to print the log to stdout.)

    -d:         Scans the given <directory> for .md files and adds them to the log which gets injected into the <file>
                (Without this flag, the current working directory will be chosen as default)

    -f:         Option to specify the <file> in which the adr-log should be injected
                (Without this flag index.md will be chosen as default.)

    -h:         Shows how to use this module
```

## Usage

### Examples

#### Printing the adr log to stdout

Consider a directory consisting of three files (0000-example-1.md, 0001-example-2.md, 0002-example-3.md).
Execute following command:


```sh
$ adr-log -d .
```

This outputs following log on your console:

```
- [ADR-0000](0000-example-1.md) - Example 1
- [ADR-0001](0001-example-2.md) - Example 2
- [ADR-0002](0002-example-3.md) - Example 3
```

#### Generating an index.md file containing the adr log

Using `-i` alone (`adr-log -i`) generates a `index.md` file in the current working directory containing the log.

```
<!-- adrlog -->

- [ADR-0000](0000-example-1.md) - Example 1
- [ADR-0001](0001-example-2.md) - Example 2
- [ADR-0002](0002-example-3.md) - Example 3

<!-- adrlogstop -->
```

Since this is basically a fork of [Jon Schlinkert's](https://github.com/jonschlinkert) [markdown-toc](https://github.com/jonschlinkert/markdown-toc), you can also choose to insert the log into an existing file.
For this to work the file must contain an opening `<!-- adrlog -->` code comment, after which the log will be inserted.

If the file already contains an adrlog surrounded by an opening `<!-- adrlog -->` and closing `<!-- adrlogstop -->` code comment, the existing log will be replaced.


## License

Copyright © 2017, [Tino Stadelmaier](https://github.com/tstadelmaier).
Released under the [MIT License](LICENSE).
