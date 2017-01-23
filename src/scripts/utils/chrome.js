import MESSAGE_TYPES from '../constants/message_types';

/**
 * FOR INJECTED SCRIPT: Request screenshot data.
 *
 * @param {function} callback Function to call when screenshot request has sent.
 */
function requestScreenshot(callback = () => {}) {
  if (typeof callback !== 'function') {
    throw new Error('[SPONGY] Callback must be a function');
  }

  chrome.runtime.sendMessage(null, {type: MESSAGE_TYPES.SCREENSHOT_REQUEST}, () => {
    callback();
  });
}
/**
 * FOR INJECTED SCRIPT: Handle messages from extension.
 *
 * @param {function} callback Function to call when screenshot data is ready.
 * @callback
 */
function processExtensionMessage(callback = () => {}) {
  if (typeof callback !== 'function') {
    throw new Error('[SPONGY] Callback must be a function');
  }

  return (message) => {
    switch (message.type) {
      case MESSAGE_TYPES.SCREENSHOT_DATA: {
        callback(message.data);
        break;
      }
      default: {
        console.error('[SPONGY] Extention message not recognized', request);
      }
    }
  }
}

/**
 * FOR EXTENSION: Respond to a new screenshot request from an injected script.
 *
 * @public
 */
function sendScreenshot() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(data) {
      chrome.tabs.sendMessage(tab.id, {type: MESSAGE_TYPES.SCREENSHOT_DATA, data});
    });
  });
}


export {
  requestScreenshot,
  processExtensionMessage,
  sendScreenshot,
}
