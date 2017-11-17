# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

We refer to [GitHub issues](https://github.com/adr/adr-log/issues) by using `#NUM`.

## [unreleased]

### Added
- Support for comments after `adrlog` in `<!-- adrlog -->`. [#17](https://github.com/adr/adr-log/issues/17)
- Initial support for headers (`---`) in `ADR-*.md` files.

### Changed
- Updated CLI syntax to be more conform with [markdown-toc](https://github.com/jonschlinkert/markdown-toc).

### Fixed
- The title of the first main heading is used (and not the second line if it is not empty). [#15](https://github.com/adr/adr-log/issues/15)
- When adrlog appears without closing adrlogstop, adr-log does not stop with an error anymore.
- When adrlog does not appear, the log is created nevertheless.

## [v1.1.0] - 2017-10-27

### Added
- We added a CHANGELOG.md. [#2](https://github.com/adr/adr-log/issues/2)

### Changed
- We update README.md to reflect changed usage. [#3](https://github.com/adr/adr-log/issues/3)

### Fixed 
- Fix titles to printed in the correct format as described in [#5](https://github.com/adr/adr-log/issues/5).
- Fix output of help to use "LOG" instead of "TOC". [#6](https://github.com/adr/adr-log/issues/6)
- Fix help to output "adr-log" instead of "adr-toc". [#4](https://github.com/adr/adr-log/issues/4)

### Removed
- Removed `bower.json`. [#8](https://github.com/adr/adr-log/issues/8)

## [v1.0.1] - 2017-10-22

### Fixed
- Fix parsing of cli arguments. [#1](https://github.com/adr/adr-log/issues/1)

## [v1.0.0] - 2017-10-20

Initial version of adr-log.

[unreleased]: https://github.com/adr/adr-log/compare/adr:v1.1.0...master
[v1.1.0]: https://github.com/adr/adr-log/compare/adr:v1.0.1...v1.1.0
[v1.0.1]: https://github.com/adr/adr-log/compare/adr:v1.0.0...v1.0.1
[v1.0.0]: https://github.com/adr/adr-log/compare/adr:360c142de47234334162691eb76a2509ea014199...v1.0.0
