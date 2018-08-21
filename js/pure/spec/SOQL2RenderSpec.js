var gvfp = require('../src/pure.js');
var samples = require('../test/diagramPersistedSamples.js');
var wrappers = require('../test/describedObjectWrappers.js');
var fs = require('fs');

var renderAndSave = function (sample, from, name) {
    var result = gvfp.soql.v2.diagramAsSelects(sample, wrappers.wrappers, from);
    result.query = gvfp.soql.v2.diagramSelectsAsSOQL(result.selectLists, from, false);

    // save to file-system to support testing of each query using the DX api
    fs.mkdir("./generated/soql");
    fs.writeFileSync("./generated/soql/" + name + ".soql", result.query);

    return result;
}

describe("query edge cases", function () {

    // some objects don't have child relationship describes and can't be used in SOQL
    // the example here is: SELECT Id, (Select Id from CaseTeamMembers) FROM CaseTeamRole
    // which will not run in SOQL. try it and see.
    describe("invalid join from CaseTeamRole to CaseTeamMember", function () {
        it("will throw an error to the user", function () {
            expect(function () {
                renderAndSave(samples.case_teams, "CaseTeamRole", "case-teams-from-role");
            }).toThrow("The 'CaseTeamMember' object cannot be used as a child in a parent -> child relationship query with the 'CaseTeamRole' entity as the parent/from entity!");
        })
    })
    // but querying from the other side works ok so SOQL generation should work with errors
    describe("valid join from CaseTeamMember to CaseTeamRole", function () {
        var result = renderAndSave(samples.case_teams, "CaseTeamMember", "case-teams-from-member");
        it("generates a query", function () {
            expect(result.query).toEqual("SELECT Id,Parent.Id,TeamRole.Id FROM CaseTeamMember");
        });
    })

    describe("No fields selected", function () {
        var result = renderAndSave(samples.account_contact_no_fields, "Account", "account-contact-without-fields");
        it("Ids are added for all entities with no selected fields", function () {
            expect(result.selectLists).toEqual(['Id', '(SELECT Id FROM Contacts)']);
        });
    })

    describe("parent joins with no fields selected", function () {
        var result = renderAndSave(samples.timesheets, "TimeSheetEntry", "timesheetentry-to-timesheet");
        it("auto-added Id fields have prefixes", function () {
            expect(result.query).toEqual("SELECT Id,TimeSheet.Id,WorkOrder.Id FROM TimeSheetEntry");
        });
    })

    describe("Duplicate child joins", function () {
        var result = renderAndSave(samples.account_partners, "Account", "account-partners");
        it("Child relationship joins use correct names when > 1 relationship from parent", function () {
            expect(result.selectLists).toEqual([
                'Id',
                '(SELECT Id FROM AccountPartnersFrom)',
                '(SELECT Id FROM AccountPartnersTo)']);
        });
    })

    describe("User joins", function () {
        var fromAccount = renderAndSave(samples.account_user, "Account", "account-user-from-account");
        it("Account to user join returns only fields visible in the diagram", function () {
            expect(fromAccount.selectLists).toEqual(['Id', '(SELECT Id FROM Users)']);
        });

        it("User to Account joins alerts user of invalid join", function () {
            expect(function () {
                renderAndSave(samples.account_user, "User", "account-user-from-user");
            }).toThrow("The 'Account' object cannot be used as a child in a parent -> child relationship query with the 'User' entity as the parent/from entity!");
        });
    })

});

describe("account, contact and feed joins", function () {

    describe("contact to account parent and feed children", function () {
        var result = renderAndSave(samples.account_contact_feed2, "Contact", "contact-with-parent-and-children");
        it("generates 3 fields and two joins", function () {
            expect(result.selectLists).toEqual(
                ['LastName,FirstName,AccountId', // from
                    'Account.Name,Account.Type', // parent
                    '(SELECT Type,CreatedDate FROM Feeds)' // child
                ]);
            expect(result.query).toEqual("SELECT LastName,FirstName,AccountId,Account.Name,Account.Type,(SELECT Type,CreatedDate FROM Feeds) FROM Contact");
        });
    });

    describe("account to contact children", function () {
        var result = renderAndSave(samples.account_contact_feed2, "Account", "account-with-contact-children");
        it("generates 2 fields and one child join", function () {
            expect(result.selectLists).toEqual(
                ['Name,Type', // from
                    '(SELECT LastName,FirstName,AccountId FROM Contacts)' // child
                ]);
            expect(result.query).toEqual("SELECT Name,Type,(SELECT LastName,FirstName,AccountId FROM Contacts) FROM Account");
        });
    });

    describe("feed to contact and account ancestors", function () {
        var result = renderAndSave(samples.account_contact_feed2, "ContactFeed", "feed-with-contact-account-ancestors");
        it("generates 2 fields and two ancestor joins", function () {
            expect(result.selectLists).toEqual(
                ['Type,CreatedDate', // from
                    'Parent.LastName,Parent.FirstName,Parent.AccountId', // parent
                    'Parent.Account.Name,Parent.Account.Type' // grand-parent
                ]);
            expect(result.query).toEqual("SELECT Type,CreatedDate,Parent.LastName,Parent.FirstName,Parent.AccountId,Parent.Account.Name,Parent.Account.Type FROM ContactFeed");
        });
    });
})

describe("entity extraction", function () {
    var result = gvfp.soql.v2.entities(samples.account_contact_feed2);
    it("finds 3 entities in the diagram", function () {
        expect(result).toEqual(['Contact', 'Account', 'ContactFeed']);
    });
})

// TODO a child join where the child has another parent,grandparent present in diagram
// TODO a related entity with no fields selected in the diagram

// TODO use DX to check if each SOQL file/query is valid using the API
