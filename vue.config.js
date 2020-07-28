const ConfigWebpackPlugin = require("config-webpack");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "lintOnSave": false,
  "configureWebpack": {
    plugins: [
      new ConfigWebpackPlugin()
    ]
  }
}