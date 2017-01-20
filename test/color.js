import path from 'path';
import { assert } from 'chai';
import Jimp from 'jimp';
import * as IBMColors from '../node_modules/ibm-design-colors/source/colors';
import {
  hexColorToRgb,
  rgbColorToHex,
  normalizeHexString,
  colorContrast,
  matchScore,
  getMatchingBrandColor,
  rgbColorStringToArray,
  addBrandColorsToArray,
} from '../src/scripts/utils/color';


describe('utils.color', () => {
  describe('#rgbColorToHex', () => {
    const color = [255, 255, 255];

    it('should return #FFFFFF', () => {
      assert.strictEqual(rgbColorToHex(color), '#FFFFFF');
    });

    it('should not return #BADA55', () => {
      assert.notStrictEqual(rgbColorToHex(color), '#BADA55');
    });
  });

  describe('#hexColorToRgb', () => {
    const color = '#FFFFFF';

    it('should return [255, 255, 255]', () => {
      assert.deepEqual(hexColorToRgb(color), [255, 255, 255]);
    });

    it('should not return [55, 140, 5]', () => {
      assert.notDeepEqual(hexColorToRgb(color), [55, 140, 5]);
    });
  });

  describe('#normalizeHexString', () => {
    const expectedString = '#FFFFFF';

    // Test string doubling
    it('"#FFF" should return #FFFFFF', () => {
      assert.strictEqual(normalizeHexString('#FFF'), expectedString);
    });

    // Test string trimming
    it('"#ffffffaa" should return #FFFFFF', () => {
      assert.strictEqual(normalizeHexString('#ffffffaa'), expectedString);
    });

    // Test adding of # to string
    it('"ffffff" should return #FFFFFF', () => {
      assert.strictEqual(normalizeHexString('ffffff'), expectedString);
    });
  });

  describe('#colorContrast', () => {
    const baseColor = '#FFFFFF';

    const colors = [
      { hex: '#000000', ratio: 21 },
      { hex: '#330000', ratio: 18.4 },
      { hex: '#333300', ratio: 13 },
      { hex: '#003300', ratio: 14.3 },
      { hex: '#000033', ratio: 20 },
      { hex: '#330033', ratio: 17.7 },
      { hex: '#660000', ratio: 13.4 },
      { hex: '#663300', ratio: 10.3 },
      { hex: '#666600', ratio: 6.1 },
      { hex: '#555555', ratio: 7.5 },
      { hex: '#FF0000', ratio: 4 },
      { hex: '#00FF00', ratio: 1.4 },
      { hex: '#FFFFFF', ratio: 1 },
      { hex: '#3366FF', ratio: 4.7 },
    ];

    for (const color of colors) {
      it(`should return ${color.ratio} when color is ${color.hex}`, () => {
        assert.strictEqual(colorContrast(baseColor, color.hex), color.ratio);
      });
    }
  });

  describe('#matchScore', () => {
    const color = [255, 255, 255];

    it('should return 0.00', () => {
      const testColor = [0, 0, 0];
      assert.strictEqual(roundToHundreds(matchScore(color, testColor)), 0.00);
    });

    it('should return 0.36', () => {
      const testColor = [44, 79, 155];
      assert.strictEqual(roundToHundreds(matchScore(color, testColor)), 0.36);
    });

    it('should return 0.90', () => {
      const testColor = [225, 228, 234];
      assert.strictEqual(roundToHundreds(matchScore(color, testColor)), 0.90);
    });
  });

  describe('#getMatchingIbmColor', () => {
    const confidenceThreshold = 0.95;

    // Create brand colors iterator.
    const brandColors = [];
    addBrandColorsToArray(brandColors, IBMColors.palettes);

    it('should return all brand colors', () => {
      for (const palette of IBMColors.palettes) {
        for (const colorValue of palette.values) {
          const colorArray = hexColorToRgb(normalizeHexString(colorValue.value));
          const color = getMatchingBrandColor(colorArray, confidenceThreshold, brandColors);
          assert.deepEqual(color, {
            grade: parseInt(colorValue.grade, 10),
            name: getCoolGraySynonym(palette.name, colorValue.grade),
            hex: normalizeHexString(colorValue.value),
            rgb: hexColorToRgb(normalizeHexString(colorValue.value)),
          });
        }
      }
    });

    it('should test all color images ', (done) => {
      const COLOR_HEIGHT = 50;
      // Create brand colors iterator.
      for (let quality = 40; quality <= 100; quality += 10) {
        const brandColors = [];
        addBrandColorsToArray(brandColors, IBMColors.palettes);

        Jimp.read(path.join(process.cwd(), 'test/resources', `ibm-design-colors_quality-${quality}.jpg`), (error, image) => {
          if (error) {
            throw error;
          }

          const { height } = image.bitmap;
          const totalColors = height / COLOR_HEIGHT;

          for (let yIndex = 0; yIndex < totalColors; yIndex++) {
            const yPosition = (yIndex * COLOR_HEIGHT) + (COLOR_HEIGHT / 2);
            const pixelColor = image.getPixelColor(50, yPosition);

            const rgbaColor = Jimp.intToRGBA(pixelColor);
            const color = getMatchingBrandColor([rgbaColor.r, rgbaColor.g, rgbaColor.b], confidenceThreshold, brandColors);
            const brandColor = brandColors[yIndex];
            brandColor.name = getCoolGraySynonym(brandColor.name);

            color.quality = quality;
            brandColor.quality = quality;

            color.index = yIndex * COLOR_HEIGHT;
            brandColor.index = yIndex * COLOR_HEIGHT;

            assert.deepEqual(color, brandColor);
          }

          if (quality === 100) {
            done();
          }
        });

      }
    });

    // Test matching colors
    it('should return confident brand color', () => {
      let color = getMatchingBrandColor([253, 214, 0], confidenceThreshold, brandColors);
      assert.deepEqual(color, { grade: 10, name: 'yellow', hex: '#FED500', rgb: [254, 213, 0] });

      color = getMatchingBrandColor([230, 86, 165], confidenceThreshold, brandColors);
      assert.deepEqual(color, { grade: 40, name: 'magenta', hex: '#FF509E', rgb: [255, 80, 158] });
    });

    // Test non-matching color
    it('should return null', () => {
      const color = getMatchingBrandColor([124, 205, 15], confidenceThreshold, brandColors);
      assert.strictEqual(color, null);
    });
  });

  describe('#rgbColorStringToArray', () => {
    it('should return [12, 0, 250]', () => {
      assert.deepEqual(rgbColorStringToArray('rgb(12, 0, 250)'), [12, 0, 250]);
    });

    it('should return [12, 0, 250]', () => {
      assert.deepEqual(rgbColorStringToArray('rgb(12,0,250)'), [12, 0, 250]);
    });
  });

});

function getCoolGraySynonym(name, grade) {
  const gradeInt = parseInt(grade, 10);
  if (name === 'cool-gray' && (gradeInt === 80 || gradeInt === 90)) {
    return 'gray';
  }
  return name;
}

function roundToHundreds(number) {
  return Math.round(number * 100) / 100;
}
