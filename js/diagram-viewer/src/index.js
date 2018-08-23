import LCC from 'lightning-container';
import * as d3 from 'd3'
import * as d3Graphviz from 'd3-graphviz';

// Register for messages sent by hosting component
LCC.addMessageHandler(lightningMessageHandler);

// add resize window handler
d3.select(window).on("resize", resizeSVG);

const transitionTime = 400;

// global/module state
var graphviz;

function lightningMessageHandler(message) {
    switch (message.type) {
        case "render":
            if (graphviz) {
                render(message.content);
            } else {
                graphviz = d3.select("#graph").graphviz()
                    .on("initEnd", function () {
                        render(message.content);
                    });
            }
            break;
        case "reset":
            resetZoom();
            break;
        default:
            throw new Error("Unknown message type: " + message.type);
    }
}

function render(content) {

    graphviz
        .attributer(attributer)
        .engine("dot")
        .transition(d3.transition("diagram-update").duration(transitionTime).ease(d3.easeLinear))
        .dot(content)
        .render()
        .zoom(true) // must be before "end" handler or zoomBehaviour() is undefined
        .on("end", function () {
            // notify Lightning of SVG change
            LCC.sendMessage({
                type: "svg-update",
                svg: d3.select("#graph").selectWithoutDataPropagation("svg").html()
            });
        })

}

function attributer(datum, index, nodes) {
    var margin = 50; // to avoid scrollbars
    var selection = d3.select(this);
    if (datum.tag == "svg") {
        var width = window.innerWidth;
        var height = window.innerHeight;
        selection
            .attr("width", width)
            .attr("height", height)
        datum.attributes.width = width - margin;
        datum.attributes.height = height - margin;
    }
}

function resetZoom() {
    graphviz.resetZoom(d3.transition("reset").duration(transitionTime));
}

function resizeSVG() {
    var margin = 20; // to avoid scrollbars
    var width = window.innerWidth;
    var height = window.innerHeight;
    var svg = d3.select("#graph").selectWithoutDataPropagation("svg");
    var borderSize = 40;
    svg
        .attr("width", width - borderSize)
        .attr("height", height - borderSize);
    var d = svg.datum();
    d.attributes['width'] = width - margin;
    d.attributes['height'] = height - margin;
}

module.exports =
    {
        lightningMessageHandler: lightningMessageHandler,
        reset: resetZoom
    };

