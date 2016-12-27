import {assert} from 'chai';
import {hexColorToRgb, rgbColorToHex, colorContrast} from '../src/scripts/utils/color';


describe('White Color', () => {
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
});
