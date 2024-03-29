const registerHandler = require("../handles/register.handler");
const EventBuild = require("../utils/event.build");

module.exports = new EventBuild(
  "guildCreate",
  "guildCreate",
  async (guild) => {
    console.log(`Joined a new guild: ${guild.name}`);

    // Registra os comandos ao entrar em um novo servidor
    registerHandler(guild.client, guild.client.commands.slashes)
      .then(() => console.log(`All slashes registered for the new guild`));
  }
);