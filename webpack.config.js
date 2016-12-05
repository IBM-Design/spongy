const path = require('path');

const src = path.join(__dirname, 'src/scripts');
const dist = path.join(__dirname, 'dist/scripts');

module.exports = {
  entry: {
    main: path.join(src, 'main.js'),
    popup: path.join(src, 'popup.js'),
    background: path.join(src, 'background.js'),
  },
  output: {
    path: dist,
    filename: "[name].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
};
