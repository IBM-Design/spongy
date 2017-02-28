import MESSAGE_TYPES from './constants/message_types';

// Listen for new content scripts messages.
chrome.runtime.onMessage.addListener(processIncomingMessages);

function processIncomingMessages(message) {
  const {type} = message;
  switch (type) {
    case MESSAGE_TYPES.SCREENSHOT_REQUEST:
      sendScreenshot();
      break;
    case MESSAGE_TYPES.START_APP:
      startApp();
      break;
    case MESSAGE_TYPES.STOP_APP:
      stopApp();
      break;
  }
}


function startApp() {
  // Insert script and style.
  chrome.tabs.executeScript({
    file: "/scripts/main.js"
  });

  chrome.tabs.insertCSS({
    file: "/styles/main.css"
  });
}


function activeTab(callback) {
  if (typeof callback !== 'function') {
    throw new Error('[background#activeTab]: Callback must be a function');
  }

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    callback(tabs[0]);
  });
}


/**
 * Respond to a new screenshot request from an injected script.
 */
function sendScreenshot() {
  activeTab((tab) => {
   chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(data) {
      chrome.tabs.sendMessage(tab.id, {type: MESSAGE_TYPES.SCREENSHOT_DATA, data});
    });
  });
}
