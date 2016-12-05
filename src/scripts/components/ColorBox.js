import {PREFIX, EYE_DROPPER} from '../config';
import * as IBMColors from '../../../node_modules/ibm-design-colors/source/colors';

const colorsMap = new Map();
for (const colorsObject of IBMColors.palettes) {
  for (const colorValue of colorsObject.values) {
    const colorObjectValue = colorValue;
    colorObjectValue.name = colorsObject.name;
    colorsMap.set(colorValue.value, colorObjectValue);
  }
};

const ColorBox = {
  element: document.createElement('div'),
  colorElement: document.createElement('span'),
  ibmColorNameElement: document.createElement('span'),
  ibmColorToneElement: document.createElement('span'),
  init: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    element.id = `${PREFIX}Colorbox`;
    colorElement.id = `${PREFIX}ColorText`;
    ibmColorNameElement.id = `${PREFIX}NameText`;
    ibmColorToneElement.id = `${PREFIX}ToneText`;
  },

  render: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    element.append(colorElement);
    element.append(ibmColorNameElement);
    element.append(ibmColorToneElement);
    EYE_DROPPER.append(this.element);
  },

  decToHex: function (dec) {
    return `00${dec.toString(16)}`.substr(-2, 2).toLowerCase();
  },

  recolor: function(color) {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    const hexColorArray = color.map(this.decToHex);
    const hexColor = `#${hexColorArray.join('')}`;

    console.log(color, hexColorArray, hexColor);
    element.style.backgroundColor = hexColor;

    if (colorsMap.has(hexColor)) {
      const ibmColor = colorsMap.get(hexColor);
      colorElement.textContent = `#${hexColor}`;
      ibmColorNameElement.textContent = ibmColor.name;
      ibmColorToneElement.textContent = ibmColor.tone;

      if (ibmColor.tone >= 30) {
        element.classList.add('inverse');
      } else {
        element.classList.reverse('inverse');
      }
    } else {
      element.textContent = hexColor;
    }
  }
};

export default ColorBox;
