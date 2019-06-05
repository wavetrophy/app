const fs = require('fs');
const cheerio = require('cheerio');

class XML {
    constructor(path) {
        const xml = fs.readFileSync(path, 'utf8');
        this.cheerio = cheerio.load(xml, {
            xmlMode: true
        });
    }

    replaceAttribute(query, attribute, text) {
        this.cheerio(query).attr(attribute, text);

        return this;
    }

    getAttribue(query, attribute) {
        return this.cheerio(query).attr(attribute);
    }

    save(path) {
        const xml = this.cheerio.xml();
        fs.writeFileSync(path, xml);
    }
}

module.exports = XML;
