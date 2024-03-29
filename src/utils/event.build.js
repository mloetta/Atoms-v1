/**
 * @template {keyof import("discord.js").ClientEvents} T
 */
module.exports = class EventBuild {
  /**
   * @param {string} name
   * @param {T} type
   * @param {(...args: import("discord.js").ClientEvents[T]) => void} callback
   */
  constructor(name, type, callback) {
    this.name = name;
    this.type = type;
    this.callback = callback;
  };
};