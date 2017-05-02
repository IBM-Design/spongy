import MessageType from '../constants/MessageType';

/**
 * FOR INJECTED SCRIPT: Request screen shot data.
 *
 * @param {function} callback Function to call when screen shot request has sent.
 */
function requestScreenshot(callback = () => {}) {
  if (typeof callback !== 'function') {
    throw new Error('[SPONGY] Callback must be a function');
  }

  chrome.runtime.sendMessage(null, {type: MessageType.SCREENSHOT_REQUEST}, () => {
    callback();
  });
}


/**
 * FOR INJECTED SCRIPT: Handle messages from extension.
 *
 * @param {string} messageType The event to listen to events to.
 * @param {function} callback Function to call when screen shot data is ready.
 * @callback
 */
function processExtensionMessage(messageType, callback = () => {}) {
  if (typeof callback !== 'function') {
    throw new Error('[SPONGY] Callback must be a function');
  }

  return (message) => {
    if (message.type === messageType) {
      callback(message.data);
    }
  }
}


/**
 * Wrapper function to query active current tab and send a message to that tab.
 *
 * @param {function} callback Function to invoke when active tab has been queried.
 * @private
 */
function getActiveTab(callback = () => {}) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    callback(tab);
  });
}

/**
 * FOR EXTENSION: Respond to a new screenshot request from an injected script.
 *
 * @public
 */
function sendScreenshot() {
  getActiveTab((tab) => {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(data) {
      chrome.tabs.sendMessage(tab.id, {type: MessageType.SCREENSHOT_DATA, data});
    });
  });
}


/**
 * FOR EXTENSION: Sends message to active tab to start the application.
 *
 * @public
 */
function startApp() {
  getActiveTab((tab) => {
    chrome.tabs.sendMessage(tab.id, {type: MessageType.START_APP});
  });
}

/**
 * FOR EXTENSION: Sends message to active tab to stop the application.
 *
 * @public
 */
function stopApp() {
  getActiveTab((tab) => {
    chrome.tabs.sendMessage(tab.id, {type: MessageType.STOP_APP});
  });
}


/**
 * FOR INJECTED SCRIPT: Sends message to extension that the user has decided to stop the application.
 *
 * @param {function} callback Function to call when the message has been sent.
 */
function requestStopApp(callback = () => {}) {
  chrome.runtime.sendMessage(null, {type: MessageType.STOP_APP_REQUEST}, () => {
    callback();
  });
}

export {
  requestScreenshot,
  processExtensionMessage,
  sendScreenshot,
  startApp,
  stopApp,
  requestStopApp,
}
