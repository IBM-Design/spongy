import {sendScreenshot} from './utils/extension';

chrome.runtime.onMessage.addListener(sendScreenshot);
