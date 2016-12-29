import MESSAGE_TYPES from '../constants/message_types';

function sendScreenshot() {
  chrome.tabs.query({active: true}, function(tabs) {
    const tab = tabs[0];
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(data) {
      chrome.tabs.sendMessage(tab.id, {type: MESSAGE_TYPES.SCREENSHOT_DATA, data});
    });
  });
}


export {
  sendScreenshot,
}
