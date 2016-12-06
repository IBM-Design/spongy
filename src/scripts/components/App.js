import {EYE_DROPPER, PREFIX} from '../config';
import MESSAGE_TYPES from '../message_types';
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
    this.handleViewChange = this.handleViewChange.bind(this);
    this.activate = this.activate.bind(this);
    chrome.runtime.onMessage.addListener(this.processExtensionMessage);
  },

  processExtensionMessage: function(request, sender) {
    switch (request.type) {
      case MESSAGE_TYPES.SCREENSHOT_DATA: {
        Screenshot.setData(request.data);
        document.addEventListener('mousemove', this.moveEyeDropper);
        document.addEventListener('click', this.readColor);
        document.addEventListener('keypress', this.handleKeyPress);
        document.addEventListener('scroll', this.handleViewChange);
        window.addEventListener('resize', this.handleViewChange);
        break;
      }
      default: {
        console.error('[EYEDROPPER] Extention message not recognized', request);
      }
    }
  },

  activate: function() {
    Loupe.render();
    ColorBox.render();
    Screenshot.render();

    this.appendUI();
    this.isActive = true;
  },

  deactivate: function() {
    document.removeEventListener('mousemove', this.moveEyeDropper);
    document.removeEventListener('click', this.readColor);
    document.removeEventListener('keypress', this.handleKeyPress);
    document.removeEventListener('scroll', this.handleViewChange);
    window.removeEventListener('resize', this.handleViewChange);
    this.removeUI();
    this.isActive = false;
  },

  removeUI: function() {
    const {body} = document;
    body.style.cursor = null;
    body.style.pointerEvents = null;

    if (document.getElementById(PREFIX)) {
      body.removeChild(EYE_DROPPER);
    }
  },

  appendUI: function () {
    const {body} = document;
    body.style.cursor = 'crosshair';
    body.style.pointerEvents = 'none';

    body.appendChild(EYE_DROPPER);
  },

  moveEyeDropper: function(event) {
    const {isActive, activate} = this;
    const {pageX, pageY} = event;
    const {scrollTop, scrollLeft} = document.body;
    const x = pageX - scrollLeft;
    const y = pageY - scrollTop;
    const colorData = Screenshot.getColorData(x, y);
    if (!isActive) {
      activate();
    }
    Loupe.move(pageX, pageY, colorData);
  },

  readColor: function () {
    const color = Loupe.getMiddlePixelColor();
    ColorBox.recolor(color);
  },

  handleKeyPress: function (event) {
    const {which} = event;
    if (which === 'Q'.charCodeAt(0) || which === 'q'.charCodeAt(0)) {
      this.deactivate();
    }
  },

  handleViewChange: function() {
    this.removeUI();
    chrome.runtime.sendMessage(null, {type: MESSAGE_TYPES.SCREENSHOT_REQUEST}, () => {
      Screenshot.render();
      this.appendUI();
    });
  }
};

export default App;
