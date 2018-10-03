// These are the same aliases as in .babelrc
module.exports = {
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, './src/assets'),
      Fonts: path.resolve(__dirname, './src/assets/fonts'),
      Components: path.resolve(__dirname, './src/components'),
      Constants: path.resolve(__dirname, './src/constants'),
      Navigation: path.resolve(__dirname, './src/navigation'),
      Screens: path.resolve(__dirname, './src/screens'),
    },
  },
};
