import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';

/**
 * Turn a hexadecimal color value into an array of red, green, blue values in base 10.
 *
 * @param {string} hexColor String of color value in hexadecimal format.
 * @returns {number[]} Array of red, green, blue values of hexadecimal color.
 * @public
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
 * @public
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


/**
 * Generate an inverse matching score based on how far apart two colors are. The lower the number the more closely the
 * colors will resemble each other.
 *
 * @param {number[]} colorOneRgbArray Color to test to match.
 * @param {number[]} colorTwoRgbArray Color to test to match.
 * @returns {number} The inverse resemblance matching color score.
 * @public
 */
function matchScore(colorOneRgbArray, colorTwoRgbArray) {
  return colorOneRgbArray.reduce((score, channel, channelIndex) => {
    return score += Math.abs(channel - colorTwoRgbArray[channelIndex]);
  }, 0);
}


/**
 * This function will return if the color matches a brand color by a higher percentage than the confidence threshold.
 *
 * @param {number} score The match score to be evaluated for its closeness to a given brand color.
 * @param {number} confidenceThreshold On a scale from 0 to 1 what is the confidence threshold required for a score to
 * be confident. 0 beign least confident and 1 being most confident.
 * @returns {boolean} Whether or not the color matches a brand color at a higher percentage than the confident threshold.
 */
function isMatchConfident(score, confidenceThreshold) {
  return (1 - (score / (255 * 3))) >= confidenceThreshold;
}


/**
 * Get IBM color match of color RGB array.
 *
 * @param {number[]} rgbColorArray Array of red, green, blue values of color to be matched.
 * @returns {object|boolean} The IBM color object.
 * @public
 */
function getMatchingIbmColor(rgbColorArray, confidenceThreshold) {
  // Instantiate result and current match score variables.
  let result;
  let currentMatchScore = -1;

  for (const ibmColor of ibmColorsArray) {
    const ibmColorRgb = ibmColor.rgb;

    // If there is an existing current match score select the matched color with the lowest score (closest match).
    if (currentMatchScore > -1) {
      const score = matchScore(rgbColorArray, ibmColorRgb);

      if (score < currentMatchScore) {
        result = ibmColor;
        // Add confidence percentage to result.
        currentMatchScore = score;
        result.isConfident = isMatchConfident(currentMatchScore, confidenceThreshold);
      }
    } else {
      currentMatchScore = matchScore(rgbColorArray, ibmColorRgb);
      result = ibmColor;
      result.isConfident = isMatchConfident(currentMatchScore, confidenceThreshold);
    }
  }

  return result;
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


export {
  hexColorToRgb,
  rgbColorToHex,
  colorContrast,
  matchScore,
  getMatchingIbmColor,
};
