const fs = require('fs');
const cheerio = require('cheerio');
const {convert} = require('convert-svg-to-png');

class SplashScreen {
    constructor(path) {
        const svg = fs.readFileSync(path, 'utf8');
        this.cheerio = cheerio.load(svg);
    }

    setVersion(version) {
        this.cheerio('#Version text')[0].children[0].data = version;

        return this;
    }

    async toPNG(path, height, width) {
        const png = await convert(this.cheerio('body').html(), {height: height, width: width});
        fs.writeFileSync(path, png);
    }
}

module.exports = SplashScreen;
