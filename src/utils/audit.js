const fs = require("fs");

module.exports = {
  cache: require(`${__dirname}/../database/audit.json`),
  
  save( ) {
    fs.writeFileSync(`${__dirname}/../database/audit.json`, JSON.stringify(this.cache, null, 2));
  }
};