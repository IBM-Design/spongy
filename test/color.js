import {assert} from 'chai';
import {hexColorToRgb, rgbColorToHex, colorContrast, matchScore, getMatchingBrandColor, rgbColorStringToArray} from '../src/scripts/utils/color';


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

    function roundToHundreds(number){
      return Math.round(number * 100) / 100;
    }

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

    it('should return confident aqua 40', () => {
      const color = getMatchingBrandColor([18, 163, 180], confidenceThreshold);
      assert.deepEqual(color, {grade: '40', name: 'aqua', hex: '#12a3b4', rgb: [18, 163, 180]});
    });

    it('should return confident aqua 90', () => {
      const color = getMatchingBrandColor([18, 42, 46], confidenceThreshold);
      assert.deepEqual(color, {grade: '90', name: 'aqua', hex: '#122a2e', rgb: [18, 42, 46]});
    });

    it('should return confident yellow 10', () => {
      const color = getMatchingBrandColor([253, 214, 0], confidenceThreshold);
      assert.deepEqual(color, {grade: '10', name: 'yellow', hex: '#fed500', rgb: [254, 213, 0]});
    });

    it('should return confident magenta 40', () => {
      const color = getMatchingBrandColor([230, 86, 165], confidenceThreshold);
      assert.deepEqual(color, {grade: '40', name: 'magenta', hex: '#ff509e', rgb: [255, 80, 158]});
    });

    it('should return null', () => {
      const color = getMatchingBrandColor([124, 205, 15], confidenceThreshold);
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
  })
});
