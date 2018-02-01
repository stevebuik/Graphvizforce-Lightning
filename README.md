# Graphvizforce for Lightning

A Salesforce Entity Relationship diagramming tool built as a Lightning Component.

Replaces and improves [Graphvizforce for Visualforce](http://stevebuik.github.io/GraphVizForce)

Status: **In Development**. We will announce on social media when v1 is ready for user testing.

TODO setup Travis CI with build indicator

## Getting started as a developer

First, clone this project to your local filesystem.

You will need access to a *Developer Hub* org. You can do by this enabling the dev hub feature in your production org
or [signing up for a 30 trial org](https://developer.salesforce.com/promotions/orgs/dx-signup) with the dev hub enabled.

Then you should install the SFDX CLI and

Login to the dev hub org using this command: (a new browser window will open)

`sfdx force:auth:web:login --setdefaultdevhubusername --setalias my-hub-org`

Now you are ready to create a new scratch org:

`sfdx force:org:create --definitionfile config/project-scratch-def.json --setalias scratch1 --setdefaultusername`

List all orgs to see which you have setup and connected to your SFDX CLI:

`sfdx force:org:list`

At any time you can open/login a window to new (default) scratch org:

`sfdx force:org:open --path one/one.app`

Now, install the Lightning Testing Service:

`sfdx force:lightning:test:install`

Deploy the code (ensure you are in graphvizforce-lightning dir):

`sfdx force:source:push`

Assign permission set to access the App and Tab:

`sfdx force:user:permset:assign --permsetname graphvizforce`

Now refresh Lightning Experience and you should be able to switch to the **Graphvizforce** app and
see the single tab where the ERD component is available.

If you use the *Developer Console* as your IDE, any changes made in your scratch org can be *pulled* back
to the local dir using:

`sfdx force:source:pull`

..and then committed to SCM as normal.

## Linting

We use the Lightning Linter to check our code. To run this locally use:

`sfdx force:lightning:lint graphviz`

## Testing

We use the [Lightning Testing Service](https://forcedotcom.github.io/LightningTestingService/) (Jasmine flavoured) to test the components in this project.
Use the following commands to run the tests:

`sfdx force:lightning:test:run -a DiagramViewerTests.app`

or you can run the testing app in the browser using:

`sfdx force:org:open --path c/DiagramViewerTests.app`

## Description of Files and Directories

This project uses SFDX for all stages.

## Architecture

We document our architectural decisions using a standard [Architecture Review Document](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) format.

These documents can be seen in [the ADR dir](/stevebuik/Graphvizforce-Lightning/tree/master/doc/ADR).

## Issues

We manage our roadmap and defects as [Github issues](https://github.com/stevebuik/Graphvizforce-Lightning/issues)

