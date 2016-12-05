import {SIZE, PREFIX, EYE_DROPPER} from '../config';

const Loupe = {
  element: document.createElement('div'),
  size: SIZE,
  pixels: [],
  middleColor: [],

  init: function(loupeSize) {
    this.element.id = `${PREFIX}Container`;

    // Create pixels to fill in container element.
    this.createPixels();
  },

  render: function() {
    EYE_DROPPER.append(this.element);
  },

  createPixels: function() {
    const {size, pixels, element} = this;
    for (let pixelIndex = 0; pixelIndex < (size * size); pixelIndex++) {
      const pixel = document.createElement('div');
      pixel.classList.add(`${PREFIX}Pixel`);
      pixel.id = `${PREFIX}Pixel-${pixelIndex};`
      pixel.style.width = `${100 / size}%`;
      pixel.style.height = `${100 / size}%`;
      // Make every new pixel lower in z-index so that the pixel divider shadows will show.
      pixel.style.zIndex = size - pixelIndex + 1;

      // Cache pixels to recolor later.
      pixels.push(pixel);

      // Add to container element.
      element.append(pixel);
    }
  },

  move: function(x, y, colorData)  {
    this.element.style.transform = `translate(${x + 4}px, ${y + 4}px)`;
    this.colorPixels(colorData);
  },

  colorPixels: function(colorData) {
    const {pixels, size} = this;
    for (let pixelIndex = 0; pixelIndex < (size * size); pixelIndex++) {
      const colorDataBaseIndex = pixelIndex * 4;

      if (this.isMiddlePixelIndex(pixelIndex)) {
        this.middleColor = [...colorData.slice(colorDataBaseIndex, colorDataBaseIndex + 3)];
      }

      const newColor = `rgba(${colorData[colorDataBaseIndex]}, ${colorData[colorDataBaseIndex + 1]}, ${colorData[colorDataBaseIndex + 2]}, 1)`;
      pixels[pixelIndex].style.backgroundColor = newColor;
    }
  },

  isMiddlePixelIndex: function(pixelIndex) {
    const {size} = this;
    return pixelIndex === Math.round(((size * size) - 1) / 2);
  },

  getMiddlePixelColor: function() {
    return this.middleColor;
  }
};

export default Loupe;
