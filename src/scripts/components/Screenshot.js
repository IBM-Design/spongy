import {SIZE, PREFIX, PX_RATIO, EYE_DROPPER} from '../config';

const Screenshot = {
  element: document.createElement('canvas'),
  image: new Image(),
  size: SIZE,
  context: null,

  height: function() {
    return window.innerHeight * PX_RATIO;
  },

  width: function() {
    return window.innerWidth * PX_RATIO;
  },

  init: function() {
    const {element} = this;
    element.id = `${PREFIX}Canvas`;
    this.context = element.getContext('2d');
    this.getAdjustedAxisPosition = this.getAdjustedAxisPosition.bind(this);
  },

  render: function(imageData) {
    const {element, image, context, height, width} = this;
    element.height = height();
    element.width = width();
    context.drawImage(image, 0, 0);
    EYE_DROPPER.append(element);
  },

  setData: function(data) {
    const {image} = this;
    image.src = data;
  },

  getAdjustedAxisPosition: function(position) {
    return (position * PX_RATIO) - Math.round(this.size / PX_RATIO);
  },

  getColorData: function(x, y) {
    const {context, getAdjustedAxisPosition} = this;
    return context.getImageData(getAdjustedAxisPosition(x), getAdjustedAxisPosition(y), this.size, this.size).data;
  }

};

export default Screenshot;
