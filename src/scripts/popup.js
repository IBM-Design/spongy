import {sendScreenshot} from './utils/chrome';

const osCommandKeys = document.querySelectorAll('[data-keyboard="command"]');
const osIsMac = navigator.platform.includes('Mac');

for (const key of osCommandKeys) {
  key.textContent = osIsMac ? '⌘' : 'Ctrl';
}

sendScreenshot();
