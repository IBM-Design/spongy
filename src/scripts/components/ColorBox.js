import {PREFIX, EYE_DROPPER} from '../config';

const ColorBox = {
  element: document.createElement('div'),
  init: function() {
    const {element} = this;
    element.id = `${PREFIX}Colorbox`;
  },

  render: function() {
    EYE_DROPPER.append(this.element);
  },

  recolor: function(color) {
    const {element} = this;
    element.style.backgroundColor = color;
  }
};

export default ColorBox;
