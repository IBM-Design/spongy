import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';
import { debounce } from 'lodash';
import { createLoupe, updateLoupePixelColors, getMiddlePixelColor } from './Loupe';
import { createColorBox, updateColorBox } from './ColorBox';
import { createScreenshot, updateScreenshot, getColorData } from './Screenshot';
import { createElement, createDiv, appendChildren } from '../utils/dom';
import { addBrandColorsToArray } from '../utils/color';
import { requestScreenshot, processExtensionMessage, requestStopApp } from '../utils/chrome';
import MessageType from '../constants/MessageType';
import KeyCode from '../constants/KeyCode';

function App(options = {}) {
  const SIZE = 5;
  const PREFIX = 'spongy-app';
  const APP = createDiv(PREFIX);

  loadStyles();
  requestScreenshot();

  // Set brand colors
  let brandColors = [];
  if (options.colors) {
    configure(options.colors);
  }

  chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.SCREENSHOT_DATA, getScreenshotData));
  chrome.runtime.onMessage.addListener(processExtensionMessage(MessageType.STOP_APP, deactivate));

  const ui = createDiv(`${PREFIX}-container`);
  const loupe = createLoupe(SIZE, PREFIX);
  const colorBox = createColorBox(PREFIX);
  const screenshot = createScreenshot(PREFIX);

  /**
   * De-bounce refresh function so that it can be added and removed as event listener handlers.
   *
   * @type {function}
   */
  const deBounceRefresh = debounce(refresh, 50);

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
   * Load styles on to current page.
   */
  function loadStyles() {
    const stylesUrl = chrome.extension.getURL('/styles/main.css');
    const exitingStyles = document.querySelectorAll(`[href='${stylesUrl}'`);

    // Check if there are already existing links that point to the styles URL. If there is none, load the styles.
    if (exitingStyles.length === 0) {
      // Create link element
      const styles = createElement('link');
      styles.href = stylesUrl;
      styles.rel = 'stylesheet';

      // Append link to head.
      const head = document.querySelector('head');
      head.appendChild(styles);
    }
  }

  /**
   * Handle getting screenshot data.
   *
   * @param {string} screenshotData Raw screenshot image data.
   * @callback
   */
  function getScreenshotData(screenshotData) {
    updateScreenshot(screenshot, screenshotData);

    // If no brand colors were configured, add in IBM Design Colors.
    if (brandColors.length === 0) {
      configure(IBMColors.palettes);
    }

    activate();
  }

  /**
   * Request extension to send new screen shot data.
   *
   * @callback
   */
  function refresh() {
    removeUI();
    setTimeout(requestScreenshot, 0);
  }


  /**
   * Activate application by adding event listeners and showing the UI.
   */
  function activate() {
    if (!document.body.contains(document.getElementById(PREFIX))) {
      document.addEventListener('mousemove', move);
      document.addEventListener('click', readColor);
      document.addEventListener('keyup', handleKeyCommand);
      document.addEventListener('scroll', deBounceRefresh);
      window.addEventListener('resize', deBounceRefresh);

      appendUI();
    }
  }


  /**
   * Deactivate application by removing event listeners and removing the UI.
   */
  function deactivate() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('click', readColor);
    document.removeEventListener('keyup', handleKeyCommand);
    document.removeEventListener('scroll', deBounceRefresh);
    window.removeEventListener('resize', deBounceRefresh);

    removeUI();
  }


  /**
   * Append main App element from document body.
   */
  function appendUI() {
    appendChildren(ui, loupe.element, colorBox.element);
    appendChildren(APP, ui);
    document.body.appendChild(APP);
  }


  /**
   * Remove main App element from document body.
   */
  function removeUI() {
    if (document.body.contains(APP)) {
      document.body.removeChild(APP);
    }
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

    // Get color data from document Screen shot area based on x and y coordinates.
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
      case KeyCode.ESC: {
        requestStopApp();
        break;
      }

      case KeyCode.R: {
        refresh();
        break;
      }
      default:
    }
  }

  return {
    configure,
  };
}

export default App;
