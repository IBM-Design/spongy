import {sendScreenshot} from './utils/chrome';

chrome.runtime.onMessage.addListener(sendScreenshot);
