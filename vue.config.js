module.exports = {
  devServer: {
    public: 'localhost',
    port: 3000,
    publicPath: 'http://localhost:3000',
    proxy: {
      '/api/': {
        target: 'http://localhost:8000'
      }
    }
  },

  assetsDir: 'assets',

  indexPath: 'index.html',

  // transpileDependencies: [
  //   'vuetify'
  // ]
}
