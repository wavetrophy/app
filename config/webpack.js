var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
    useDefaultConfig.prod.devtool = 'inline-source-map';
    useDefaultConfig.dev.devtool = 'inline-source-map';
    process.env.IONIC_SOURCE_MAP_TYPE = 'inline-source-map';
    console.log('USED CUSTOM WEBPACK CONFIG');
    return useDefaultConfig;
};
