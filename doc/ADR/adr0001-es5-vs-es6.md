## Context

For developers, ES6 provides many nice features but the Lightning Linter defaults to ES5.
It's non-trivial to make the linter use ES6:
https://developer.salesforce.com/forums/?id=9060G000000MVJSQA4
https://salesforce.stackexchange.com/questions/199495/ecma-script-6-eslint-with-lightninglint

Salesforce supports IE11 for Lightning Experience but IE11 only supports a small set of ES6 features:
http://kangax.github.io/compat-table/es6/#ie11

## Decision

Only use ES5 features in this project, to allow a clean linter run and automated linting in CI.

## Status

Removed all the ES6 errors found by the DX linter and app still works.

## Consequences

Less readable code but higher browser compatibility.

Caveat: browser compatibility is good but most users of this tool will be admins who generally use Chrome and LTS also uses headless Chrome with full ES6 support.