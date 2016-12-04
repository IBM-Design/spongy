const EYE_DROPPER = document.createDocumentFragment();

const Loupe = {
  // Size of number of pixels to show in Loupe.
  SIZE: 11,
  PREFIX: 'IBMEyeDropper',
  element: document.createElement('div'),
  pixels: [],
  init: function() {
    const {element, PREFIX, createPixels} = this;
    this.element.id = `${this.PREFIX}Container`;

    // Create pixels to fill in container element.
    this.createPixels();
  },
  render: function () {
    EYE_DROPPER.append(this.element);
  },
  createPixels: function() {
    const {SIZE, PREFIX, pixels, element} = this;
    for (let pixelIndex = 0; pixelIndex < SIZE ** 2; pixelIndex++) {
      const pixel = document.createElement('div');
      pixel.classList.add(`${PREFIX}Pixel`);
      pixel.id = `${PREFIX}Pixel-${pixelIndex};`
      pixel.style.width = `${100 / SIZE}%`;
      pixel.style.height = `${100 / SIZE}%`;
      // Make every new pixel lower in z-index so that the pixel divider shadows will show.
      pixel.style.zIndex = SIZE - pixelIndex + 1;

      // Cache pixels to recolor later.
      pixels.push(pixel);

      // Add to container element.
      element.append(pixel);
    }
  }
};
// Create pixels

const ColorBox = {
  element: document.createElement('div'),

};
const colorBox = document.createElement('div');
colorBox.id = 'IBMEyeDropperColorbox';
EYE_DROPPER.append(colorBox);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type = 'SCREENSHOT') {
    const canvas = document.createElement('canvas');
    canvas.id = 'IBMEyeDropperCanvas';
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;

    const image = new Image();
    image.src = request.imageData;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    let loupeAdded = false;

    document.addEventListener('mousemove', function(event) {
      if (!loupeAdded) {
        const {body} = document;
        body.style.cursor = 'crosshair';
        body.style.pointerEvents = 'none';
        body.append(EYE_DROPPER);
      }
      const {clientX, clientY} = event;
      const [x, y] = [clientX, clientY];
      const color = context.getImageData((x * 2) - Math.round(this.SIZE / 2), (y * 2) - Math.round(this.SIZE / 2), this.SIZE, this.SIZE).data;
      loupeContainer.style.transform = `translate(${x + 4}px, ${y + 4}px)`;


      for (let pixelIndex = 0; pixelIndex < this.SIZE ** 2; pixelIndex++) {
        const colorDataBaseIndex = pixelIndex * 4;
        loupePixelsArray[pixelIndex].style.backgroundColor = `rgba(${color[colorDataBaseIndex]}, ${color[colorDataBaseIndex + 1]}, ${color[colorDataBaseIndex + 2]}, 1)`;
      }
    });

    document.addEventListener('click', function(event) {
      const pixelIndex = Math.round((this.SIZE ** 2 - 1) / 2);
      colorBox.style.backgroundColor = loupePixelsArray[pixelIndex].style.backgroundColor;
    });
  }
});
