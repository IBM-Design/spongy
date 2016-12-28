import {assert} from 'chai';
import {hexColorToRgb, rgbColorToHex, colorContrast, matchScore, getMatchingIbmColor} from '../src/scripts/utils/color';


describe('utils.color', () => {
  describe('#rgbColorToHex', () => {
    const color = [255, 255, 255];

    it('should return #ffffff', () => {
      assert.strictEqual(rgbColorToHex(color), '#ffffff');
    });

    it('should not return #bada55', () => {
      assert.notStrictEqual(rgbColorToHex(color), '#bada55');
    });
  });

  describe('#hexColorToRgb', () => {
    const color = '#ffffff';

    it('should return [255, 255, 255]', () => {
      assert.deepEqual(hexColorToRgb(color), [255, 255, 255]);
    });

    it('should not return [55, 140, 5]', () => {
      assert.notDeepEqual(hexColorToRgb(color), [55, 140, 5]);
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
    it('should return 765', () => {
      const testColor = [0, 0, 0];
      assert.strictEqual(matchScore(color, testColor), 765);
    });

    it('should return 487', () => {
      const testColor = [44, 79, 155];
      assert.strictEqual(matchScore(color, testColor), 487);
    });

    it('should return 78', () => {
      const testColor = [225, 228, 234];
      assert.strictEqual(matchScore(color, testColor), 78);
    });
  });

  describe('#getMatchingIbmColor', () => {
    const confidenceThreshold = 0.95;
    it('should return confident aqua 40', () => {
      const color = getMatchingIbmColor([18, 163, 180], confidenceThreshold);
      assert.deepEqual(color, {grade: '40', name: 'aqua', hex: '#12a3b4', rgb: [18, 163, 180], isConfident: true});
    });

    it('should return confident aqua 90', () => {
      const color = getMatchingIbmColor([18, 42, 46], confidenceThreshold);
      assert.deepEqual(color, {grade: '90', name: 'aqua', hex: '#122a2e', rgb: [18, 42, 46], isConfident: true});
    });

    it('should return confident yellow 10', () => {
      const color = getMatchingIbmColor([253, 214, 0], confidenceThreshold);
      assert.deepEqual(color, {grade: '10', name: 'yellow', hex: '#fed500', rgb: [254, 213, 0], isConfident: true});
    });

    it('should return not confident lime 30', () => {
      const color = getMatchingIbmColor([124, 205, 15], confidenceThreshold);
      assert.deepEqual(color, {grade: '30', name: 'lime', hex: '#81b532', rgb: [129, 181, 50], isConfident: false});
    });
  });
});
