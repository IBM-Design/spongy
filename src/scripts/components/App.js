import {EYE_DROPPER} from '../config';
import Loupe from './Loupe';
import ColorBox from './ColorBox';
import Screenshot from './Screenshot';

const App = {
  isActive: false,
  init: function () {
    Loupe.init();
    ColorBox.init();
    Screenshot.init();
    this.processExtensionMessage = this.processExtensionMessage.bind(this);
    this.moveEyeDropper = this.moveEyeDropper.bind(this);
    this.activate = this.activate.bind(this);
    chrome.runtime.onMessage.addListener(this.processExtensionMessage);
  },

  processExtensionMessage: function(request, sender) {
    switch (request.type) {
      case 'SCREENSHOT': {
        console.log('GOT DATA');
        Screenshot.setData(request.data);
        document.addEventListener('mousemove', this.moveEyeDropper);
        document.addEventListener('click', this.readColor);
        break;
      }
      default: {
        console.error('[EYEDROPPER] Extention message not recognized', request);
      }
    }
  },

  activate: function() {
    const {body} = document;
    body.style.cursor = 'crosshair';
    body.style.pointerEvents = 'none';

    Loupe.render();
    ColorBox.render();
    Screenshot.render();
    body.append(EYE_DROPPER);
    this.isActive = true;
  },

  moveEyeDropper: function(event) {
    const {isActive, activate} = this;
    const {clientX, clientY} = event;
    const colorData = Screenshot.getColorData(clientX, clientY);
    if (!isActive) {
      activate();
    }
    Loupe.move(clientX, clientY, colorData);
  },

  readColor: function () {
    const color = Loupe.getMiddlePixelColor();
    ColorBox.recolor(color);
  }
};

export default App;
