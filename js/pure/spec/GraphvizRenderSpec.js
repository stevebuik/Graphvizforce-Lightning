var gvfp = require('../src/pure.js');
var schemas = require('../src/schemas.js');
var samples = require('../test/diagramPersistedSamples.js');
var views = require('../test/diagramViewSamples.js');
var fs = require('fs');
var Validator = require('jsonschema').Validator;

///// NEW PERSISTENCE SHAPE TESTS /////

describe("persisted diagram samples (lean v2) are translated into valid view data", function () {
    it("sample is validated by schema", function () {
        var v = new Validator();
        var validation = v.validate(samples.account_contact_feed_case2, schemas.persisted);
        expect(validation.errors).toEqual([]);
    })
})

///// INITIAL PERSISTENCE SHAPE TESTS /////

var renderAndValidate = function (sampleName, variation, opts) {
    var translated = gvfp.graphviz.diagramAsMustacheView(samples[sampleName], opts);
    fs.mkdir("./generated");
    fs.writeFileSync("./generated/" + sampleName + "-" + variation + ".gv", gvfp.graphviz.diagramAsText(translated));
    var v = new Validator();
    return {
        translated: translated,
        validation: v.validate(translated, schemas.view)
    }
};

describe("persisted samples are translated into valid view data", function () {
    describe("contact, account, feed, case", function () {
        describe("simple i.e. no options in use", function () {
            var rendered = renderAndValidate("account_contact_feed_case", "basic", {showSelfRelations: false});
            it("valid translation", function () {
                expect(rendered.validation.errors).toEqual([]);
            })
            it("translation returns 2 Account fields", function () {
                expect(rendered.translated.groups[0].entities[0].fields)
                    .toEqual([{
                            name: 'Account Description',
                            id: 'Description',
                            type: 'TEXTAREA'
                        },
                            {
                                name: 'Account Source',
                                id: 'AccountSource',
                                type: 'PICKLIST'
                            }]
                    );
            })
        });
        // if a SOQL from change event uses Account then ContactFeed is a grandchild and not included in the SOQL
        describe("entity obscured", function () {
            var rendered = renderAndValidate("account_contact_feed_case", "obscuring", {obscureEntities: ["ContactFeed"]});
            it("valid translation", function () {
                expect(rendered.validation.errors).toEqual([]);
            })
            it("Account entity is not obscured", function () {
                expect(rendered.translated.groups[0].entities[0].color).toEqual(gvfp.graphviz.entityFocused);
            })
            it("ContactFeed entity is obscured", function () {
                expect(rendered.translated.groups[0].entities[3].color).toEqual(gvfp.graphviz.entityObscured);
            })
        });
    });

    describe("contact, account, case simple", function () {
        var rendered = renderAndValidate("account_contact_case", "basic", {showSelfRelations: false});
        it("valid translation", function () {
            expect(rendered.validation.errors).toEqual([]);
        })
        it("translation returns 2 Account fields", function () {
            expect(rendered.translated.groups[0].entities[0].fields)
                .toEqual([{
                        name: 'Account Description',
                        id: 'Description',
                        type: 'TEXTAREA'
                    },
                        {
                            name: 'Account Source',
                            id: 'AccountSource',
                            type: 'PICKLIST'
                        }]
                );
        })
    });

    describe("contact, account, case with self", function () {
        var rendered = renderAndValidate("account_contact_case", "with-self", {showSelfRelations: true});
        it("valid translation", function () {
            expect(rendered.validation.errors).toEqual([]);
        })
        it("translation returns 4 Account fields sorted by name", function () {
            expect(rendered.translated.groups[0].entities[0].fields)
                .toEqual([
                    {
                        name: 'Account Description',
                        id: 'Description',
                        type: 'TEXTAREA'
                    },
                    {
                        name: 'Account Source',
                        id: 'AccountSource',
                        type: 'PICKLIST'
                    },
                    {
                        name: 'Master Record ID',
                        id: 'MasterRecordId',
                        type: 'REFERENCE'
                    },
                    {
                        name: 'Parent Account ID',
                        id: 'ParentId',
                        type: 'REFERENCE'
                    }]);
        })
    });

})

describe("view data validation", function () {
    var v = new Validator();
    var validationResult = v.validate(views.samples.account_contact, schemas.view);
    it("sample view is valid",
        function () {
            expect(validationResult.errors).toEqual([]);
        })
})

// use the files generated below for instant feedback when changing the template. Graphviz will auto-refresh.
describe("rendering view samples to graphviz artifacts", function () {
    var result = gvfp.graphviz.diagramAsText(views.samples.account_contact);
    //console.log(result);
    fs.mkdir("./generated");
    fs.writeFileSync("./generated/canonical_account_contact.gv", result);
})


