import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';
import { createLoupe, updateLoupePixelColors, getMiddlePixelColor } from './Loupe';
import { createColorBox, updateColorBox } from './ColorBox';
import { createScreenshot, updateScreenshot, getColorData } from './Screenshot';
import { createDiv, appendChildren } from '../utils/dom';
import { addBrandColorsToArray } from '../utils/color';
import MESSAGE_TYPES from '../constants/message_types';

function App(options = {}) {
  const PREFIX = 'spongy-app';

  // If spongy already exists on tab, then don't add again.
  if (document.getElementById(PREFIX)) {
    return false;
  }

  const SIZE = 5;
  const APP = createDiv(PREFIX);
  let isAppActive = false;

  const ui = createDiv(`${PREFIX}-container`);
  const loupe = createLoupe(SIZE, PREFIX);
  const colorBox = createColorBox(PREFIX);
  const screenshot = createScreenshot(PREFIX);

  // Set brand colors
  let brandColors = [];
  if (options.colors) {
    configure(options.colors);
  }

  appendChildren(ui, loupe.element, colorBox.element);
  appendChildren(APP, ui);
  document.body.appendChild(APP);

  chrome.runtime.onMessage.addListener(processExtensionMessage);
  requestScreenshot();


  /**
   * Request screenshot data.
   */
  function requestScreenshot() {
    chrome.runtime.sendMessage({type: MESSAGE_TYPES.SCREENSHOT_REQUEST});
  }


  /**
   * Handle messages from extension.
   *
   * @param {function} callback Function to call when screenshot data is ready.
   * @callback
   */
  function processExtensionMessage(message) {
    switch (message.type) {
      case MESSAGE_TYPES.SCREENSHOT_DATA: {
        updateScreenshot(screenshot, message.data);

        // If no brand colors were configured, add in IBM Design Colors.
        if (brandColors.length === 0) {
          configure(IBMColors.palettes);
        }
        if (!isAppActive) {
          activate();
        }
        break;
      }
      default: {
        console.error('[SPONGY] Extention message not recognized', request);
      }
    }
  }


  /**
   * Function to configure brand color data of App.
   *
   * @param {object[]} data The data object that contains brand color information.
   *
   */
  function configure(data) {
    // Reset brand colors
    brandColors = [];

    // Then add new brand color data
    addBrandColorsToArray(brandColors, data);
  }


  /**
   * Request extension to send new screenshot data.
   */
  function refresh() {
    deactivate();
    requestScreenshot();
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
    APP.classList.add('active');
  }


  /**
   * Deactivate application by removing event listeners and removing the UI.
   */
  function deactivate() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('click', readColor);
    document.removeEventListener('keyup', handleKeyCommand);
    document.removeEventListener('scroll', refresh);
    window.removeEventListener('resize', refresh);

    isAppActive = false;
    APP.classList.remove('active');
  }


  /**
   * Move UI to follow mouse movements.
   *
   * @param {MouseEvent} event The event generated from the mouse movement.
   * @callback
   */
  function move(event) {
    // Get coordinates of mouse location relative to the entire document.
    const {pageX, pageY} = event;

    // Get how far down and to the left the document has been scrolled.
    const {scrollTop, scrollLeft} = document.body;

    // Adjust mouse position coordinates compensating for scrolled position.
    const x = pageX - scrollLeft;
    const y = pageY - scrollTop;

    // Get color data from document Screenshot area based on x and y coordinates.
    const colorData = getColorData(screenshot, x, y, SIZE);

    // Get height and width of main UI ui.
    const width = ui.offsetWidth;
    const height = ui.offsetHeight;

    // Get inner width and height of window.
    const {innerWidth, innerHeight} = window;

    // Determine if the position of the mouse would push the UI out of the view of the user and if so offset the UI
    // position to be flipped over to the opposite side of the mouse cursor.
    const xOffset = (x + width) >= innerWidth ? -width : 0;
    const yOffset = (y + height) >= innerHeight ? -height : 0;

    // Move main UI container.
    ui.style.transform = `translate(${xOffset + x}px, ${yOffset + y}px)`;

    // Update the pixel colors inside the Loupe.
    updateLoupePixelColors(loupe, colorData);
  }


  /**
   * Read the color information of the middle middle pixel of the Loupe and update the Color Box with this information.
   *
   * @callback
   */
  function readColor() {
    const color = getMiddlePixelColor(loupe);
    updateColorBox(colorBox, color, brandColors);
  }


  /**
   * Handle specific key event commands.
   *
   * @param {KeyboardEvent} event The event object generated from user using a keyboard.
   * @callback
   */
  function handleKeyCommand(event) {
    const { keyCode } = event;
    event.preventDefault();

    switch (keyCode) {
      // Deactivate extension with <esc> key
      case 27: {
        deactivate();
        break;
      }
      // Reload extension with <R> key
      case 82: {
        refresh();
        break;
      }
      default:
    }
  }

  return true;
}

export default App;
