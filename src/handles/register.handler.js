const { REST, Routes, Client } = require("discord.js");

const SlashBuild = require("../utils/slash.build");

/**
 * @param {Client} client 
 * @param {SlashBuild[ ]} slashes
 */
module.exports = async function registerHandle(client, slashes) {
  const api = new REST( )
    .setToken(process.env.CLIENT_TOKEN);

  slashes = slashes.map((slash) => {
    return slash.body.toJSON( );
  });

  return Promise.all(client.guilds.cache.map((guild) => {
    return api.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: slashes })
      .catch((error) => {
        console.log(error);
        console.log(`Fail to registry slashes on ${guild.name} (${guild.id})`)
      });
  }));
};