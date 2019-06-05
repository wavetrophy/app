const fs = require('fs');
const cheerio = require('cheerio');
const {convert} = require('convert-svg-to-png');

class SVG {
    constructor(path) {
        const svg = fs.readFileSync(path, 'utf8');
        this.cheerio = cheerio.load(svg);
    }

    replace(query, text) {
        this.cheerio(query).innerText = text;

        return this;
    }

    async toPNG(path, height, width) {
        const png = await convert(this.cheerio('body').html(), {height: height, width: width});
        fs.writeFileSync(path, png);
    }
}

module.exports = SVG;
