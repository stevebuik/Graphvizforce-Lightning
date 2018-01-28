# Graphvizforce for Lightning

A Salesforce Entity Relationship diagramming tool built as a Lightning Component.

Replaces and improves [Graphvizforce for Visualforce](http://stevebuik.github.io/GraphVizForce)

Status: **In Development**. We will announce on social media when v1 is ready for user testing.

TODO setup Travis CI with build indicator

## Getting started as a developer

Install the SFDX CLI and

Login and set default dev hub org:

`sfdx force:auth:web:login --setdefaultdevhubusername --setalias my-hub-org`

Create a new scratch org:

`sfdx force:org:create --definitionfile config/project-scratch-def.json --setalias scratch1 --setdefaultusername`

List all orgs:

`sfdx force:org:list`

Open/login to new (default) scratch org:

`sfdx force:org:open --path one/one.app`

Install the Lightning Testing Service:

`sfdx force:lightning:test:install`

Deploy code (ensure you are in gvf2 dir):

`sfdx force:source:push`

Assign permission set to access App/Tab:

`sfdx force:user:permset:assign --permsetname graphvizforce`

Now refresh Lightning Experience and you should be able to switch to the **Graphvizforce** app and
see the single tab where the ERD component is available.

If you use the *Developer Console* as your IDE, any changes made in your scratch org can be *pulled* back
to the local dir using:

`sfdx force:source:pull`

..and then committed to SCM as normal.

## Testing

We use the [Lightning Testing Service](https://forcedotcom.github.io/LightningTestingService/) (Jasmine flavoured) to test the components in this project.
Use the following commands to run the tests:

`sfdx force:lightning:test:run -a DiagramViewerTests.app`

or you can run the testing app in the browser using:

`sfdx force:org:open --path c/DiagramViewerTests.app`

## Description of Files and Directories

This project uses SFDX for all stages.

## Issues

We manage our roadmap and defects as [Github issues](https://github.com/stevebuik/Graphvizforce-Lightning/issues)

