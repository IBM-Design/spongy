import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';

const VARIANCE = 10;

function hexColorToRgb(hexColor) {
  const red = parseInt(hexColor.substr(0, 2), 16);
  const green = parseInt(hexColor.substr(2, 2), 16);
  const blue = parseInt(hexColor.substr(4, 2), 16);
  return [red, green, blue];
}

const ibmColorsArray = [];
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

class Color {
  constructor(rgbArray) {
    this.red = rgbArray[0];
    this.green = rgbArray[1];
    this.blue = rgbArray[2];
    this.ibmColor = null;
  }

  toArray() {
    const {red, green, blue} = this;
    return [red, green, blue];
  }

  toHex() {
    const hexColorArray = this.toArray().map((channel) => {
      return `00${channel.toString(16)}`.substr(-2, 2).toLowerCase();
    });

    return `#${hexColorArray.join('')}`;
  }

  lightness() {
    const maxChannelValue = this.toArray().reduce((maxValue, channel) => {
      return Math.max(maxValue, channel);
    }, 0);

    return maxChannelValue / 255;
  }

  isIbmColor() {
    const colorRgb = this.toArray();
    let result = false;
    let ibmColor = {};

    for (const ibmColor of ibmColorsArray) {
      const ibmColorRgb = ibmColor.rgb;
      const redMatch = (colorRgb[0] <= (ibmColorRgb[0] + VARIANCE)) && (colorRgb[0] >= (ibmColorRgb[0] - VARIANCE));
      const greenMatch = (colorRgb[1] <= (ibmColorRgb[1] + VARIANCE)) && (colorRgb[1] >= (ibmColorRgb[1] - VARIANCE));
      const blueMatch = (colorRgb[2] <= (ibmColorRgb[2] + VARIANCE)) && (colorRgb[2] >= (ibmColorRgb[2] - VARIANCE));
      if (redMatch && greenMatch && blueMatch) {
        result = true;
        this.ibmColor = ibmColor;
      }
    }

    return result;
  }
}

export default Color;
