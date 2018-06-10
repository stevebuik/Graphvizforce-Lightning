var gvfp = require('../src/pure.js');
var schemas = require('../src/schemas.js');
var samples = require('../test/diagramPersistedSamples.js');
var wrappers = require('../test/describedObjectWrappers.js');
var views = require('../test/diagramViewSamples.js');
var fs = require('fs');
var Validator = require('jsonschema').Validator;

///// NEW PERSISTENCE SHAPE TESTS /////

var renderAndValidate = function (sample, variation) {
    var translated = gvfp.graphviz.diagramAsView(sample, wrappers.wrappers);
    fs.mkdir("./generated");
    fs.writeFileSync("./generated/" + variation + ".gv", gvfp.graphviz.diagramAsText(translated));
    var v = new Validator();
    return {
        translated: translated,
        inputValidation: v.validate(sample, schemas.persisted),
        outputValidation: v.validate(translated, schemas.view)
    }
};

describe("persisted diagram samples (lean v2) are translated and rendered ok", function () {

    var sample = samples["account_contact_feed2"];
    describe("contact, account, feed ", function () {
        var result = renderAndValidate(sample, "account_contact_feed2__options-active");
        it("input data was valid", function () {
            expect(result.inputValidation.errors).toEqual([]);
        });
        it("output data was valid", function () {
            expect(result.outputValidation.errors).toEqual([]);
        });
        it("entities are sorted by name", function () {
            expect(result.translated.groups[0].entities[0].name).toEqual("Account");
            expect(result.translated.groups[0].entities[1].name).toEqual("Contact");
        });
        it("fields are sorted by name", function () {
            expect(result.translated.groups[0].entities[1].fields).toEqual([
                {
                    name: 'Account ID',
                    id: 'AccountId',
                    type: 'REFERENCE'
                },
                {
                    name: 'First Name',
                    id: 'FirstName',
                    type: 'STRING'
                },
                {
                    name: 'Last Name',
                    id: 'LastName',
                    type: 'STRING'
                },
                {
                    name: 'Master Record ID',
                    id: 'MasterRecordId',
                    type: 'REFERENCE'
                },
                {
                    name: 'Reports To ID',
                    id: 'ReportsToId',
                    type: 'REFERENCE'
                }]);
        });
    })

    describe("contact, account, feed without groups", function () {

        sample.groups = [];

        var result = renderAndValidate(sample, "account_contact_feed2__without-groups");
        it("input data was valid", function () {
            expect(result.inputValidation.errors).toEqual([]);
        });
        it("output data was valid", function () {
            expect(result.outputValidation.errors).toEqual([]);
        });
        it("no groups present generates a single/default group", function () {
            expect(result.translated.groups.length).toEqual(1);
        });
    })

    describe("contact, account, feed with settings disabled", function () {

        sample.settings = {};

        var result = renderAndValidate(sample, "account_contact_feed2__with-settings-inactive");
        it("input data was valid", function () {
            expect(result.inputValidation.errors).toEqual([]);
        });
        it("output data was valid", function () {
            expect(result.outputValidation.errors).toEqual([]);
        });
        result.translated.groups[0].entities.forEach(function (entity) {
            it("all entities are in focus", function () {
                expect(entity.color).toEqual(gvfp.graphviz.entityFocused);
            });
        })
        it("only inter-entity relationships present", function () {
            expect(result.translated.relationships.length).toEqual(2);
        });
    })

})

////// CANONICAL VIEW MODEL ///////

describe("validation and generation from canonical view JSON", function () {

    describe("view data validation", function () {
        var v = new Validator();
        var validationResult = v.validate(views.samples.account_contact, schemas.view);
        it("sample view is valid",
            function () {
                expect(validationResult.errors).toEqual([]);
            })
    })

// use the files generated below for instant feedback when changing the template. Graphviz will auto-refresh.
    describe("rendering view samples to graphviz artifacts ", function () {
        var result = gvfp.graphviz.diagramAsText(views.samples.account_contact);
        //console.log(result);
        fs.mkdir("./generated");
        fs.writeFileSync("./generated/canonical_account_contact.gv", result);
    })
})


