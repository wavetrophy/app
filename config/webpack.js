var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
    useDefaultConfig.prod.devtool = 'inline-source-map';
    console.log('USED CUSTOM WEBPACK CONFIG')
    return useDefaultConfig;
}
