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
                .then(function (component) {
                    expect(component.get("v.initialised")).toBe(true);

                    var account = {label: "Account", value: "Account", isCustom: false, visible: true};
                    account.attributes = [];
                    component.set("v.selectedDiagram", {groups: [{entities: [account]}]});
                    var graphvizSource = component.renderDiagram();

                    expect(graphvizSource.length).toBeGreaterThan(100);

                    done();
                }).catch(function (e) {
                done.fail(e);
            });
        });
    });


});