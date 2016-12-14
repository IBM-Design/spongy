import {PREFIX, EYE_DROPPER} from '../config';
import Color from '../models/Color';

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
    const color = new Color(colorArrayData);
    const {element, colorElement, ibmColorNameElement, ibmColorToneElement} = this;
    const colorArray = color.toArray();
    const colorHex = color.toHex();

    this.color = color;
    element.style.backgroundColor = colorHex;

    if (color.isIbmColor()) {
      const ibmColor = color.ibmColor;
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = ibmColor.name;
      ibmColorToneElement.textContent = ibmColor.grade;
    } else {
      colorElement.textContent = colorHex;
      ibmColorNameElement.textContent = '';
      ibmColorToneElement.textContent = '';
    }

    if (color.lightness() >= 0.5) {
      element.classList.remove('inverse');
    } else {
      element.classList.add('inverse');
    }
  }
};

export default ColorBox;
