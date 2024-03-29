const readDir = require("../utils/readDir");
const EventBuild = require("../utils/event.build");

module.exports = function eventHandler(path) {
  /** @type {EventBuild[ ]} */
  const events = [];

  readDir(path, (file) => {
    try {
      events.push(require(file));
    } catch (error) {
      console.error(`Failed to load event ${file}: ${error.message}`);
    }
  });

  return events;
};