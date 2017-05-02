import { roundToDecimal } from './math';
/**
 * Turn a hexadecimal color value into an array of red, green, blue values in base 10.
 *
 * @param {string} hexColor String of color value in hexadecimal format.
 * @returns {number[]} Array of red, green, blue values of color.
 * @public
 */
function hexColorToRgb(hexColor) {
  const normalizedHexColor = normalizeHexString(hexColor);

  const red = parseInt(normalizedHexColor.substr(1, 2), 16);
  const green = parseInt(normalizedHexColor.substr(3, 2), 16);
  const blue = parseInt(normalizedHexColor.substr(5, 2), 16);

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
 * Turn a red, green, blue array color into hue saturation lightness format.
 *
 * @param {number[]} rgbColor Array of red, green, blue values of color to be converted.
 * @returns {number[]} Array of HSL values.
 * @public
 */
function rgbColorToHsl(rgbColor) {
  const MAX_CHANNEL_VALUE = 255;
  const rgb = rgbColor.map((channel) => {
    return channel / MAX_CHANNEL_VALUE;
  });

  const red = rgb[0];
  const green = rgb[1];
  const blue = rgb[2];

  const max = Math.max(...rgb);
  const min = Math.min(...rgb);
  const delta = max - min;

  const lightness = (max + min) / 2;

  if (max === min) {
    return [0, 0, roundToDecimal(lightness, 2)];
  }

  const saturation =  lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue;
  switch (max) {
    case red: {
      hue = ((green - blue) / delta) + (green >= blue ? 0 : 6);
      break;
    }
    case green: {
      hue = ((blue - red) / delta) + 2;
      break;
    }
    case blue: {
      hue = ((red - green) / delta) + 4;
      break;
    }
  }
  hue *= 60;

  return [hue, roundToDecimal(saturation, 2), roundToDecimal(lightness, 2)];
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

  return result.substr(0, 7).toLowerCase();
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
  return roundToDecimal(rawRatio, 1);
}

/**
 * Get the appropriate text color of an element based on the background color to maximize color contrast and readbility.
 *
 * @param {string} hexBackgroundColor Background color value in hexadecimal format.
 * @public
 */
function getVisibleTextColor(hexBackgroundColor, hexTextColor = '#000000') {
  return colorContrast(hexBackgroundColor, hexTextColor) > 3 ? hexTextColor : '#FFFFFF';
}


/**
 * Get Eucledian Distance between two RGB colors.
 *
 * @param {number[]} colorOneRgbArray Color to get distance with.
 * @param {number[]} colorTwoRgbArray Color to get distance with.
 * @returns {number} Eucledian distance.
 * @public
 */
function rgbDistance(colorOneRgbArray, colorTwoRgbArray) {
  // Return 0 if the colors are identical
  if ((colorOneRgbArray[0] === colorTwoRgbArray[0])
    && (colorOneRgbArray[1] === colorTwoRgbArray[1])
    && (colorOneRgbArray[2] === colorTwoRgbArray[2])) {
    return 0;
  }

  const MAX_DISTANCE = Math.sqrt(Math.pow(255, 2) * 3);
  const rawDistance = colorOneRgbArray.reduce((d, channel, channelIndex) => {
    return d += Math.pow((channel - colorTwoRgbArray[channelIndex]), 2);
  }, 0);

  return Math.sqrt(rawDistance) / MAX_DISTANCE;
}


/**
 * Get IBM color match of color RGB array.
 *
 * @param {number[]} rgbColorArray Array of red, green, blue values of color to be matched.
 * @param {number} confidenceThreshold 0 to 1 float that determines the flexibility of color matching. 1 equals exact
 * match only.
 * @param {object[]} brandColors Brand colors to match from.
 * @returns {object|boolean} The IBM color object.
 * @public
 */
function getMatchingBrandColor(rgbColorArray, confidenceThreshold, brandColors) {
  // Instantiate result and current distance variables.
  let result = null;
  let currentDistance = 1;
  const hslColorArray = rgbColorToHsl(rgbColorArray);

  // Iterate over brand colors.
  for (const brandColor of brandColors) {
    const distance = rgbDistance(rgbColorArray, brandColor.rgb);

    // If distance is higher than current match distance and it passes the confidence threshold then set the current match to
    // this brand color.
    if ((distance <= (1 - confidenceThreshold)) && (distance < currentDistance)) {
      result = brandColor;
      currentDistance = distance;
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
      const rgb = hexColorToRgb(value);
      const colorObjectValue = {
        grade: parseInt(grade, 10),
        hex: normalizeHexString(value),
        rgb,
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
  rgbColorToHsl,
  normalizeHexString,
  colorContrast,
  getVisibleTextColor,
  rgbDistance,
  getMatchingBrandColor,
  addBrandColorsToArray,
};
