import {createDiv, createParagraph, createTextInput, appendChildren} from '../utils/dom';
import {hexColorToRgb, rgbColorToHex, normalizeHexString, colorContrast, getVisibleTextColor, getMatchingBrandColor} from '../utils/color';

/**
 * Create Color Box element.
 *
 * @param {string} prefix Namespaced prefix for element ids.
 * @public
 */
function createColorBox(prefix = '') {
  const id = `${prefix}-color-box`;
  const element = createDiv(id);
  const container = createDiv(`${id}__container`);
  const brand = createBrandElement(id);
  const rgb = createParagraph(`${id}__color--rgb`);
  const hex = createParagraph(`${id}__color--hex`);

  appendChildren(container, brand, rgb, hex);
  appendChildren(element, container);

  return {
    element,
    container,
    brand,
    rgb,
    hex,
  };
}

/**
 * Create brand color element.
 *
 * @param {string} prefix Namespaced prefix for element ids.
 */
function createBrandElement(prefix) {
  const brand = createTextInput(`${prefix}__brand`);
  brand.size = 17;
  brand.addEventListener('keypress', (event) => { event.preventDefault(); });

  return brand;
}

/**
 * Updates the text inside the Color Cox with the data of the selected color and matching brand color.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.rgb Color box rgb color element.
 * @param {HTMLElement} colorBox.hex Color box hex color element.
 * @param {HTMLElement} colorBox.brand Color box brand color brand input text element.
 * @param {string} hexColor Selected color value in hexadecimal format.
 * @param {object} brandColor Object that contains data about the matched brand color.
 * @param {string} brandColor.name Name of the brand color.
 * @param {string} brandColor.grade Grade of the brand color.
 */
function updateColorBoxText(colorBox, hexColor, brandColor) {
  const {rgb, hex, brand} = colorBox;
  const noMatch = 'No match';

  let brandText = brandColor ? `'${brandColor.name}', ${brandColor.grade}` : noMatch;
  const rgbText = hexColor ? `RGB ${hexColorToRgb(hexColor).join(', ')}` : '';
  const hexText = hexColor ? `HEX ${normalizeHexString(hexColor)}` : '';

  rgb.textContent = rgbText;
  hex.textContent = hexText;

  brand.value = brandText;

  if (brandText !== noMatch) {
    brand.select();
  } else {
    brand.blur();
  }
}


/**
 * Color and put in text into Color Box based on color data passed into it and brand color matches.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.element Color box main element.
 * @param {HTMLElement} colorBox.container Color box container element.
 * @param {HTMLElement} colorBox.brand Color box brand color brand input text element.
 * @param {number[]} colorData Array of RGB data of color to be evaluated for brand color matches and used to color the
 * Color Box.
 * @public
 */
function updateColorBox(colorBox, colorData, brandColors) {
  const {element, container, brand} = colorBox;
  const rgbColor = Array.from(colorData);
  const hexColor = rgbColorToHex(rgbColor);
  const matchingBrandColor = getMatchingBrandColor(rgbColor, 0.95, brandColors);
  const textColor = getVisibleTextColor(hexColor, '#323232');

  element.classList.add('active');
  container.style.backgroundColor = hexColor;
  container.style.color = textColor;
  brand.style.color = textColor;

  updateColorBoxText(colorBox, hexColor, matchingBrandColor);
}


export {
  createColorBox,
  updateColorBox,
};
