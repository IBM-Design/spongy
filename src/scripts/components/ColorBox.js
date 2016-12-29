import {createDiv, createSpan, appendChildren} from '../utils/dom';
import {rgbColorToHex, colorContrast, getVisibleTextColor, getMatchingBrandColor} from '../utils/color';

/**
 * Create Color Box element.
 *
 * @param {string} prefix The prefix than can be applied to the ID of the Color Box to namespace it.
 * @public
 */
function createColorBox(prefix = '') {
  const container = createDiv(`${prefix}ColorBox`);
  const color = createSpan(`${prefix}ColorText`);
  const name = createSpan(`${prefix}NameText`);
  const grade = createSpan(`${prefix}GradeText`);

  appendChildren(container, color, name, grade);

  return {
    container,
    color,
    name,
    grade,
  };
}

/**
 * Updates the text inside the Color Cox with the data of the selected color and matching brand color.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.color Color box hex color element.
 * @param {HTMLElement} colorBox.name Color box brand color name element.
 * @param {HTMLElement} colorBox.grade Color box brand color grade element.
 * @param {string} hexColor Selected color value in hexadecimal format.
 * @param {object} brandColor Object that contains data about the matched brand color.
 * @param {string} brandColor.name Name of the brand color.
 * @param {string} brandColor.grade Grade of the brand color.
 */
function updateColorBoxText(colorBox, hexColor, brandColor) {
  const {color, name, grade} = colorBox;

  let nameText = 'No matching color';
  let gradeText = '';
  if (brandColor) {
    nameText = brandColor.name;
    gradeText = brandColor.grade;
  }

  color.textContent = hexColor;
  name.textContent = nameText
  grade.textContent = gradeText;
}


/**
 * Color and put in text into Color Box based on color data passed into it and brand color matches.
 *
 * @param {object} colorBox Color box elements object.
 * @param {HTMLElement} colorBox.container Color box container element.
 * @param {HTMLElement} colorBox.color Color box hex color element.
 * @param {HTMLElement} colorBox.name Color box brand color name element.
 * @param {HTMLElement} colorBox.grade Color box brand color grade element.
 * @param {number[]} colorData Array of RGB data of color to be evaluated for brand color matches and used to color the
 * Color Box.
 * @public
 */
function updateColorBox(colorBox, colorData) {
  const {container, color, name, grade} = colorBox;
  const rgbColor = Array.from(colorData);
  const hexColor = rgbColorToHex(rgbColor);
  const matchingBrandColor = getMatchingBrandColor(rgbColor, 0.95);

  container.style.backgroundColor = hexColor;
  container.style.color = getVisibleTextColor(hexColor);
  updateColorBoxText(colorBox, hexColor, matchingBrandColor);
}


export {
  createColorBox,
  updateColorBox,
};
