# Changelog

## [v5.1.0](https://github.com/substack/tape/releases/tag/v5.1.0)
Jordan Harband released this on 2020-12-29

 - [New] Include name of test in log when test times out (#524)
 - [readme] document Promise support; remove Promise-related alternatives
 - [readme] add `tape-describe` to 'other' section (#523)
 - [Deps] update `deep-equal`, `is-regex`, `object-inspect`, `object-is`, `object.assign`, `resolve`, `string.prototype.trim`
 - [Dev Deps] update `eslint`, `js-yaml`
 - [eslint] remove useless regex escapes
 - [Tests] handle stack differences in node 15
 - [Tests] add test case for #519 for test.comment() in createStream/objectMode context (#520)


## [v5.0.1](https://github.com/substack/tape/releases/tag/v5.0.1)
Jordan Harband released this on 2020-05-25

 - [Fix] `createStream`: `result` payload is not always an object (#519)
 - [Fix] Update RegExp for matching stack frames to handle Promise/then scenario (#515)
 - [readme] add `tape-repeater` (#511)
 - [Dev Deps] update `eslint`


## [v5.0.0](https://github.com/substack/tape/releases/tag/v5.0.0)
Jordan Harband released this on 2020-04-24

Changes since v4.13.2:

 - [Breaking] only `looseEqual`/`deepEqual, and their inverses, are now non-strict.
 - [Breaking] make equality functions consistent:
 - [Breaking] `equal`: use `==`, not `===`, to match `assert.equal`
 - [Breaking] `strictEqual`: bring `-0`/`0`, and `NaN` into line with `assert`
 - [Breaking] update `deep-equal` to v2
 - [Breaking] fail any assertion after `.end()` is called (#489)
 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] tests with no callback are failed TODO tests (#69)
 - [Breaking] equality functions: throw when < 2 arguments are provided
 - [Breaking] add "exports" to restrict public API
 - [Breaking] `throws`: bring into line with node’s `assert.throws`
 - [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` (#396)
 - [Docs] add an optional emoji version for tap-spec consumer (#501)
 - [examples] add `ecstatic`
 - [readme] Add link to tape-player (in-process reporter) (#496)
 - [meta] change dep semver prefix from ~ to ^
 - [meta] add `funding` field, create `FUNDING.yml`
 - [meta] add `auto-changelog`
 - [Deps] update `deep-equal`, `minimist`, `object-is`, `resolve`
 - [Dev Deps] update `falafel`
 - [Tests] Fix simple typo, placehodler -> placeholder (#500)

Changes since v5.0.0-next.5:

 - [Breaking] remove full "lib" export; replace with explicit exports
 - [examples] add `ecstatic`
 - [readme] Add link to tape-player (in-process reporter) (#496)
 - [Docs] add an optional emoji version for tap-spec consumer (#501)
 - [meta] add `funding` field, create `FUNDING.yml`
 - [meta] add `auto-changelog`
 - [Deps] update `deep-equal`, `minimist`, `object-is`, `resolve`
 - [Dev Deps] update `falafel`
 - [Tests] Fix simple typo, placehodler -> placeholder (#500)


## [v5.0.0-next.5](https://github.com/substack/tape/releases/tag/v5.0.0-next.5)
Jordan Harband released this on 2020-03-02

Changes since v5.0.0-next.4:
 - [Breaking] only `looseEqual`/`deepEqual, and their inverses, are now non-strict.
 - [Breaking] make equality functions consistent:
 - [Breaking] `equal`: use `==`, not `===`, to match `assert.equal`
 - [Breaking] `strictEqual`: bring `-0`/`0`, and `NaN` into line with `assert`
 - [patch] Print name of test that didnt end (#498)
 - [Refactor] remove unused code
 - [Deps] update `resolve`

Changes since v4.13.2:

 - [Breaking] only `looseEqual`/`deepEqual, and their inverses, are now non-strict.
 - [Breaking] make equality functions consistent:
 - [Breaking] `equal`: use `==`, not `===`, to match `assert.equal`
 - [Breaking] `strictEqual`: bring `-0`/`0`, and `NaN` into line with `assert`
 - [Breaking] update `deep-equal` to v2
 - [Breaking] fail any assertion after `.end()` is called (#489)
 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] tests with no callback are failed TODO tests (#69)
 - [Breaking] equality functions: throw when < 2 arguments are provided
 - [Breaking] add "exports" to restrict public API
 - [Breaking] `throws`: bring into line with node’s `assert.throws`
 - [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` (#396)
 - [meta] change dep semver prefix from ~ to ^


## [v5.0.0-next.4](https://github.com/substack/tape/releases/tag/v5.0.0-next.4)
Jordan Harband released this on 2020-01-19

Changes since v5.0.0-next.3:
 - [Fix] `.catch` is a syntax error in older browsers
 - [Refactor] remove unused code
 - [Deps] update `resolve`

Changes since v4.13.0:

 - [Breaking] update `deep-equal` to v2
 - [Breaking] fail any assertion after `.end()` is called (#489)
 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] tests with no callback are failed TODO tests (#69)
 - [Breaking] equality functions: throw when < 2 arguments are provided
 - [Breaking] add "exports" to restrict public API
 - [Breaking] `throws`: bring into line with node’s `assert.throws`
 - [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` (#396)
 - [meta] change dep semver prefix from ~ to ^


## [v5.0.0-next.3](https://github.com/substack/tape/releases/tag/v5.0.0-next.3)
Jordan Harband released this on 2020-01-09

Changes since v5.0.0-next.2:
 - [Fix] tests without a callback that are *skipped* should not fail

Changes since v4.13.0:

 - [Breaking] update `deep-equal` to v2
 - [Breaking] fail any assertion after `.end()` is called (#489)
 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] tests with no callback are failed TODO tests (#69)
 - [Breaking] equality functions: throw when < 2 arguments are provided
 - [Breaking] add "exports" to restrict public API
 - [Breaking] `throws`: bring into line with node’s `assert.throws`
 - [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` (#396)
 - [meta] change dep semver prefix from ~ to ^


## [v5.0.0-next.2](https://github.com/substack/tape/releases/tag/v5.0.0-next.2)
Jordan Harband released this on 2020-01-08

Changes since v5.0.0-next.1:

 - [New] `tape` binary: Add -i flag to ignore files from gitignore (#492)
 - [New] add `t.match()` and `t.doesNotMatch()`, new in `node` `v13.6`
 - [readme] remove long-dead testling-ci badge

Changes since v4.13.0:

 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] update `deep-equal` to v2
 - [Deps] update `resolve`
 - [meta] change dep semver prefix from ~ to ^


## [v5.0.0-next.1](https://github.com/substack/tape/releases/tag/v5.0.0-next.1)
Jordan Harband released this on 2020-01-01

Changes since v5.0.0-next.0:

 - [Breaking] fail any assertion after `.end()` is called (#489(
 - [Breaking] tests with no callback are failed TODO tests (#69)
 - [Breaking] equality functions: throw when < 2 arguments are provided
 - [Breaking] add "exports" to restrict public API
 - [Breaking] `throws`: bring into line with node’s `assert.throws`
 - [Breaking] use default `require.extensions` collection instead of the magic Array `['.js']` (#396)
 - [Fix] error stack file path can contain parens/spaces
 - [Refactor] make everything strict mode
 - [Refactor] Avoid setting message property on primitives; use strict mode to catch this (#490)
 - [Refactor] generalize error message from calling `.end` more than once
 - [Dev Deps] update `eslint`
 - [Tests] improve some failure output by adding messages
 - [Tests] handle stack trace variation in node <= 0.8
 - [Tests] ensure bin/tape is linted
 - [Tests] Fail a test if its callback returns a promise that rejects (#441)
 - [eslint] fix remaining undeclared variables (#488)
 - [eslint] Fix leaking variable in tests
 - [eslint] fix object key spacing

Changes since v4.12.1:

 - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
 - [Breaking] support passing in an async function for the test callback (#472)
 - [Breaking] update `deep-equal` to v2
 - [Deps] update `resolve`
 - [meta] change dep semver prefix from ~ to ^


## [v5.0.0-next.0](https://github.com/substack/tape/releases/tag/v5.0.0-next.0)
Jordan Harband released this on 2019-12-21

  - [Breaking] `error` should not emit `expected`/`actual` diags (#455)
  - [Breaking] support passing in an async function for the test callback (#472)
  - [Breaking] update `deep-equal` to v2
  - [Deps] update `resolve`
  - [meta] change dep semver prefix from ~ to ^


## [v4.13.3](https://github.com/substack/tape/releases/tag/v4.13.3)
Jordan Harband released this on 2020-05-24

 - [Fix] `createStream`: `result` payload is not always an object (#519)
 - [Fix] Update RegExp for matching stack frames to handle Promise/then scenario (#516)
 - [readme] add `tape-repeater` (#511)
 - [readme] Add link to tape-player (in-process reporter) (#496)
 - [examples] add `ecstatic`
 - [Docs] add an optional emoji version for tap-spec consumer (#501)
 - [Deps] update `minimist`, `resolve`
 - [Tests] Fix simple typo, placehodler -> placeholder (#500)
 - [Dev Deps] update `eslint`, `falafel`, `js-yaml`


## [v4.13.2](https://github.com/substack/tape/releases/tag/v4.13.2)
Jordan Harband released this on 2020-03-02

 - [patch] Print name of test that didnt end (#498)
 - [Refactor] remove unused code
 - [Deps] update `resolve`
 - [eslint] enable `quotes` rule
 - [Tests] add tests for edge cases and numerics


## [v4.13.1](https://github.com/substack/tape/releases/tag/v4.13.1)
Jordan Harband released this on 2020-01-09

 - [Fix] `match`/`doesNotMatch`: when passing, ensure the proper default assert message shows up (#494)


## [v4.13.0](https://github.com/substack/tape/releases/tag/v4.13.0)
Jordan Harband released this on 2020-01-08

  - [New] `tape` binary: Add -i flag to ignore files from gitignore (#492)
  - [New] add `t.match()` and `t.doesNotMatch()`, new in `node` `v13.6`
  - [Deps] update `resolve`
  - [Tests] handle stack trace variation in node <= 0.8
  - [lint] fix object key spacing


## [v4.12.1](https://github.com/substack/tape/releases/tag/v4.12.1)
Jordan Harband released this on 2019-12-24

  - [Fix] error stack file path can contain parens/spaces
  - [Deps] update `resolve`
  - [Dev Deps] update `eslint`


## [v4.12.0](https://github.com/substack/tape/releases/tag/v4.12.0)
Jordan Harband released this on 2019-12-16

  - [New] when the error type is wrong, show the message and stack
  - [Refactor] use `is-regex` instead of `instanceof RegExp`
  - [Deps] update `deep-equal`, `glob`, `object-inspect`, `resolve`, `string.prototype.trim`
  - [Dev Deps] update `eslint`
  - [readme] add tap-nyc to pretty-reporters (#480)
  - [Tests] use shared travis-ci configs
  - [Tests] add a test for the wrong kind of error


## [v4.11.0](https://github.com/substack/tape/releases/tag/v4.11.0)
Jordan Harband released this on 2019-06-29

 - [New] Add descriptive messages for skipped asserts (#476)
 - [Fix] emit skipped tests as objects (#473)
 - [Refactor] use `!!` over `Boolean()`
 - [meta] clean up license so github can detect it
 - [Deps] update `inherits`, `resolve`
 - [Tests] add tests for 'todo' exit codes (#471)


## [v4.10.2](https://github.com/substack/tape/releases/tag/v4.10.2)
Jordan Harband released this on 2019-05-25

 - [fix] don't consider 'ok' of todo tests in exit code (#470)
 - [refactor] Removed never-read inErrorState from index.js (#462)
 - [deps] update `glob`, `resolve`
 - [docs] Minor punctuation/highlighting improvement (#468)


## [v4.10.1](https://github.com/substack/tape/releases/tag/v4.10.1)
Jordan Harband released this on 2019-02-14

 - [Fix] Partial revert of #403: fbe4b951cb6c6cc4f0e9e3ae4a57b123dd82c0fb and 367b010d21c7c9814c4bc6b21d1c2a9a67596c11 (#459, #222)
 - [Refactor] consistent spacing
 - [Deps] update `resolve`


## [v4.10.0](https://github.com/substack/tape/releases/tag/v4.10.0)
Jordan Harband released this on 2019-02-09

[New] Implements TAP TODO directive (#254)
[New] add alias 'notDeepEquals' to 'notDeepEqual' function (#411)

[Fix] fix premature end of tests (and running sibling tests) when test includes subtests (#403, #222)
[Fix] only use one test runner for results, even if multiple streams are created (#404, #361, #105)
[Fix] windows: Show failure location even if driver letter is lowercase (#329)

[Docs] link to mixed tape (#445)
[Docs] Add electron-tap (#240)
[Docs] Add tape-promise into 'other' (#210)
[Docs] Mention [`flip-tape`](https://github.com/pguth/flip-tape/blob/master/README.md) in the section "other". (#359)
[Docs] Add an alternative ES6 tape runner (#328)


## [v4.9.2](https://github.com/substack/tape/releases/tag/v4.9.2)
Jordan Harband released this on 2018-12-29

 - [Fix] notEqual and notDeepEqual show "expected" value on failure (#454)
 - [Docs] Updated readme to make test, test.only, and test.skip consistent (#452)
 - [Docs] Clarify doesNotThrow parameters (#450)
 - [Docs] Adding tap-junit (#449)
 - [readme] Change broken image to use web archive (#443)
 - [Docs] convert list of tap reporters to links (#439, #440)
 - [Dev Deps] update `eslint`, `eclint`


## [v4.9.1](https://github.com/substack/tape/releases/tag/v4.9.1)
Jordan Harband released this on 2018-06-07

 - [fix] Fix bug in functionName regex during stack parsing (#437)
 - [docs] Fix spelling of "parameterize" (#430)
 - [docs] Add tap-react-browser (#433)
 - [deps] update `has`, `for-each`, `resolve`, `object-inspect`
 - [dev deps] use ^ for dev deps; update to latest nonbreaking; update `concat-stream`, `js-yaml`
 - [Tests] add eclint and eslint, to enforce a consistent style


## [v4.9.0](https://github.com/substack/tape/releases/tag/v4.9.0)
Jordan Harband released this on 2018-02-19

 - [New] use `process.env.NODE_TAPE_OBJECT_PRINT_DEPTH` for the default object print depth (#420)
 - [New] Add "onFailure" listener to test harness (#408)
 - [Fix] fix stack where actual is falsy (#400)
 - [Fix] normalize path separators in stacks (#402)
 - [Fix] fix line numbers in stack traces from inside anon functions (#387)
 - [Fix] Fix dirname in stack traces (#388)
 - [Robustness] Use local reference for clearTimeout global (#385)
 - [Deps] update `function-bind`


## [v4.8.0](https://github.com/substack/tape/releases/tag/v4.8.0)
Jordan Harband released this on 2017-07-31

 - [New] update `object-inspect` to provide better output for arrays with extra properties added
 - [Deps] update `resolve`


## [v4.7.0](https://github.com/substack/tape/releases/tag/v4.7.0)
Jordan Harband released this on 2017-06-26

 - [Fix] fix spurious "test exited without ending" (#223)
 - [New] show full error stack on failure (#330)

 - [Deps] update `resolve`, `object-inspect`, `glob`
 - [Dev Deps] update `tap`, `concat-stream`, `js-yaml`

 - [Tests] fix stack differences on node 0.8
 - [Tests] npm v4.6+ breaks on node < v1, npm v5+ breaks on node < v4
 - [Tests] on `node` `v8`; no need for sudo; `v0.8` passes now; allow v5/v7/iojs to fail.


## [v4.6.3](https://github.com/substack/tape/releases/tag/v4.6.3)
Jordan Harband released this on 2016-11-22

 - [Fix] don’t assume `Array#forEach`, for ES3
 - [Tests] on `node` `v7`
 - [Deps] update `glob`
 - [Dev Deps] update `js-yaml`, `tap-parser`


## [v4.6.2](https://github.com/substack/tape/releases/tag/v4.6.2)
Jordan Harband released this on 2016-09-30

 - [Fix] if someone throws `null`/`undefined`, it shouldn’t crash


## [v4.6.1](https://github.com/substack/tape/releases/tag/v4.6.1)
Jordan Harband released this on 2016-09-30

 - [Fix] `throws`: only reassign “message” when it is not already non-enumerable (#320)
 - [Fix] show path for error messages on windows (#316)
 - [Fix] `.only` should not run multiple tests with the same name (#299, #303)
 - [Deps] update `glob`, `inherits`
 - [Dev Deps] update `concat-stream`, `tap`, `tap-parser`, `falafel`
 - [Tests] [Dev Deps] Update to latest version of devDependencies tap (v7) and tap-parser (v2) (#318)
 - [Tests] ensure the max_listeners test has passing output
 - [Docs] improvements (#298, #317)


## [v4.6.0](https://github.com/substack/tape/releases/tag/v4.6.0)
Jordan Harband released this on 2016-06-20

 - [New] make object-inspect depth configurable for expected/actual (#293)
 - [New] add message defaults to .ok() and .notOk() (#261)
 - [Robustness] be robust against the global `setTimeout` changing (#292)
 - [Deps] update `glob`, `object-inspect`
 - [Dev Deps] update `js-yaml`


## [v2.4.0](https://github.com/substack/tape/releases/tag/v2.4.0)
James Halliday released this on 2014-01-29

upgrade deep-equal to 0.2.0


## [v2.2.1](https://github.com/substack/tape/releases/tag/v2.2.1)
James Halliday released this on 2013-11-22

forgot the resumer dep


## [v1.0.1](https://github.com/substack/tape/releases/tag/v1.0.1)
James Halliday released this on 2013-05-04

forgot to add through


## [v0.3.3](https://github.com/substack/tape/releases/tag/v0.3.3)
James Halliday released this on 2013-04-01

stub out .map()


## [v0.2.0](https://github.com/substack/tape/releases/tag/v0.2.0)
James Halliday released this on 2013-01-18

show `at` locations in errors


## [v0.1.0](https://github.com/substack/tape/releases/tag/v0.1.0)
James Halliday released this on 2012-12-04

0.1.0 now with exit and exception handling


## [v0.0.5](https://github.com/substack/tape/releases/tag/v0.0.5)
James Halliday released this on 2012-11-28

fix typo in t.notOk()


## [v0.0.3](https://github.com/substack/tape/releases/tag/v0.0.3)
James Halliday released this on 2012-11-26

using `defined` for defined-or (//)


## [v0.0.0](https://github.com/substack/tape/releases/tag/v0.0.0)
James Halliday released this on 2012-11-25

using travis


## [2.4.0](https://github.com/substack/tape/releases/tag/2.4.0)
James Halliday released this on 2014-01-29

upgrade deep-equal to 0.2.0


## [2.2.1](https://github.com/substack/tape/releases/tag/2.2.1)
James Halliday released this on 2013-11-22

forgot the resumer dep


## [1.0.1](https://github.com/substack/tape/releases/tag/1.0.1)
James Halliday released this on 2013-05-04

forgot to add through


## [0.3.3](https://github.com/substack/tape/releases/tag/0.3.3)
James Halliday released this on 2013-04-01

stub out .map()


## [0.3.2](https://github.com/substack/tape/releases/tag/0.3.2)
James Halliday released this on 2013-03-25

guard process.exit() with a canExit for browsers


## [0.2.0](https://github.com/substack/tape/releases/tag/0.2.0)
James Halliday released this on 2013-01-18

show `at` locations in errors


## [0.1.0](https://github.com/substack/tape/releases/tag/0.1.0)
James Halliday released this on 2012-12-04

 now with exit and exception handling


## [0.0.5](https://github.com/substack/tape/releases/tag/0.0.5)
James Halliday released this on 2012-11-28

fix typo in t.notOk()


## [0.0.3](https://github.com/substack/tape/releases/tag/0.0.3)
James Halliday released this on 2012-11-26

using `defined` for defined-or (//)


## [0.0.0](https://github.com/substack/tape/releases/tag/0.0.0)
James Halliday released this on 2012-11-25

using travis

