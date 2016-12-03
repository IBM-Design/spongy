const LOUPE_PIXELS = 5;
const loupe = document.createDocumentFragment();
const loupeContainer = document.createElement('div');
const loupePixelsArray = [];
loupeContainer.id = 'IBMEyeDropperContainer';

// Create pixels
for (let pixelIndex = 0; pixelIndex < LOUPE_PIXELS ** 2; pixelIndex++) {
  const pixel = document.createElement('div');
  pixel.classList.add('IBMEyeDropperPixel');
  pixel.id = `IBMEyeDropperPixel-${pixelIndex};`
  pixel.style.width = `${100 / LOUPE_PIXELS}%`;
  pixel.style.height = `${100 / LOUPE_PIXELS}%`;
  pixel.style.zIndex = LOUPE_PIXELS - pixelIndex + 1;

  loupePixelsArray.push(pixel);
  loupeContainer.append(pixel);
}

loupe.append(loupeContainer);

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
        body.append(loupe);
      }
      const {clientX, clientY} = event;
      const [x, y] = [clientX, clientY];
      const color = context.getImageData((x - LOUPE_PIXELS / 2) * 2, (y - LOUPE_PIXELS / 2) * 2, LOUPE_PIXELS, LOUPE_PIXELS).data;
      loupeContainer.style.transform = `translate(${x + 4}px, ${y + 4}px)`;


      for (let pixelIndex = 0; pixelIndex < LOUPE_PIXELS ** 2; pixelIndex++) {
        const colorDataBaseIndex = pixelIndex * 4;
        loupePixelsArray[pixelIndex].style.backgroundColor = `rgba(${color[colorDataBaseIndex]}, ${color[colorDataBaseIndex + 1]}, ${color[colorDataBaseIndex + 2]}, 1)`;
      }
    });
  }
});
