import {createDiv, createSpan, createTextInput, appendChildren} from '../utils/dom';
import {rgbColorToHex, normalizeHexString, colorContrast, getVisibleTextColor, getMatchingBrandColor} from '../utils/color';

/**
 * Create Color Box element.
 *
 * @param {string} prefix The prefix than can be applied to the ID of the Color Box to namespace it.
 * @public
 */
function createColorBox(prefix = '') {
  const container = createDiv(`${prefix}ColorBox`);
  const color = createSpan(`${prefix}ColorText`);
  const brandInput = createTextInput(`${prefix}BrandText`);
  brandInput.placeholder = 'No match';

  appendChildren(container, color, brandInput);

  return {
    container,
    color,
    brandInput,
  };
}

/**
 * Updates the text inside the Color Cox with the data of the selected color and matching brand color.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.color Color box hex color element.
 * @param {HTMLElement} colorBox.brandInput Color box brand color brand input text element.
 * @param {string} hexColor Selected color value in hexadecimal format.
 * @param {object} brandColor Object that contains data about the matched brand color.
 * @param {string} brandColor.name Name of the brand color.
 * @param {string} brandColor.grade Grade of the brand color.
 */
function updateColorBoxText(colorBox, hexColor, brandColor) {
  const {color, brandInput} = colorBox;

  let brandInputText = '';

  if (brandColor) {
    brandInputText = `'${brandColor.name}', ${brandColor.grade}`;
  }

  color.textContent = normalizeHexString(hexColor);
  brandInput.value = brandInputText;
  brandInput.select();
}


/**
 * Color and put in text into Color Box based on color data passed into it and brand color matches.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.container Color box container element.
 * @param {HTMLElement} colorBox.color Color box hex color element.
 * @param {HTMLElement} colorBox.brandInput Color box brand color brand input text element.
 * @param {number[]} colorData Array of RGB data of color to be evaluated for brand color matches and used to color the
 * Color Box.
 * @public
 */
function updateColorBox(colorBox, colorData, brandColors) {
  const {container} = colorBox;
  const rgbColor = Array.from(colorData);
  const hexColor = rgbColorToHex(rgbColor);
  const matchingBrandColor = getMatchingBrandColor(rgbColor, 0.95, brandColors);

  container.style.backgroundColor = hexColor;
  container.style.color = getVisibleTextColor(hexColor);
  container.classList.add('active');
  updateColorBoxText(colorBox, hexColor, matchingBrandColor);
}


export {
  createColorBox,
  updateColorBox,
};
