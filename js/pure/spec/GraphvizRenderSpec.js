var gvfp = require('../src/pure.js');
var samples = require('../test/diagramPersistedSamples.js');
var views = require('../test/diagramViewSamples.js');
var fs = require('fs');
var Validator = require('jsonschema').Validator;

var renderAndValidate = function (sampleName, variation, opts) {
    var translated = gvfp.graphviz.diagramAsMustacheView(samples[sampleName], opts);
    fs.mkdir("./generated");
    fs.writeFileSync("./generated/" + sampleName + "-" + variation + ".gv", gvfp.graphviz.diagramAsText(translated));
    var v = new Validator();
    return {
        translated: translated,
        validation: v.validate(translated, views.schema)
    }
};

describe("persisted samples are translated into valid view data", function () {

    describe("contact, account, feed, case simple", function () {
        var rendered = renderAndValidate("account_contact_feed_case", "basic", {showSelfRelations: false});
        it("valid translation with no options present", function () {
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

    describe("contact, account, case simple", function () {
        var rendered = renderAndValidate("account_contact_case", "basic", {showSelfRelations: false});
        it("valid translation with no options present", function () {
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
        it("valid translation with no options present", function () {
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
    var validationResult = v.validate(views.samples.account_contact, views.schema);
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


