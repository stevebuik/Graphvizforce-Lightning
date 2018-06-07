## Context

One of the weaknesses of Salesforce development is the slow save/test feedback cycle
e.g. save a Lightning Component, refresh the page, restore the UI state, confirm the change takes > 20 seconds.

If code can be executed locally on a developers PC and some kind of UI or text output is useful, feedback can be instant.
This is available in the javascript context when building node.js modules and using the Jasmine-CLI watch feature.

Two parts of the tool logic are complex and have no dependency on the Lightning framework:

1. graphviz rendering from the diagram JSON object
2. SOQL rendering from the diagram JSON object

## Decision

Build all functions for these two rendering processes as node module and use webpack to combine them into a single static resource.

For graphviz rendering, tests render artifacts to the local file-system so that a local Graphviz client can watch them and instantly update.
This creates instant graphical feedback for the developer.

## Status

Accepted. Confirmed to work in development and in runtime.

## Consequences

No disadvantages uncovered so far.

Discovered that the node module will only work in Lightning when deployed as a *UMD* module in *production* mode.

This makes working on the renderers much more enjoyable and has unlocked our ambitions to add useful features.

TODO blog post