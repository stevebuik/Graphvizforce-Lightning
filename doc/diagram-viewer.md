## Diagram Viewer Design

Currently the diagram is rendered by the DiagramViewer component which invokes the d3.js lib
using d3-graphviz to drive it. This works well enough but it is lucky that it works since
the LockerService tends to break 3rd party libs that manipulate the DOM.

One aspect of this is that the SVG rendered by d3 is set to width -1.
This causes errors in the console but creates the desired behaviours of:

1. auto-scaling the svg diagram to fit the window
2. making d3 transitions smooth

Using 100% breaks the transition smoothness so we are sticking with -1 for now.

The correct way to fix this is to measure the width/height of the div containing
the d3 svg and use that in the *attributer* fn.
Currently this doesn't work because the LockerService blocks measuring the size of elements.

The fix for this is to run the d3 code in a *lightning:container* but that has other problems....

### lightning:container

The correct way to run d3 is inside a *lightning:container* component.
The [diagram-viewer dir](https://github.com/stevebuik/Graphvizforce-Lightning/tree/master/js/diagram-viewer) contains a prototype of this design and can
be run standalone using a local node.js server. To run this:

1. `cd js/diagram-viewer`
2. `npm install`
3. in one terminal window `npm run watch`
4. in another terminal window `./node_modules/.bin/http-server`
5. open the browser using `http://127.0.0.1:8080`

Now any change made to index.js or index.html will be reflected instantly on refresh.

This javascript artifact has the connections for sending a receiving LCC messages but
when run inside a lightning:container it does not work.
Some combination of:

1. CSP errors
2. problems loading the viz.js as a web-worker (disabled)
3.
