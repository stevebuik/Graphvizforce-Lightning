## Context

To create the *Auto-build* feature, access to the Tooling API is required.
There was a [bug that blocked access](https://success.salesforce.com/issues_view?id=a1p3A000000EAUPQA4&title=summer-17-generating-a-session-id-from-lightning-domain-provides-invalid-session-id) to this API from Lightning that was marked as fixed but is not.

A workaround was found: host the ERD component in a Lightning Out page in a Visualforce page.
The visualforce domains provide a session id that does work with the tooling API.

This workaround will no longer be needed when the native Apex meta-data api supports Classes and Triggers.

## Decision

Migrated the tab to use a VF page and Lightning Out to init the ERD.

## Status

Accepted. Tested and works except for Toasts.

Waiting for better meta-data API support in Apex. Currently only Page Layouts supported.

## Consequences

Since the lightning:notificationsLibrary is used to show toasts, this is now broken.
This is because the VF page is run inside an iFrame and cannot send events to the LEX app where toasts are handled.
We will avoid the use of LEX toasts until the above bug is fixed and we can stop using Lightning Out.

The initial load time of the page is much slower due to Lightning Out bootstrapping itself.
This is not too bad for the user since they can stay on the page and avoid the initialisation delay.
If auto-build is not required, the user can create a *Lightning Component* tab and avoid VF/Lightning Out. This loads much faster.

