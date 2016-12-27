import {PREFIX, EYE_DROPPER} from '../config';
import {rgbColorToHex, colorContrast, getMatchingIbmColor} from '../utils/color';

const ColorBox = {
  element: document.createElement('div'),
  colorElement: document.createElement('span'),
  ibmColorNameElement: document.createElement('span'),
  ibmColorToneElement: document.createElement('span'),
  color: [0, 0, 0],

  init: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    element.id = `${PREFIX}Colorbox`;
    colorElement.id = `${PREFIX}ColorText`;
    ibmColorNameElement.id = `${PREFIX}NameText`;
    ibmColorToneElement.id = `${PREFIX}ToneText`;
  },

  render: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    element.appendChild(colorElement);
    element.appendChild(ibmColorNameElement);
    element.appendChild(ibmColorToneElement);
    EYE_DROPPER.appendChild(this.element);
  },

  recolor: function(colorArrayData) {
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    const colorArray = Array.from(colorArrayData);
    const colorHex = rgbColorToHex(colorArray);
    const matchingIbmColor = getMatchingIbmColor(colorArray);

    this.color = colorArray;
    element.style.backgroundColor = colorHex;

    if (matchingIbmColor) {
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = matchingIbmColor.name;
      ibmColorToneElement.textContent = matchingIbmColor.grade;
    } else {
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = '';
      ibmColorToneElement.textContent = '';
    }

    if (colorContrast(colorHex, '#FFFFFF') < 3) {
      element.classList.remove('inverse');
    } else {
      element.classList.add('inverse');
    }
  }
};

export default ColorBox;
