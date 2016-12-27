import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';

/**
 * Turn a hexadecimal color value into an array of red, green, blue values in base 10.
 *
 * @param {string} hexColor String of color value in hexadecimal format.
 * @returns {number[]} Array of red, green, blue values of hexadecimal color.
 */
function hexColorToRgb(hexColor) {
  // Set offset of hex color string if it starts with a #
  const offset = hexColor.charAt(0) === '#' ? 1 : 0;

  const red = parseInt(hexColor.substr((0 + offset), 2), 16);
  const green = parseInt(hexColor.substr((2 + offset), 2), 16);
  const blue = parseInt(hexColor.substr((4 + offset), 2), 16);

  return [red, green, blue];
}


/**
 * Turn a red, green, blue array color into hexadecimal format.
 *
 * @param {number[]} rgbColor Array of red, green, blue values of color to be converted.
 * @returns {string} String of color value in hexadecimal format.
 */
function rgbColorToHex(rgbColor) {
  // Generate hexadecimal value for each color channel.
  const hexColorArray = rgbColor.map((channel) => {
    // Pad the value with 0 in front of it if it's a single digit number.
    return `00${channel.toString(16)}`.substr(-2, 2).toLowerCase();
  });

  return `#${hexColorArray.join('')}`;
}


/**
 * Get the lightness of color array of RGB values. The lightness refers to the percentage used in the Hue, Saturation,
 * Lightness color format.
 *
 * @param {number[]} color Array of red, green, blue values of color to get lightness from.
 * @returns {number} Float between 0 and 1 that is the lightness of the color.
 */
function lightness(color) {
  // If the color value is an array and is the length of 1, return the lightness value of the first number in the array.
  if (color.length === 1) {
    return color[0] / 255;
  }

  // If the color value is an integer, return the lightness value of the integer.
  if ((Number.isInteger(color))) {
    return color / 255;
  }

  // Recursively get the lightness of all color channel values.
  const remainingColors = color.slice(1);

  // Return the lightness that is the highest among the red, green, and blue channels.
  return Math.max(lightness(color[0]), lightness(remainingColors));
}


/**
 * According to the formula by the W3C found here: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef.
 * All color channel lightness values need to be normalized of the Gamma value...? This function does just that!
 *
 * @param {number} lightness The lightness value to be normalized.
 * @returns {number} Lightness value with normalized Gamma.
 */
function normalizeGamma(lightness) {
  return lightness <= 0.03928 ? lightness / 12.92 : Math.pow(((lightness + 0.055) / 1.055), 2.4);
}


/**
 * According to the W3C, the relative luminance of a color is the relative brightness of any point in a colorspace,
 * normalized to 0 for darkest black and 1 for lightest white. This function returns the relative luminance of a color.
 * The formula followed can be found here: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef.
 *
 * @param {number[]} color The RGB array of values of a color to get the relative luminance from.
 * @returns {number} The relative luminance of the color.
 */
function relativeLuminance(color) {
  const redLightness = lightness(color[0]);
  const greenLightness = lightness(color[1]);
  const blueLightness = lightness(color[2]);

  const R = normalizeGamma(redLightness);
  const G = normalizeGamma(greenLightness);
  const B = normalizeGamma(blueLightness);

  return (0.2126 * R)+ (0.7152 * G) + (0.0722 * B);
}

/**
 * Get contrast ratio of two colors.
 *
 * @param {string} colorOne Color to get contrast ratio of in hexadecimal format.
 * @param {string} colorTwo Color to get contrast ratio of in hexadecimal format.
 * @returns {number} The contrast ratio float up to one decimal place.
 * @public
 */
function colorContrast(colorOne, colorTwo) {
  // Get both colors into RGB array
  const colorOneRgbArray = hexColorToRgb(colorOne);
  const colorTwoRgbArray = hexColorToRgb(colorTwo);

  // Get relative luminance of both colors
  const colorOneRelativeLuminance = relativeLuminance(colorOneRgbArray);
  const colorTwoRelativeLuminance = relativeLuminance(colorTwoRgbArray);

  // Determine the lightest and darkest luminance values
  const lightest = Math.max(colorOneRelativeLuminance, colorTwoRelativeLuminance);
  const darkest = Math.min(colorOneRelativeLuminance, colorTwoRelativeLuminance);

  // Calulate contrast ratio based on this formula: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
  const rawRatio = (lightest + 0.05) / (darkest + 0.05);

  // Round up to single decimal place
  return Math.round(rawRatio * 10) / 10;
}

const ibmColorsArray = [];
// Get all of the IBM colors in an array that is easier to search through.
for (const colorsObject of IBMColors.palettes) {
  for (const colorValue of colorsObject.values) {
    const {grade, value} = colorValue;
    const colorObjectValue = {
      grade,
      hex: `#${value}`,
      rgb: hexColorToRgb(value),
      name: colorsObject.name,
    }

    ibmColorsArray.push(colorObjectValue);
  }
};
/**
 * Get IBM color match of color RGB array.
 *
 * @param {number[]} rgbColorArray Array of red, green, blue values of color to be matched.
 * @returns {object|boolean} The IBM color object.
 */
function getMatchingIbmColor(rgbColorArray) {
  // The range ammount of variance allowed to in order to match a given brand color.
  const VARIANCE = 10;

  for (const ibmColor of ibmColorsArray) {
    const ibmColorRgb = ibmColor.rgb;
    const redMatch = (rgbColorArray[0] <= (ibmColorRgb[0] + VARIANCE)) && (rgbColorArray[0] >= (ibmColorRgb[0] - VARIANCE));
    const greenMatch = (rgbColorArray[1] <= (ibmColorRgb[1] + VARIANCE)) && (rgbColorArray[1] >= (ibmColorRgb[1] - VARIANCE));
    const blueMatch = (rgbColorArray[2] <= (ibmColorRgb[2] + VARIANCE)) && (rgbColorArray[2] >= (ibmColorRgb[2] - VARIANCE));
    if (redMatch && greenMatch && blueMatch) {
      return ibmColor;
    }
  }

  return null;
}

export {
  hexColorToRgb,
  rgbColorToHex,
  lightness,
  normalizeGamma,
  relativeLuminance,
  colorContrast,
  getMatchingIbmColor,
};
