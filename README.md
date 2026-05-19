# Google Docs Trackbear

This Apps Script sends Google Docs word counts to Trackbear.

## Decide which setup to use first

There are two ways to use the script:

- Use `projectCode` when all tabs in the Google Doc should count toward one Trackbear project.
- Use `projectCodeMap` when different tabs in the Google Doc should count toward separate Trackbear projects.

If you only want one project, you can fill in `projectCode` and leave `projectCodeMap` as a simple placeholder. If each tab is its own project, fill in `projectCodeMap` and use the exact tab titles from the doc.

## Find your project code

To find a Trackbear project code, open the project in Trackbear and copy the number from the URL. For example, in `https://trackbear.app/projects/137858`, the project code is `137858`.

## What to edit first

At the top of [trackbear.gs](trackbear.gs), set `authToken` and then choose the project setup that matches how you want to use the script:

```javascript
const projectCode = 000000;
const projectCodeMap = {"TabTitle1": 000000,
                        "TabTitle2": 000000}
const authToken = "Bearer <token>"
```

### 1. `projectCode`
Use the Trackbear project/work ID you want to update when you run **Update Trackbear with all tabs as project**.

Replace `000000` with the numeric ID for that Trackbear project.

### 2. `projectCodeMap`
Use this when you want different Google Docs tabs to report to different Trackbear projects.

Replace each tab title with the exact tab name from your Google Doc, then set the matching Trackbear project/work ID.

Example:

```javascript
const projectCodeMap = {
  "Draft": 123456,
  "Notes": 789012
}
```

The tab title must match exactly, including spaces and capitalization.

Use `projectCodeMap` only if each tab should map to a different Trackbear project. If all tabs should be counted together as one project, use `projectCode` instead.

### 3. `authToken`
Create or copy your API key from:

https://trackbear.app/account/api-keys

Paste it into the script as a Bearer token:

```javascript
const authToken = "Bearer YOUR_API_KEY_HERE"
```

If Trackbear gives you the raw key value, keep the `Bearer ` prefix and paste the key after it.

NOTE: When making the key, you can change the expiration date to 'Never'. If you choose anything else, just be aware that you will have to re-create and change any hardcoded authToken vals.

## How to use it in Google Docs Apps Script

1. Open the Google Doc you want to track.
2. Go to **Extensions > Apps Script**.
3. Paste the contents of [trackbear.gs](trackbear.gs) into the script editor.
4. Update the three constants above.
5. Save the project.
6. Reload the Google Doc.
7. Use the new menu item **🐻Update Trackbear🐻**.

## Menu options

- **Update Trackbear with current tab as project**: sends the active tab's word count to the project ID listed in `projectCodeMap` for that tab title.
- **UpdateTrackbear with all tabs as project**: counts words across all tabs in the document and sends the total to `projectCode`.

## Notes

- The script uses the current date in `callTrackbear()`.
- Tab names must match `projectCodeMap` exactly.
- If a tab title is missing from `projectCodeMap`, the update for that tab will send `undefined` as the project ID.
