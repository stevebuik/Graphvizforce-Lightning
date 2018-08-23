({
    transitionTime: function () {
        return 400;
    },
    attributer: function (datum, index, nodes) {
        if (datum.tag == "svg") {
            // not sure why zeroes work but leaving it alone since it does.
            // diagram/svg fills entire div and scales correctly on resize
            datum.attributes.width = -1;
            datum.attributes.height = -1;
        }
    }
})