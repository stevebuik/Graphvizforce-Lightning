## What can you learn from this project?

* Using SFDX to create a fresh dev env in 5 mins
* composition vs inheritance (DiagramDataService, DeBounce)
* Testing Lightning components using the LTS
* loading fns from a static resource (global fns vs pure fns)
* instant feedback dev using npm tools, then deploying using UMD
* calling the Tooling/Rest APIs from Lightning and future Apex Tooling APIs
* JSON for persistence instead of custom fields, entities etc
* JSON validation for interim values or attribute values
* ADR docs instead of long form architecture docs

Future

* TODO debounce
* TODO CI

### js static resource/module

* UMD allows script and node.js use
* must use "production" mode since eval blocked in "development" mode
* exports not available in devtools console since "window" is proxied (i.e. different) for each Lightning component
