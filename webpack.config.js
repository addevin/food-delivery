const tailwindcss = require('tailwindcss');
const postcssImport = require('postcss-import');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              postcssImport(),
              tailwindcss('./tailwind.config.js'),
            ],
          },
        },
      },
    ],
  },
};
