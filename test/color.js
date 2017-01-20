import path from 'path';
import { assert } from 'chai';
import Jimp from 'jimp';
import * as IBMColors from '../node_modules/ibm-design-colors/source/colors';
import {
  hexColorToRgb,
  rgbColorToHex,
  rgbColorToHsl,
  normalizeHexString,
  colorContrast,
  rgbDistance,
  getMatchingBrandColor,
  rgbColorStringToArray,
  addBrandColorsToArray,
} from '../src/scripts/utils/color';
import { roundToDecimal } from '../src/scripts/utils/math';
import testColors from './resources/colors';
import testColorContrastRatios from './resources/color-contrast-ratios';


describe('utils.color', () => {
  describe('#rgbColorToHex', () => {
    for (const color of testColors) {
      it(`should return ${color.hex}`, () => {
        assert.strictEqual(rgbColorToHex(color.rgb), color.hex);
      });
    }
  });

  describe('#hexColorToRgb', () => {
    for (const color of testColors) {
      it(`should return [${color.rgb.join(', ')}]`, () => {
        assert.deepEqual(hexColorToRgb(color.hex), color.rgb);
      });
    }
  });

  describe('#rgbColorToHsl', () => {
    for (const color of testColors) {
      it(`should return [${color.hsl.join(', ')}]`, () => {
        assert.deepEqual(rgbColorToHsl(color.rgb), color.hsl);
      })
    }
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


  describe('#rgbColorStringToArray', () => {
    for (const color of testColors) {
      it(`should return [${color.rgb.join(', ')}]`, () => {
        assert.deepEqual(rgbColorStringToArray(`rgb(${color.rgb.join(',')})`), color.rgb);
      });
    }
  });


  describe('#colorContrast', () => {
    const white = '#FFFFFF';
    for (const color of testColorContrastRatios) {
      it(`should return ${color.white} when color is ${color.hex}`, () => {
        assert.strictEqual(colorContrast(white, color.hex), color.white);
      });
    }

    const black = '#000000';
    for (const color of testColorContrastRatios) {
      it(`should return ${color.black} when color is ${color.hex}`, () => {
        assert.strictEqual(colorContrast(black, color.hex), color.black);
      });
    }
  });

  describe('Color Distance', () => {
    const rgb = [255, 255, 255];
    it('should return proper RGB Distance', () => {
      let testColor = [0, 0, 0];
      assert.strictEqual(roundToDecimal(rgbDistance(rgb, testColor), 2), 1);

      testColor = [255, 255, 255];
      assert.strictEqual(roundToDecimal(rgbDistance(rgb, testColor), 2), 0);

      testColor = [44, 79, 155];
      assert.strictEqual(roundToDecimal(rgbDistance(rgb, testColor), 2), 0.65);

      testColor = [225, 228, 234];
      assert.strictEqual(roundToDecimal(rgbDistance(rgb, testColor), 2), 0.1);
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

    // Test color images with different JPG qualities
    // it('should match all color images', (done) => {
    //   const COLOR_HEIGHT = 50;
    //
    //   for (let quality = 40; quality <= 100; quality += 10) {
    //     // Create brand colors iterator.
    //     const brandColors = [];
    //     addBrandColorsToArray(brandColors, IBMColors.palettes);
    //
    //     Jimp.read(path.join(process.cwd(), 'test/resources', `ibm-design-colors_quality-${quality}.jpg`), (error, image) => {
    //       if (error) {
    //         throw error;
    //       }
    //
    //       const { height } = image.bitmap;
    //       const totalColors = height / COLOR_HEIGHT;
    //
    //       for (let yIndex = 0; yIndex < totalColors; yIndex++) {
    //         const yPosition = (yIndex * COLOR_HEIGHT) + (COLOR_HEIGHT / 2);
    //         const pixelColor = image.getPixelColor(50, yPosition);
    //
    //         const rgbaColor = Jimp.intToRGBA(pixelColor);
    //         const color = getMatchingBrandColor([rgbaColor.r, rgbaColor.g, rgbaColor.b], confidenceThreshold, brandColors);
    //         const brandColor = brandColors[yIndex];
    //
    //         brandColor.name = getCoolGraySynonym(brandColor.name, brandColor.grade);
    //
    //         color.quality = quality;
    //         brandColor.quality = quality;
    //
    //         color.index = yIndex * COLOR_HEIGHT;
    //         brandColor.index = yIndex * COLOR_HEIGHT;
    //
    //         if ((brandColor.name !== color.name) || (brandColor.grade !== color.grade)) {
    //           console.log('tested color', rgbaColor);
    //           console.log('exprected', brandColor);
    //           console.log('actual', color);
    //           console.log('\n\n');
    //         }
    //
    //         assert.deepEqual(color, brandColor);
    //       }
    //
    //       if (quality === 100) {
    //         done();
    //       }
    //     });
    //
    //   }
    // });

    // Test matching colors
    it('should return confident brand color', () => {
      let color = getMatchingBrandColor([253, 214, 0], confidenceThreshold, brandColors);
      assert.deepEqual(color, { grade: 10, name: 'yellow', hex: '#FED500', rgb: [254, 213, 0] });

      color = getMatchingBrandColor([240, 86, 165], confidenceThreshold, brandColors);
      assert.deepEqual(color, { grade: 40, name: 'magenta', hex: '#FF509E', rgb: [255, 80, 158] });
    });

    // Test non-matching color
    it('should return null', () => {
      const color = getMatchingBrandColor([124, 205, 15], confidenceThreshold, brandColors);
      assert.strictEqual(color, null);
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
