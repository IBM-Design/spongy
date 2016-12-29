import {createDiv, appendChildren} from '../utils/dom';
import {rgbColorStringToArray} from '../utils/color';

/**
 * Create Loupe element.
 *
 * @param {string} prefix The prefix than can be applied to the ID of the Loupe to namespace it.
 * @param {number} size The size of the Loupe in how many vertical and horizontal pixels it will have.
 * @public
 */
function createLoupe(prefix = '', size) {
  const container = createDiv(`${prefix}Loupe`);
  const pixels = createPixelsArray(prefix, size);
  const middlePixel = pixels[getMiddlePixelIndex(size)];

  appendChildren(container, ...pixels);

  return {
    container,
    pixels,
    middlePixel,
  };
}


/**
 * Create pixel elements.
 *
 * @param {string} prefix The prefix that is applied to the class name of the pixels.
 * @param {number} size The size of the Loupe in how many vertical and horizontal pixels it will have.
 * @returns {HTMLElement[]} Array of Pixel elements.
 */
function createPixelsArray(prefix, size) {
  const pixels = [];
  const middlePixelIndex = getMiddlePixelIndex(size);

  for (let pixelIndex = 0; pixelIndex < (Math.pow(size, 2)); pixelIndex++) {
    const pixelClassNames = [`${prefix}Pixel`];
    if (pixelIndex === middlePixelIndex) {
      pixelClassNames.push('middle');
    }

    const pixel = createDiv(null, ...pixelClassNames);
    pixel.style.width = `${100 / size}%`;
    pixel.style.height = `${100 / size}%`;
    pixels.push(pixel);
  }
  return pixels;
}


/**
 * Given the size of the Loupe return the index of what the middle pixel is.
 *
 * @param {number} size The size of the loupe.
 * @returns {number} The index of the middle pixel.
 */
function getMiddlePixelIndex(size) {
  return Math.round(((Math.pow(size, 2)) - 1) / 2);
};


/**
 * Move Loupe to a specific x and y location.
 *
 * @param {object} loupe Loupe elements object.
 * @param {HTMLElement} loupe.container Loupe container element.
 * @param {number} x Coordinate for Loupe x positioning.
 * @param {number} y Coordinate for Loupe y positioning.
 * @public
 */
function moveLoupe(loupe, x, y)  {
  const {container} = loupe;
  const {innerWidth, innerHeight} = window;
  const spacing = container.style.height;
  const xOffset = (x + spacing) >= innerWidth ? -spacing : 0;
  const yOffset = (y + spacing) >= innerHeight ? -spacing : 0;

  container.style.transform = `translate(${xOffset + x + 4}px, ${yOffset + y + 4}px)`;
};


/**
 * Color all of the pixels inside the Loupe.
 *
 * @param {object} loupe Loupe elements object.
 * @param {number[]} colorData Array of RGBA values for an area the size of the Loupe.
 * @public
 */
function updateLoupePixelColors(loupe, colorData) {
  const {pixels} = loupe;

  pixels.forEach((pixel, pixelIndex) => {
    const colorDataBaseIndex = pixelIndex * 4;
    const color = `rgba(${colorData[colorDataBaseIndex]}, ${colorData[colorDataBaseIndex + 1]}, ${colorData[colorDataBaseIndex + 2]}, 1)`;
    pixels[pixelIndex].style.backgroundColor = color;
  });
};


function getMiddlePixelColor(loupe) {
  const {middlePixel} = loupe;
  return rgbColorStringToArray(middlePixel.style.backgroundColor);
}


export {
  createLoupe,
  moveLoupe,
  updateLoupePixelColors,
  getMiddlePixelColor,
};
