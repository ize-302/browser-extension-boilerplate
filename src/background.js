chrome.runtime.onInstalled.addListener(() => {
  console.log('Installation successful!')
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { request: "open-extension" });
});

// Get the current tab
const getCurrentTab = async () => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Receive messages from any tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.request) {
    case "close-extension":
      getCurrentTab().then((response) => {
        chrome.tabs.sendMessage(response.id, { request: "close-extension" });
      });
      break;
  }
})

// open extension when shortcut command is triggered
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-extension") {
    getCurrentTab().then((response) => {
      if (!response.url.includes("chrome://") && !response.url.includes("chrome.google.com")) {
        chrome.tabs.sendMessage(response.id, { request: "open-extension" });
      }
    });
  }
});
