const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = class SlashBuild {
  /**
   * @param {SlashCommandBuilder} body 
   * @param {(interaction: CommandInteraction) => void} callback 
   */
  constructor(body, callback) {
    this.body = body;
    this.name = body.name;
    this.callback = callback;
  };
};