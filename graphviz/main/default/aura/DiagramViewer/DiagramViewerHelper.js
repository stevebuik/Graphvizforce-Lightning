/**
 * Created by guan on 15/2/18.
 */
({
    renderSVGMarkup : function(graphvizContent){
        var format = 'svg';
        var erdMarkup = Viz(graphvizContent, format);
        return erdMarkup;
    },
})