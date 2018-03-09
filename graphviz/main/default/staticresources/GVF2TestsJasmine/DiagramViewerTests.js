describe("Diagram Viewer Tests", function () {

    afterEach(function () {
        // Each spec (test) renders its components into the same div,
        // so we need to clear that div out at the end of each spec.
        $T.clearRenderedTestComponents();
    });

    describe('Loading', function () {

        it('renders a simple diagram', function (done) {
            $T.createComponent("c:DiagramViewer", {}, true)
                .then(function (component) {
                    expect(component.get("v.initialised")).toBe(false);
                    return $T.waitFor(function () {
                        if (component.get("v.initialised")) {
                            return component;
                        } else {
                            return false;
                        }
                    })
                })
                .then(function (component, helper) {
                    expect(component.get("v.initialised")).toBe(true);

                    var content = 'digraph G { \n'+
                                       'node [shape=plaintext, fontsize=12]; \n'+
                                       'edge  [arrowhead=crow]; \n'+
                                       'a [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n'+
                                        '                      <TR><TD PORT="c" BGCOLOR="gray">Object 1</TD></TR> \n'+
                                        '                      <TR><TD PORT="d">second</TD></TR> \n'+
                                        '                      <TR><TD PORT="e">third</TD></TR> \n'+
                                        '         </TABLE>>]; \n'+
                                       'b [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n'+
                                       '                       <TR><TD PORT="c" BGCOLOR="gray">Object 2</TD></TR> \n'+
                                       '                       <TR><TD PORT="d">second</TD></TR> \n'+
                                       '                       <TR><TD PORT="e">third</TD></TR> \n'+
                                       '          </TABLE>>]; \n'+
                                       'a:c -> b:c; \n'+
                                   '}';
                    component.set("v.graphvizContent", content);

                    //expect(document.getElementById("graph").innerHTML).toBeGreaterThan(100);
                    //var erdMarkup = helper.renderSVGMarkup(content);
                    //expect(erdMarkup).toBeGreaterThan(100);
                    done();
                }).catch(function (e) {
                done.fail(e);
            });
        });
    });


});