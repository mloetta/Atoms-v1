const fs = require("fs");

/**
 * @param {string} path 
 * @param {(path: string) => void} callback 
 */
module.exports = function loadDir(path, callback) {
  fs.readdirSync(path)
    .forEach((file) => {
      if(file.endsWith("js")) {
        callback(`${path}\\${file}`);
      };
    });
};