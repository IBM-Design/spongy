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
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
        document.addEventListener('keypress', this.handleKeyPress);
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

  deactivate: function() {
    const {body} = document;
    body.removeChild(EYE_DROPPER);
    document.removeEventListener('mousemove', this.moveEyeDropper);
    document.removeEventListener('click', this.readColor);
    document.removeEventListener('keypress', this.handleKeyPress);
    this.isActive = false;
  },

  moveEyeDropper: function(event) {
    console.log('MOVE');
    const {isActive, activate} = this;
    const {pageX, pageY} = event;
    const colorData = Screenshot.getColorData(pageX, pageY);
    if (!isActive) {
      activate();
    }
    Loupe.move(pageX, pageY, colorData);
  },

  readColor: function () {
    console.log('READ COLOR');
    const color = Loupe.getMiddlePixelColor();
    ColorBox.recolor(color);
  },

  handleKeyPress: function (event) {
    console.log('KEY PRESS');
    const {which} = event;
    if (which === 'Q'.charCodeAt(0) || which === 'q'.charCodeAt(0)) {
      this.deactivate();
    }
  }
};

export default App;
