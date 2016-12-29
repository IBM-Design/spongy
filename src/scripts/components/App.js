import {EYE_DROPPER, PREFIX, SIZE} from '../config';
import MESSAGE_TYPES from '../message_types';
import {createLoupe, moveLoupe, updateLoupePixelColors, getMiddlePixelColor} from './Loupe';
import {createColorBox, updateColorBox} from './ColorBox';
import {createDiv, appendChildren} from '../utils/dom';
import {createScreenshot, updateScreenshot, getColorData} from './Screenshot';

function App() {
  const SIZE = 5;
  const PREFIX = 'spongyEyeDropper';
  const APP = createDiv(PREFIX);
  let isAppActive = false;

  const loupe = createLoupe(PREFIX, SIZE);
  const colorBox = createColorBox(PREFIX);
  const screenshot = createScreenshot(PREFIX);

  chrome.runtime.onMessage.addListener(processExtensionMessage);

  /**
   * Handle messages from extension.
   *
   * @param {object} message Message object sent by extension.
   * @param {MESSAGE_TYPES} message.type Type of message.
   * @param {string} message.data Data sent in message.
   * @callback
   */
  function processExtensionMessage(message) {
    switch (message.type) {
      case MESSAGE_TYPES.SCREENSHOT_DATA: {
        updateScreenshot(screenshot, message.data);
        if (!isAppActive) {
          activate();
        }
        break;
      }
      default: {
        console.error('[EYEDROPPER] Extention message not recognized', request);
      }
    }
  }

  /**
   * Request extension to send new screenshot data.
   *
   * @callback
   */
  function refresh() {
    removeUI();
    chrome.runtime.sendMessage(null, {type: MESSAGE_TYPES.SCREENSHOT_REQUEST}, () => {
      appendUI();
    });
  }


  /**
   * Activate application by adding event listeners and showing the UI.
   */
  function activate() {
    document.addEventListener('mousemove', move);
    document.addEventListener('click', readColor);
    document.addEventListener('keyup', handleKeyCommand);
    document.addEventListener('scroll', refresh);
    window.addEventListener('resize', refresh);

    isAppActive = true;
    appendChildren(APP, colorBox.container, loupe.container);
    appendUI();
  }

  function deactivate() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('click', readColor);
    document.removeEventListener('keyup', handleKeyCommand);
    document.removeEventListener('scroll', refresh);
    window.removeEventListener('resize', refresh);

    isAppActive = false;
    removeUI();
  }

  function removeUI() {
    const {body} = document;
    body.style.cursor = null;
    body.style.pointerEvents = null;
    if (document.getElementById(PREFIX)) {
      body.removeChild(APP);
    }
  }

  function appendUI () {
    const {body} = document;
    body.style.cursor = 'crosshair';
    body.style.pointerEvents = 'none';
    body.appendChild(APP);
  }

  function move(event) {
    const {pageX, pageY} = event;
    const {scrollTop, scrollLeft} = document.body;
    const x = pageX - scrollLeft;
    const y = pageY - scrollTop;
    const colorData = getColorData(screenshot, x, y, SIZE);
    moveLoupe(loupe, pageX, pageY);
    updateLoupePixelColors(loupe, colorData);
  }

  function readColor() {
    const color = getMiddlePixelColor(loupe);
    updateColorBox(colorBox, color);
  }

  function handleKeyCommand(event) {
    const {keyCode} = event;
    event.preventDefault();

    switch (keyCode) {
      // Deactivate extension with <esc> key
      case 27:
        deactivate();
        break;

      // Reload extension with <R> key
      case 82:
        refresh();
        break;
      default:
    }
  }
}

export default App;
