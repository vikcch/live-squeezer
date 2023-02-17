process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {

  //  lintOnSave: false
  configureWebpack: {
    devtool: 'source-map'
  },
  productionSourceMap: false
}