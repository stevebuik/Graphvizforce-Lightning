var gvfp = require('../src/pure.js');
var samples = require('../test/diagramPersistedSamples.js');

describe("account, contact, contact-feed and case joins", function () {

    describe("ContactFeed and 2 levels of ancestors", function () {
        var from = "ContactFeed";
        var selectLists = gvfp.soql.diagramAsSelects(samples.account_contact_feed_case, from).selectLists;
        var query = gvfp.soql.diagramSelectsAsSOQL(selectLists, from, false);
        it("generates 2 fields and two ancestor joins", function () {
            expect(selectLists).toEqual(
                ['CommentCount,LikeCount', // from entity
                    'Parent.Phone,Parent.CreatedDate', // parent
                    'Parent.Account.Description,Parent.Account.AccountSource' // grandparent
                ]);
            expect(query).toEqual("SELECT CommentCount,LikeCount,Parent.Phone,Parent.CreatedDate,Parent.Account.Description,Parent.Account.AccountSource FROM ContactFeed");
        });
    });

    describe("Case and 2 levels ancestors", function () {
        var from = "Case";
        var generated = gvfp.soql.diagramAsSelects(samples.account_contact_feed_case, from);
        var query = gvfp.soql.diagramSelectsAsSOQL(generated.selectLists, from, false);
        it("generates 2 fields and two ancestor joins", function () {
            expect(generated.selectLists).toEqual(
                ['CaseNumber,Type', // from entity
                    'Contact.Phone,Contact.CreatedDate', // parent
                    'Account.Description,Account.AccountSource' // grandparent
                ]);
        });
        it("ContactFeed fields are not present in the query", function () {
            expect(generated.selectedFields).toEqual(
                {
                    Case: ['CaseNumber', 'Type'],
                    Contact: ['Phone', 'CreatedDate'],
                    Account: ['Description', 'AccountSource']
                });
        });
        expect(query).toEqual("SELECT CaseNumber,Type,Contact.Phone,Contact.CreatedDate,Account.Description,Account.AccountSource FROM Case");
    });

    describe("Contact with two children and one ancestor", function () {
        var from = "Contact";
        var generated = gvfp.soql.diagramAsSelects(samples.account_contact_feed_case, from);
        var query = gvfp.soql.diagramSelectsAsSOQL(generated.selectLists, from, false);
        it("generates 2 fields, a parent join and two child joins", function () {
            expect(generated.selectLists).toEqual(
                ['Phone,CreatedDate', // from entity
                    'Account.Description,Account.AccountSource', // parent
                    '(SELECT CaseNumber,Type FROM Cases)', // child
                    '(SELECT CommentCount,LikeCount FROM Feeds)' // child
                ]);
        });
        it("all fields in the diagram are used in the query", function () {
            expect(generated.selectedFields).toEqual(
                {
                    Contact: ['Phone', 'CreatedDate'],
                    Account: ['Description', 'AccountSource'],
                    Case: ['CaseNumber', 'Type'],
                    ContactFeed: ['CommentCount', 'LikeCount']
                });
        })
        expect(query).toEqual("SELECT Phone,CreatedDate,Account.Description,Account.AccountSource,(SELECT CaseNumber,Type FROM Cases),(SELECT CommentCount,LikeCount FROM Feeds) FROM Contact");
    });

})

describe("account, contact and case joins", function () {

    describe("account to contact and case children", function () {
        var from = "Account";
        var selectLists = gvfp.soql.diagramAsSelects(samples.account_contact_case, from).selectLists;
        var query = gvfp.soql.diagramSelectsAsSOQL(selectLists, from, false);
        it("generates 2 fields and two child joins", function () {
            expect(selectLists).toEqual(
                ['Description,AccountSource', // from entity
                    '(SELECT CaseNumber,Type FROM Cases)', // child join
                    '(SELECT Phone,CreatedDate FROM Contacts)' // child join
                ]);
            expect(query).toEqual("SELECT Description,AccountSource,(SELECT CaseNumber,Type FROM Cases),(SELECT Phone,CreatedDate FROM Contacts) FROM Account");
        });
    });

    describe("contact to account parent and case children", function () {
        var from = "Contact";
        var selectLists = gvfp.soql.diagramAsSelects(samples.account_contact_case, from).selectLists;
        var query = gvfp.soql.diagramSelectsAsSOQL(selectLists, from, false);
        it("generates 2 fields, a parent and a child join", function () {
            expect(selectLists).toEqual(
                ['Phone,CreatedDate', // from entity
                    'Account.Description,Account.AccountSource', // parent join
                    '(SELECT CaseNumber,Type FROM Cases)' // child join
                ]);
            expect(query).toEqual("SELECT Phone,CreatedDate,Account.Description,Account.AccountSource,(SELECT CaseNumber,Type FROM Cases) FROM Contact");
        });
    });
})

describe("entity extraction", function () {
    var result = gvfp.soql.entities(samples.account_contact_feed_case);
    it("finds 4 entities in the diagram", function () {
        expect(result).toEqual(['Account', 'Case', 'Contact', 'ContactFeed']);
    });
})

// TODO a child join where the child has another parent,grandparent present in diagram
// TODO a related entity with no fields selected in the diagram

