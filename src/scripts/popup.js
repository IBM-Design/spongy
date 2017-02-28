import MESSAGE_TYPES from './constants/message_types';

chrome.runtime.sendMessage({type: MESSAGE_TYPES.START_APP});


// Set control command key based on operating system.
const osCommandKeys = document.querySelectorAll('[data-keyboard="command"]');
const osIsMac = navigator.platform.includes('Mac');

for (const key of osCommandKeys) {
  key.textContent = osIsMac ? '⌘' : 'Ctrl';
}
