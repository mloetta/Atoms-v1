const registerHandler = require("../handles/register.handler");
const EventBuild = require("../utils/event.build");

module.exports = new EventBuild(
  "ready",
  "ready",
  async (client) => {
    console.log(`Hi ! Im ${client.user.username} !`);
    console.log(`total guilds ${client.guilds.cache.size}`);

    const devServer = await client.guilds.fetch("1193589991012577300");
    const devChannel = await devServer.channels.fetch("1193591095347642508");

    // devChannel.send("I'm live !");

    console.log(`Dev server ${devServer.name}`);
    console.log(`Dev channel ${devChannel.name}`);

    registerHandler(client, client.commands.slashes)
      .then(( ) => console.log(`All slashes registered`));
  }
);