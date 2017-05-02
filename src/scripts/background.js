import { sendScreenshot, processExtensionMessage, stopApp } from './utils/chrome';
import MessageType from './constants/MessageType';

chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.SCREENSHOT_REQUEST, sendScreenshot));
chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.STOP_APP_REQUEST, stopApp));
