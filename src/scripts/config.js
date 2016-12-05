/**
 * Prefix string that is used for creating extension scoped IDs and classes.
 *
 * @type {string} PREFIX
 * @public
 */
const PREFIX = 'IBMEyeDropper';

/**
 * The aspect ratio of device screen resolution to use for canvas adjustments. For example, retina display devices will
 * create a screenshot image that is 2x larger so the eyedropper needs to compensate for this by halfing every position
 * and size calculation.
 *
 * @type {number} PX_RATIO
 * @public
 */
const PX_RATIO = window.devicePixelRatio;

/**
 * Size of detail (pixels) that are shown in the Loupe component.
 *
 * @type {number} SIZE be an odd number.
 * @public
 */
const SIZE = 5;

/**
 * DOM fragment that is used to append to body when the extension is activated.
 *
 * @type {DocumentFragment} EYE_DROPPER
 * @public
 */
const EYE_DROPPER = document.createElement('div');
EYE_DROPPER.id = PREFIX;

export {
  PREFIX,
  PX_RATIO,
  SIZE,
  EYE_DROPPER,
};
