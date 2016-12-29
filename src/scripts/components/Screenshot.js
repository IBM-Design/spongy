import {createElement} from '../utils/dom';

/**
 * Create Screenshot element.
 *
 * @param {string} prefix The prefix than can be applied to the ID of the Screenshot to namespace it.
 * @public
 */
function createScreenshot(prefix = '') {
  const container = createElement('canvas', `${prefix}Canvas`);
  const context = container.getContext('2d');
  const image = new Image();

  return {
    container,
    context,
    image,
  }
}

/**
 * Get the true pixel height of the browser window.
 *
 * @returns {number} The height of the window compensating for pixel density.
 */
function height() {
  return window.innerHeight * window.devicePixelRatio;
};


/**
 * Get the true pixel width of the browser window.
 *
 * @returns {number} The width of the window compensating for pixel density.
 */
function width() {
  return window.innerWidth * window.devicePixelRatio;
};


/**
 * Update the canvas and the image the screenshot represents.
 *
 * @param {object} screenshot Screenshot elements object.
 * @param {HTMLElement} screenshot.container Screenshot canvas container element.
 * @param {CanvasRenderingContext2D} screenshot.context Screenshot canvas context object.
 * @param {Image} screenshot.image Screenshot image element.
 * @param {string} imageData Base64 screenshot data to be used to render canvas.
 * @public
 */
function updateScreenshot(screenshot, imageData) {
  const {container, context, image} = screenshot;
  container.height = height();
  container.width = width();
  image.src = imageData;

  context.drawImage(image, 0, 0);
}


/**
 * Given a pixel screen value, return adjusted position based on the device pixel density and offset by area size to get
 * an accurate area reading of pixels on canvas.
 *
 * @param {number} position Pixel position which to adjust.
 * @param {number} size The size of the Loupe in how many vertical and horizontal pixels it will have.
 */
function getAdjustedAxisPosition(position, size) {
  const pxRatio = window.devicePixelRatio;
  return (position * pxRatio) - Math.round(size / pxRatio);
}


/**
 * Return pixel data for a given area around a specific position.
 *
 * @param {object} screenshot Screenshot elements object.
 * @param {CanvasRenderingContext2D} screenshot.context Screenshot canvas context object.
 * @param {number} x X coordinate of the center of the area to get pixel data from.
 * @param {number} y Y coordinate of the center of the area to get pixel data from.
 * @param {number} size The size of the Loupe in how many vertical and horizontal pixels it will have.
 * @returns {Uint8ClampedArray} Array-like object with RGBA data of all pixels in requested position area.
 * @public
 */
function getColorData(screenshot, x, y, size) {
  const {context} = screenshot;
  return context.getImageData(getAdjustedAxisPosition(x, size), getAdjustedAxisPosition(y, size), size, size).data;
}


export {
  createScreenshot,
  updateScreenshot,
  getColorData,
};
