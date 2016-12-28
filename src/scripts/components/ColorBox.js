import {PREFIX, EYE_DROPPER} from '../config';
import {rgbColorToHex, colorContrast, getMatchingIbmColor} from '../utils/color';

const ColorBox = {
  element: document.createElement('div'),
  colorElement: document.createElement('span'),
  ibmColorNameElement: document.createElement('span'),
  ibmColorGradeElement: document.createElement('span'),
  color: [0, 0, 0],

  init: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorGradeElement} = this;
    element.id = `${PREFIX}Colorbox`;
    colorElement.id = `${PREFIX}ColorText`;
    ibmColorNameElement.id = `${PREFIX}NameText`;
    ibmColorGradeElement.id = `${PREFIX}GradeText`;
  },

  render: function() {
    const {element, colorElement, ibmColorNameElement, ibmColorGradeElement} = this;
    element.appendChild(colorElement);
    element.appendChild(ibmColorNameElement);
    element.appendChild(ibmColorGradeElement);
    EYE_DROPPER.appendChild(this.element);
  },

  recolor: function(colorArrayData) {
    const {element, colorElement, ibmColorNameElement, ibmColorGradeElement} = this;
    const colorArray = Array.from(colorArrayData);
    const colorHex = rgbColorToHex(colorArray);
    const matchingIbmColor = getMatchingIbmColor(colorArray, 0.95);

    this.color = colorArray;
    element.style.backgroundColor = colorHex;

    if (matchingIbmColor) {
      const prefix = matchingIbmColor.isConfident ? '⨻' :'';
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = `${prefix} ${matchingIbmColor.name}`;
      ibmColorGradeElement.textContent = matchingIbmColor.grade;
    } else {
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = '';
      ibmColorGradeElement.textContent = '';
    }

    if (colorContrast(colorHex, '#FFFFFF') < 3) {
      element.classList.remove('inverse');
    } else {
      element.classList.add('inverse');
    }
  }
};

export default ColorBox;
