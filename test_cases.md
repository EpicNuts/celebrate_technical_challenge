Given the Scenario, our testing goal and scope will be focused on ensuring that when a user switches from mobile to desktop, only one thing really matters:

"Does my work survive the switch and can I continue without friction?"

Everything else is a variation on this question so each cross-device test case should answer these core quesitons.

1. what is the state of the phone session when they leave the mobile browser
2. how fully does the desktop restore/resume this state.

"Does state transition from mobile to desktop"



// Test Case 1: Core Flow: Mobile start => Desktop continue //

1. User Scenario
    A logged-in customer starts creating a photo book on mobile web, uploads photos, places at least one image on a page, leaves the session, and later resumes the same project on desktop web to continue editing.

2. Preconditions & Test Data
    Devices
        * mobile web: Smartphone browser (eg. Android Chrome, IOS Safari).
        * desktop web: Chrome (latest).
    User
        * logged-in user account (requireed for cross-device persistence).
    Photos
        * 3-5 dummy JPG images.
    Assumptions
        * User explicitly saves the state.

3. Test Steps (High Level) & expected results

    // On Mobile Web //

    1. Open kartenmacherei.de on mobile browser.
    → Photo book configurator can be started without UI issues.
    2. Start a new photo book project.
    → User enters configurator successfully.
    3. Upload multiple photos.
    → Uploaded photos appear in the media library.
    4. Place at least one photo on a page.
    → Image is rendered correctly on the page canvas.
    5. Save the session and close tab / browser.
    → Project is saved explicitly.

    // On Desktop Web //

    6. Open kartenmacherei.de on desktop browser and log in.
    → User sees existing projects.
    7. Resume the previously started photo book.
    → Correct project is opened.
    8. Verify persisted state.
    → Uploaded photos are present.
    → Previously placed image is still on the correct page.
    → Layout is intact and editable.
    9. Continue editing (e.g. add another photo).
    → Changes can be made and saved successfully.

4. Key Risks covered
    * Project not saved, or lost between devices.
    * images missing or replaced after resume.
    * layout breaks due to different viewport sizes.
    * Wrong project is resumed.
    * Authentication/session issues.

5. Priority & Automation suitability
    * Priority: Highest
    * Automation: Yes (Playwright)
    * Why: 
        This flow directly affects conversion and trust. Failures are hard to detect with unit of component tests.



// Test Case 2: Mobile interruption => Desktop recovery //

1. User Scenario
    A customer starts a photo book on mobile, uploads photos, but leaves the configurator without explicitly finishing or confirming anything, then later resumes on desktop.

2. Preconditions & Test Data
    * Same as Test Case 1.
    * Emphasis on no explicit “save” action.

3. Test Steps (High Level) & expected results
    
    // On Mobile Web //

    1. Start a new photo book.
    2. Upload several photos.
    3. Place one image on a page.
    4. Close the browser or navigate away without confirmation.
    → No data loss warnings are required
    → State is persisted implicitly

    // On Desktop Web //

    5. Log in and resume the project.
    → Uploaded photos exist.
    → Page layout matches last mobile state.

4. Key Risks covered
    * Auto-save not triggering.
    * Partial state loss (photo library empty, but visible in the layout).
    * Inconsistent project state.

5. Priority & Automation suitability
    * Priority: High
    * Automaiton: Partial
    * Why:
        Valuable, but slightly harder to automate reliably due to timing and save mechanisms.



// Test Case 3: Multiple projects, correct resume //

1. User Scenario
    A customer has multiple unfinished photo book projects. They start a new one on mobile and later resume on desktop.

2. Preconditions & Test Data
    * Same as Test Case 1.
    * Logged-in user with at least one existing unfinished photo book.

3. Test Steps (High Level) & expected results
    
    // On Mobile Web //

    1. Start a new photo book.
    2. Upload and place one image on page.
    3. Leave the session.

    // On Desktop Web //

    4. Log in.
    5. View list of unfinished projects.
    6. Resume the correct project (most recent).
    → Correct images and layout are shown
    → Other projects remain unchanged

4. Key Risks covered
    * Wrong project being resumed.
    * Overwriting another project.
    * Confusing UX around project selection.

5. Priority & Automation suitability
    * Priority: Medium
    * Automaiton: Sure
    * Why:
        Important for power users, but less critical than basic persistance.


// Other Stuff //

Leaning into the Page Object Model approach would make separating out the mobile from the desktop functions much cleaner. 

needs cleanup functions to remove the added images


