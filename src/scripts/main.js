import * as IBMColors from '../../node_modules/ibm-design-colors/source/colors';
import App from './components/App';
import { processExtensionMessage } from './utils/chrome';
import MessageType from './constants/MessageType';

let isAppRunning = false;

chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.START_APP, () => {
  if (!isAppRunning) {
    App().configure(IBMColors.palettes);
    isAppRunning = true;
  }
}));

chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.STOP_APP, () => {
  isAppRunning = false;
}));
