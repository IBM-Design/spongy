/**
 * Turn a hexadecimal color value into an array of red, green, blue values in base 10.
 *
 * @param {string} hexColor String of color value in hexadecimal format.
 * @returns {number[]} Array of red, green, blue values of color.
 * @public
 */
function hexColorToRgb(hexColor) {
  const normalizedHexColor = normalizeHexString(hexColor);

  const red = parseInt(normalizedHexColor.substr((1), 2), 16);
  const green = parseInt(normalizedHexColor.substr((3), 2), 16);
  const blue = parseInt(normalizedHexColor.substr((5), 2), 16);

  return [red, green, blue];
}


/**
 * Turn an RGB CSS color function string into an RGB array.
 *
 * @param {string} rgbColorString of color value in hexadecimal format.
 * @returns {number[]} Array of red, green, blue values of color.
 * @public
 */
function rgbColorStringToArray(rgbColorString) {
  const rgbColorArray = rgbColorString.match(/\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/);
  const red = parseInt(rgbColorArray[1], 10);
  const green = parseInt(rgbColorArray[2], 10);
  const blue = parseInt(rgbColorArray[3], 10);

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

  return normalizeHexString(hexColorArray.join(''));
}

/**
 * Normalize a given string into a hexadecimal color value format by adding a #, doubling 3 character hexadecimal
 * values, and uppercasing the entire string.
 *
 * @param {string} hexString String to be normalized.
 * @return {string} Normalized string value.
 * @public
 */
function normalizeHexString(hexString) {
  let result = hexString;


  if (result.charAt(0) !== '#') {
    result = `#${result}`;
  }

  if (result.length === 4) {
    result = `#${result[1]}${result[1]}${result[2]}${result[2]}${result[3]}${result[3]}`
  }

  return result.substr(0, 7).toUpperCase();
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
 * Get the appropriate text color of an element based on the background color to maximize color contrast and readbility.
 *
 * @param {string} hexBackgroundColor Background color value in hexadecimal format.
 * @public
 */
function getVisibleTextColor(hexBackgroundColor) {
  return colorContrast(hexBackgroundColor, '#FFFFFF') > 3 ? '#FFFFFF' : '#000000';
}


/**
 * Generate a score based on how closely two colors match from scale of 0 to 1. 1 means an exact match.
 *
 * @param {number[]} colorOneRgbArray Color to test to match.
 * @param {number[]} colorTwoRgbArray Color to test to match.
 * @returns {number} Score from 0 to 1 of how closely two colors match.
 * @public
 */
function matchScore(colorOneRgbArray, colorTwoRgbArray) {
  const rawScore = colorOneRgbArray.reduce((score, channel, channelIndex) => {
    return score += Math.abs(channel - colorTwoRgbArray[channelIndex]);
  }, 0);

  return 1 - (rawScore / (255 * 3));
}


/**
 * Get IBM color match of color RGB array.
 *
 * @param {number[]} rgbColorArray Array of red, green, blue values of color to be matched.
 * @returns {object|boolean} The IBM color object.
 * @public
 */
function getMatchingBrandColor(rgbColorArray, confidenceThreshold, brandColors) {
  // Instantiate result and current match score variables.
  let result = null;
  let currentMatchScore = -1;

  // Iterate over brand colors.
  for (const brandColor of brandColors) {
    const score = matchScore(rgbColorArray, brandColor.rgb);

    // If score is higher than current match score and it passes the confidence threshold then set the current match to
    // this brand color.
    if ((score > currentMatchScore) && (score >= confidenceThreshold)) {
      result = brandColor;
      currentMatchScore = score;
    }
  }

  return result;
}

/**
 * Add brand colors to array to build a shallow list of brand colors to match for.
 *
 * @param {object[]} targetArray Array to push new brand colors to.
 * @param {object[]} data Brand color data to be added to array.
 * @public
 */
function addBrandColorsToArray(targetArray, data) {
  // Example of required data structure:
  //   data = [
  //     {
  //       name: blue,
  //       values: [
  //         {
  //           name: <optional>,
  //           grade: 10,
  //           value: 'c8daf4',
  //         },
  //       ]
  //     },
  //   ]
  for (const colorsObject of data) {
    for (const colorValue of colorsObject.values) {
      const {name, grade, value} = colorValue;
      const colorObjectValue = {
        grade: parseInt(grade, 10),
        hex: normalizeHexString(value),
        rgb: hexColorToRgb(value),
        name: name || colorsObject.name,
      }

      targetArray.push(colorObjectValue);
    }
  }
}


export {
  hexColorToRgb,
  rgbColorStringToArray,
  rgbColorToHex,
  normalizeHexString,
  colorContrast,
  getVisibleTextColor,
  matchScore,
  getMatchingBrandColor,
  addBrandColorsToArray,
};
