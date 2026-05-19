const authToken = "Bearer <token>" 

// For projects where there is only one tab, or all tabs 
// should be counted towards the project total
const projectCode = 000000;

// For projects where a single tab is a single project.
// Note that the 'TabTitle' must exactly matche the tab title in the doc
const projectCodeMap = {"TabTitle1": 000000,
                        "TabTitle2": 000000}


function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('🐻Update Trackbear🐻') // Create a custom menu.
    .addItem('Update Trackbear with current tab as project', 'updateProjectTab')  // Add the menu item.
    .addItem('UpdateTrackbear with all tabs as project', 'updateProject')
    .addToUi(); 
}

function callTrackbear(count, projectId){
  var url = 'https://trackbear.app/api/v1/tally'
  var data = {
    "date": Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd"),
    "measure": "word",
    "count": count,
    "note": "",
    "workId": projectId,
    "setTotal": true,
    "tags": []
  }
  var payload = JSON.stringify(data);

  const options = {
    method: 'post',
    payload: payload,
    contentType: 'application/json',
    headers : {
    "Authorization": authToken,
    "User-Agent": "googledocs-trackbear/1.0 (github.com/cnlewis3/googledocs-trackbear) by cnlewis3@gmail.com"
    },
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}

function updateProject() {
  const doc = DocumentApp.getActiveDocument(); // Get the active document.
  const tabs = doc.getTabs();  // Get all first-level tabs in the document.
  let totalWords = 0; // Initialise a word counter.
  for (let i = 0; i < tabs.length; i++) { // Loop through each main Tab.
    const stack = [tabs[i]]; // Initialize stack with the current Tab.
    while (stack.length > 0) {
      const currentTab = stack.pop(); // Get the last Tab from the stack.
      const documentTab = currentTab.asDocumentTab(); // Retrieve the Tab contents as a DocumentTab.
      const body = documentTab.getBody(); // Get the body of the Tab.
      const text = body.getText(); // Get the text content of the Tab.
      const words = text.trim().replace(/-+/g, '').replace(/\s+/g, ' ').split(' '); // Split the text into words.
      totalWords += words.length; // Count words in the current Tab.
      const childTabs = currentTab.getChildTabs(); // Get Subtabs.
      for (let j = 0; j < childTabs.length; j++) { // Loop through each Subtab.
        stack.push(childTabs[j]); // Add each Subtab to the stack.
      }
    }
  }
 callTrackbear(totalWords, projectCode)
}


function updateProjectTab() {
  const tab = DocumentApp.getActiveDocument().getActiveTab();
  const title = tab.getTitle();
  Logger.log(title);
  const text = tab.asDocumentTab().getBody().getText();
  const words = text.trim().replace(/-+/g, '').replace(/\s+/g, ' ').split(' ');
  const wordCount = words.length
  callTrackbear(wordCount, projectCodeMap[title])
 
}

