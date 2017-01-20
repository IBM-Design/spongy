const Jimp = require('jimp');
const path = require('path');

const dirPath = 'test/resources'

Jimp.read(path.join(process.cwd(), dirPath, 'ibm-design-colors.png'), (error, image) => {
  if (error) {
    throw error;
  }

  const lowestQuality = 40;
  const maxQuality = 100;

  for (let qualityIndex = 40; qualityIndex <= maxQuality; qualityIndex += 10) {
    image.quality(qualityIndex)
      .write(path.join(process.cwd(), dirPath, `ibm-design-colors_quality-${qualityIndex}.jpg`));
  }
});
