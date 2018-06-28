## Getting started as a developer

First, clone this project to your local filesystem.

You will need access to a *Developer Hub* org. You can do by this enabling the dev hub feature in your production org
or [signing up for a 30 trial org](https://developer.salesforce.com/promotions/orgs/dx-signup) with the dev hub enabled.

Then you should install the SFDX CLI and

Login to the dev hub org using this command: (a new browser window will open)

Note : keep the hub org browser window open, it's needed in the next step.

`sfdx force:auth:web:login --setdefaultdevhubusername --setalias my-hub-org`

Link the packaging DE org:

Contact us to get access to the packaging org so that you can add a *Namespace Registry* to your hub org.

Then [follow these instructions](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_reg_namespace.htm) to link to the packaging DE org.

You no longer need to keep the hub org open in the browser once linked.

Now you are ready to create a new scratch org:

`sfdx force:org:create --definitionfile config/project-scratch-def.json --durationdays 30 --setalias scratch1 --setdefaultusername`

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

#### Apex tests

`sfdx force:apex:test:run` and follow the instruction returned.

#### Lightning Tests

Use the [Lightning Testing Service](https://forcedotcom.github.io/LightningTestingService/) (Jasmine flavoured) to test the components in this project.
Use the following commands to run the tests:

`sfdx force:lightning:test:run -a DiagramViewerTests.app`

or you can run the testing app in the browser using:

`sfdx force:org:open --path c/DiagramViewerTests.app`

#### Jasmine / Node Tests

`cd js/pure`

`npm install`

`./node_modules/jasmine-node/bin/jasmine-node spec`

#### Development Mode

If you are doing development on this tool, it is useful to enable *development mode*

To enable it, add a new custom setting in *Graphviz Config* with Name = *development mode*
and Value = *TRUE*

This will:

* cause the Apex auto-build to include Apex classes from this project when generating a diagram

#### Lightning Development

Although testing the full application is important, refreshing it after changes is slow.
For this reason, there's also *TestApp.app* which refreshes much faster. It will not support tooling API features.

`sfdx force:org:open --path c/TestApp.app`

#### Javascript Development

Functions that have complex logic are built using npm tooling to provide instant feedback when changing code.

`cd js/pure`

`npm install`

TODO use npm run for this
`./node_modules/jasmine-node/bin/jasmine-node --watch src test  --autotest --color spec`

Once you have made your changes and tested them, you will need to deploy the node.js code to the SFDC static resource.
This is done in 2 steps:

TODO use npm run for these two
1. `./node_modules/webpack-cli/bin/webpack.js` updates the static resource file on your local filesystem
2. `sfdx force:source:push` deploys the changed static resource to SFDC

Now you can refresh the Test app or the full app to see your new code in action.

## Description of Files and Directories

This project uses SFDX for all stages.