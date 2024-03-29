// stats.slash.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SlashBuild = require("../../utils/slash.build");
const os = require("os");

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows statistics about the bot"),

  async (interaction) => {
    try {
      // Get memory usage
      const totalMemory = os.totalmem();
      const usedMemory = process.memoryUsage().heapUsed;
      const memoryUsage = `${(usedMemory / 1024 / 1024).toFixed(2)} MB / ${(totalMemory / 1024 / 1024).toFixed(2)} MB`;

      // Get uptime
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor(uptime / 3600) % 24;
      const minutes = Math.floor(uptime / 60) % 60;
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Bot Statistics")
        .setDescription("[Add me to your server!](https://discord.com/oauth2/authorize?client_id=1215398905970303036&permissions=8&scope=bot)\n[Join my support server!](https://discord.gg/76v3WHhBfP)")
        .setThumbnail(interaction.client.user.avatarURL({ extension: "png" }))
        .addFields([
          { name: "Guilds", value: interaction.client.guilds.cache.size.toString(), inline: false },
          { name: "Memory Usage", value: memoryUsage, inline: false },
          { name: "Uptime", value: uptimeString, inline: false },
        ]);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  }
);